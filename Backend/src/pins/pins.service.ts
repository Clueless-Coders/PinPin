import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import {
  CreatePinDTO,
  UpdatePinDTO,
  CreateCommentDTO,
  UpdatePinOptions,
} from './dto/pins.dto';
import { Request } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';
import { computeDestinationPoint } from 'geolib';
import {
  InvisiblePin,
  VisiblePin,
} from 'src/interfaces/invisible-pin.interface';
import { UsersService } from 'src/users/users.service';
import { PinCreateResponse, PinQuery } from 'src/interfaces/PinQuery.interface';
import { ImagesService } from 'src/images/images.service';

@Injectable()
export class PinsService {
  constructor(
    private readonly databaseService: PrismaService,
    private readonly userService: UsersService,
    private readonly imagesService: ImagesService,
  ) {}

  /**
   * Creates a new Pin in the database with the specified userId
   * @param createPin
   * @param req
   * @returns
   */
  async create(
    createPin: CreatePinDTO,
    userId: number,
  ): Promise<PinCreateResponse> {
    try {
      const created = await this.databaseService.pin.create({
        data: {
          text: createPin.text,
          userID: userId,
          longitude: createPin.longitude,
          latitude: createPin.latitude,
        },
      });

      let s3Ref: { url: string; key: string };
      if (createPin.isUploadingImage) {
        s3Ref = await this.imagesService.createImagePresignUrlS3(
          created.id,
          'post',
        );
        await this.updatePin(
          created.id,
          {
            imageURL: s3Ref.key,
          },
          userId,
        );
      }

      return {
        ...created,
        presignUrl: s3Ref?.url,
        key: s3Ref?.key,
      };
    } catch (e) {
      PrismaService.handlePrismaError(e, 'Pin', 'userId: ' + userId);
    }
  }

  async getPin(pinID: number, userId?: number): Promise<PinQuery> {
    try {
      const res = await this.databaseService.pin.findUniqueOrThrow({
        where: {
          id: pinID,
        },
        include: {
          // if userId provided, get their vote status for this pin
          Vote: userId
            ? {
                select: {
                  value: true,
                },
                where: {
                  userId,
                },
              }
            : undefined,
        },
      });

      const points = await this.getPinPoints(pinID);
      const ret = {
        ...res,
        points,
        userVoteStatus: res.Vote[0]?.value ?? 0,
      };
      return ret;
    } catch (e) {
      PrismaService.handlePrismaError(e, 'Pin', 'pinId: ' + pinID);
    }
  }

  async updatePin(
    pinID: number,
    updatePinDTO: UpdatePinOptions,
    userId: number,
  ) {
    const pinToEdit = await this.getPin(pinID, userId);

    if (userId !== pinToEdit.userID)
      throw new ForbiddenException('User can only edit their own pin');

    let s3Ref: { url: string; key: string } | undefined;
    if (updatePinDTO.willUploadImage) {
      s3Ref = await this.imagesService.createImagePresignUrlS3(pinID, 'post');
      updatePinDTO.imageURL = s3Ref.key;
    }

    try {
      const res = await this.databaseService.pin.update({
        where: {
          id: pinID,
        },
        data: updatePinDTO,
      });

      return { ...res, uploadURL: s3Ref?.url, imageURL: s3Ref?.key };
    } catch (e: any) {
      PrismaService.handlePrismaError(e, 'Pin', 'pinId' + pinID);
    }
  }

  /**
   * Counts the total number of upvotes/downvotes on the pin referenced by ID
   * @param id
   * @returns
   */
  async getPinPoints(id: number): Promise<number> {
    try {
      const res = await this.databaseService.pinVote.aggregate({
        _sum: {
          value: true,
        },
        where: {
          pinId: id,
        },
      });
      return res._sum.value ?? 0;
    } catch (e: any) {
      PrismaService.handlePrismaError(e, 'Pin', 'id: ' + id);
    }
  }

  /**
   * Upvotes or downvotes a pin for a user by their respective IDs
   * If the user tries to take the same action they already have on record,
   * calling this method again will delete their action. Otherwise, it will
   * save the indicated action to the database. (Think about how reddit's karma
   * system works)
   *
   * @param pinId
   * @param userId
   * @param isUpvote
   * @returns An object containing the current amount of points the pin has in total
   * and a message detailing the action the server took to fulfill the request
   */
  async togglePinVote(
    pinId: number,
    userId: number,
    isUpvote: boolean,
  ): Promise<{ points: number; message: string; userVoteStatus: number }> {
    const valToSet = isUpvote ? 1 : -1;
    const currentState = await this.userService.getPinVoteById(userId, pinId);
    const word = valToSet == 1 ? 'upvote' : 'downvote';

    try {
      if (!currentState) {
        await this.databaseService.pinVote.create({
          data: {
            pinId,
            userId,
            value: valToSet,
          },
        });
        return {
          points: await this.getPinPoints(pinId),
          userVoteStatus: valToSet,
          message: 'Created new ' + word + ' for user',
        };
      }

      // User already has value equal to what they want to change - delete vote
      // Otherwise, set to current value
      if (currentState.value == valToSet) {
        await this.databaseService.pinVote.delete({
          where: {
            userId_pinId: {
              userId,
              pinId,
            },
          },
        });
        return {
          points: await this.getPinPoints(pinId),
          userVoteStatus: 0,
          message: 'Deleted Pin vote for user',
        };
      } else {
        await this.databaseService.pinVote.update({
          where: {
            userId_pinId: {
              userId,
              pinId,
            },
          },
          data: {
            value: valToSet,
          },
        });

        return {
          points: await this.getPinPoints(pinId),
          userVoteStatus: valToSet,
          message: 'Updated previous Pin vote to ' + word,
        };
      }
    } catch (e: any) {
      PrismaService.handlePrismaError(
        e,
        'PinVote',
        `pinId: ${pinId} userId: ${userId}`,
      );
    }
  }

  async removePin(pinID: number, req?: Request) {
    const currUser = req['user'];
    const pinToDelete = await this.getPin(pinID);

    if (pinToDelete.userID !== currUser.id)
      throw new ForbiddenException('User can only delete their own pins');

    await this.databaseService.viewable.deleteMany({
      where: { pinId: pinID },
    });

    try {
      return await this.databaseService.pin.delete({
        where: {
          id: pinID,
          userID: currUser.id,
        },
      });
    } catch (e: any) {
      PrismaService.handlePrismaError(e, 'Pin', 'pinID: ' + pinID);
    }
  }

  /**
   * Gets pins by a location range. The boundary box is defined by the Northeast and Southwest coordinates.
   * Returns an array of pins within this boundary box.
   * @param neLat
   * @param neLong
   * @param swLat
   * @param swLong
   */
  async getPinsInLocationRangeByUserId(
    neLat: number,
    neLong: number,
    swLat: number,
    swLong: number,
    userId: number,
  ): Promise<{ visible: VisiblePin[]; invisible: InvisiblePin[] }> {
    const [invisRes, visRes] = await Promise.all([
      this.getInvisiblePinsInLocationRange(
        neLat,
        neLong,
        swLat,
        swLong,
        userId,
      ),
      this.getViewablePinsInLocationRange(neLat, neLong, swLat, swLong, userId),
    ]);

    return {
      visible: visRes,
      invisible: invisRes,
    };
  }

  /**
   * Based on provided user ID, gets all pins marked as viewable within the provided boundary box
   * @param neLat
   * @param neLong
   * @param swLat
   * @param swLong
   * @param userId
   * @returns
   */
  async getViewablePinsInLocationRange(
    neLat: number,
    neLong: number,
    swLat: number,
    swLong: number,
    userId: number,
  ): Promise<VisiblePin[]> {
    const viewable = await this.getVisiblePinsByUserID(userId);

    return viewable.reduce((prev, curr) => {
      const lat = curr.latitude;
      const long = curr.longitude;
      //Checks if the current visible pin is within the provided boundary box
      if (lat >= swLat && lat <= neLat && long <= neLong && long >= swLong)
        //Add to returned array if so
        prev.push({ ...curr, viewable: true });
      return prev;
    }, [] as VisiblePin[]);
  }

  /**
   * Based on provided user ID, gets all pins marked as invisible within the provided boundary box
   * @param neLat
   * @param neLong
   * @param swLat
   * @param swLong
   * @param userId
   * @returns
   */
  async getInvisiblePinsInLocationRange(
    neLat: number,
    neLong: number,
    swLat: number,
    swLong: number,
    userId: number,
  ): Promise<InvisiblePin[]> {
    try {
      const res = await this.databaseService.pin.findMany({
        where: {
          AND: [
            {
              latitude: {
                gte: swLat,
              },
            },
            {
              latitude: {
                lte: neLat,
              },
            },
            {
              longitude: {
                lte: neLong,
              },
            },
            {
              longitude: {
                gte: swLong,
              },
            },
            {
              Viewable: {
                none: {
                  userId,
                },
              },
            },
          ],
        },
        select: {
          latitude: true,
          longitude: true,
          createdAt: true,
          updatedAt: true,
          userID: true,
          id: true,
        },
      });
      const mut = res.map((invisPin) => ({
        ...invisPin,
        viewable: false,
        _count: undefined,
      }));
      return mut;
    } catch (e: any) {
      PrismaService.handlePrismaError(e, 'Pin', 'location');
    }
  }

  /**
   * Gets all pins in a location range. Should be admin only.
   * @param neLat
   * @param neLong
   * @param swLat
   * @param swLong
   * @returns
   */
  async getAllPinsInLocationRange(
    neLat: number,
    neLong: number,
    swLat: number,
    swLong: number,
  ) {
    try {
      const res = await this.databaseService.pin.findMany({
        where: {
          AND: [
            {
              latitude: {
                gte: swLat,
              },
            },
            {
              latitude: {
                lte: neLat,
              },
            },
            {
              longitude: {
                lte: neLong,
              },
            },
            {
              longitude: {
                gte: swLong,
              },
            },
          ],
        },
      });
      return res;
    } catch (e: any) {
      PrismaService.handlePrismaError(e, 'Pin', '');
    }
  }

  /**
   * Gets all pins marked as visible for the provided user ID
   * @param userID
   * @returns
   */
  async getVisiblePinsByUserID(userId: number): Promise<PinQuery[]> {
    try {
      const res = await this.databaseService.viewable.findMany({
        where: {
          userId,
        },
        select: {
          pin: {
            include: {
              Vote: {
                where: {
                  userId,
                },
                select: {
                  value: true,
                },
              },
            },
          },
        },
      });

      const totalVotesPromises: Promise<number>[] = [];
      const pins = res.map((pin) => {
        totalVotesPromises.push(this.getPinPoints(pin.pin.id));
        return {
          id: pin.pin.id,
          userID: pin.pin.userID,
          text: pin.pin.text,
          imageURL: pin.pin.imageURL,
          longitude: pin.pin.longitude,
          latitude: pin.pin.latitude,
          createdAt: pin.pin.createdAt,
          updatedAt: pin.pin.updatedAt,
          userVoteStatus: pin.pin.Vote[0]?.value ?? 0,
        };
      });

      const totalVotes = await Promise.all(totalVotesPromises);
      return pins.map((pin, index) => ({
        ...pin,
        points: totalVotes[index],
      }));
    } catch (e: any) {
      PrismaService.handlePrismaError(e, 'Pin', 'userId: ' + userId);
    }
  }

  /**
   * Given the provided location, calculate new pins to be marked visible then update the user accordingly
   * @param location
   * @param userID
   * @returns
   */
  async markVisibleByLocation(
    location: {
      latitude: number;
      longitude: number;
    },
    userID: number,
  ) {
    //Gets upper left and bottom right location bounds for pins to be marked as visible
    const swBearingInDegs = 225;
    const neBearningInDegs = 45;
    const radiusToMarkVisibleInMeters = 200;
    const swLoc = computeDestinationPoint(
      location,
      radiusToMarkVisibleInMeters,
      swBearingInDegs,
    );
    const neLoc = computeDestinationPoint(
      location,
      radiusToMarkVisibleInMeters,
      neBearningInDegs,
    );

    let pinsToMakeVisible: InvisiblePin[];
    try {
      //Gets all pins within the boundary box defined previously
      pinsToMakeVisible = await this.getInvisiblePinsInLocationRange(
        neLoc.latitude,
        neLoc.longitude,
        swLoc.latitude,
        swLoc.longitude,
        userID,
      );
    } catch (e: any) {
      PrismaService.handlePrismaError(e, 'Pin', '' + userID);
    }

    //Creates viewable relationship for pins to users...
    const viewables = pinsToMakeVisible.map((pin) => ({
      pinId: pin.id,
      userId: userID,
    }));

    try {
      //...And uploads them to the database
      await this.databaseService.viewable.createMany({
        data: viewables,
      });
    } catch (e: any) {
      PrismaService.handlePrismaError(e, 'Pin', 'location');
    }

    return pinsToMakeVisible;
  }

  async createComment(CommentDTO: CreateCommentDTO, userID: number) {
    try {
      return await this.databaseService.comment.create({
        data: {
          pinID: CommentDTO.pinID,
          userID,
          text: CommentDTO.text,
        },
      });
    } catch (e) {
      PrismaService.handlePrismaError(e, 'Pin', 'userId: ' + userID);
    }
  }

  async getComments(pinID: number) {
    try {
      const res = await this.databaseService.comment.findMany({
        where: {
          pinID: pinID,
        },
      });
      return res;
    } catch (e) {
      PrismaService.handlePrismaError(e, 'Commnet', 'pinId' + pinID);
    }
  }

  async getComment(commentID: number) {
    try {
      return await this.databaseService.comment.findUnique({
        where: {
          id: commentID,
        },
      });
    } catch (e) {
      PrismaService.handlePrismaError(e, 'Commnet', 'commentId' + commentID);
    }
  }
}
