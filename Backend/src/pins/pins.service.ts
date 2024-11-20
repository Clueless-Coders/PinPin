import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Pin } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';
import { CreatePinDTO, UpdatePinDTO } from './dto/pins.dto';
import { Request } from 'express';

@Injectable()
export class PinsService {
  constructor(private readonly databaseService: DatabaseService) {}

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

  // async getAllPins() {
  //     return this.databaseService.pin.findMany();
  // }

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

  async updatePin(pinID: number, updatePinDTO: UpdatePinDTO, req?: Request) {
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

    return await this.databaseService.pin.delete({
      where: {
        id: pinID,
        userID: currUser.id,
      },
    });
  }
}
// @Get()
// getAllPins(){
//     return []
// }

// @Get(':id')
// getPin(@Param('id') id: string){
//     return {id}
// }

// @Post()
// postPin(@Body() createPinDto: Prisma.PinCreateInput){
//     return this.pinsService.create(createPinDto);
// }

// @Delete()
// deletePin(@Param('id') id: string){
//     return id;
// }
