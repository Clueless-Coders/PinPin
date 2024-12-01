import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Pin } from '@prisma/client';
import { CreatePinDTO, UpdatePinDTO } from './dto/pins.dto';
import { Request } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';
import { computeDestinationPoint } from 'geolib';
import {
  InvisiblePin,
  VisiblePin,
} from 'src/interfaces/invisible-pin.interface';

@Injectable()
export class PinsService {
  constructor(private readonly databaseService: PrismaService) {}

  async create(createPin: CreatePinDTO, req: Request) {
    try {
      return await this.databaseService.pin.create({
        data: {
          text: createPin.text,
          userID: req['user'].id,
          imageURL: createPin.imageURL, // This will be optional
          longitude: createPin.longitude,
          latitude: createPin.latitude,
          downvotes: 0,
          upvotes: 0,
        },
      });
    } catch (e) {
      throw new InternalServerErrorException('Pin create failed.', e);
    }
  }

  async getPin(pinID: number) {
    let res: Pin;
    try {
      res = await this.databaseService.pin.findUnique({
        where: {
          id: pinID,
        },
      });
    } catch (e) {
      throw new InternalServerErrorException('DB call failed');
    }

    if (!res)
      throw new NotFoundException('Pin with ID ' + pinID + ' not found.');
    return res;
  }

  async updatePin(pinID: number, updatePinDTO: UpdatePinDTO, req: Request) {
    const currUser = req['user'];
    const pinToEdit = await this.getPin(pinID);

    if (currUser.id !== pinToEdit.userID)
      throw new ForbiddenException('User can only edit their own pin');

    return this.databaseService.pin.update({
      where: {
        id: pinID,
      },
      data: updatePinDTO,
    });
  }

  async patchUpvote(pinID: number, increment: number) {
    // return this.databaseService.pin.update({
    //     where: {
    //         id: pinID,
    //     },
    //     data: { upvotes: { increment: increment } },
    // });
  }

  async patchDownvote(pinID: number, increment: number) {
    // return this.databaseService.pin.update({
    //     where: {
    //         id: pinID,
    //     },
    //     data: { downvotes: { increment: increment } },
    // });
  }

  async removePin(pinID: number, req?: Request) {
    const currUser = req['user'];
    const pinToDelete = await this.getPin(pinID);

    if (pinToDelete.userID !== currUser.id)
      throw new ForbiddenException('User can only delete their own pins');

    await this.databaseService.viewable.deleteMany({
      where: { pinId: pinID },
    });

    return await this.databaseService.pin.delete({
      where: {
        id: pinID,
        userID: currUser.id,
      },
    });
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

  async getViewablePinsInLocationRange(
    neLat: number,
    neLong: number,
    swLat: number,
    swLong: number,
    userId: number,
  ): Promise<VisiblePin[]> {
    const viewable = await this.getVisiblePinsByUserID(userId);

    return viewable.reduce((prev, curr) => {
      const lat = curr.pin.latitude;
      const long = curr.pin.longitude;
      if (lat >= swLat && lat <= neLat && long <= neLong && long >= swLong)
        prev.push({ ...curr.pin, viewable: true });
      return prev;
    }, [] as VisiblePin[]);
  }

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
      const mut = res.map((invisPin) => ({ ...invisPin, viewable: false }));
      return mut;
    } catch (e: any) {
      console.log(e);
      throw new InternalServerErrorException('DB call failed ', e);
    }
  }

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
      console.log(e);
      throw new InternalServerErrorException('Database query failed ', e);
    }
  }

  /**
   * Gets all pins marked as visible for the provided user ID
   * @param userID
   * @returns
   */
  async getVisiblePinsByUserID(userId: number) {
    try {
      const res = await this.databaseService.viewable.findMany({
        where: {
          userId,
        },
        select: {
          pin: true,
        },
      });
      return res;
    } catch (e: any) {
      console.log(e);
      throw new InternalServerErrorException('Database query failed', e);
    }
  }

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
    const radiusToMarkVisibleInMeters = 1000;
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
      console.log(e);
      throw new InternalServerErrorException('Database query failed', e);
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
      console.log(e);
      throw new InternalServerErrorException('Marking Pins visible failed', e);
    }

    return pinsToMakeVisible;
  }
}
