import {
  Controller,
  Param,
  Get,
  Post,
  Body,
  Delete,
  Patch,
  Req,
} from '@nestjs/common';
import { PinsService } from './pins.service';
import {
  CreatePinDTO,
  LocationRangeDTO,
  UpdatePinDTO,
  UpdateVotes,
} from './dto/pins.dto';
import { Request } from 'express';

@Controller()
export class PinsController {
  constructor(private readonly pinsService: PinsService) {}

  @Get('location')
  async getPinsByLocationRange(@Body() loc: LocationRangeDTO) {
    return await this.pinsService.getPinsInLocationRange(
      loc.neLat,
      loc.neLong,
      loc.swLat,
      loc.swLong,
    );
  }

  @Get('visible')
  async getVisiblePins(@Req() { user }) {
    return await this.pinsService.getVisiblePinsByUserID(user.id);
  }

  @Get(':id')
  getPin(@Param('id') id: String) {
    return this.pinsService.getPin(+id);
  }

  @Post()
  postPin(@Body() createPinDTO: CreatePinDTO, @Req() request: Request) {
    return this.pinsService.create(createPinDTO, request);
  }

  @Post(':id/upvotes')
  patchUpvote(@Param('id') id: String, @Body() increment: UpdateVotes) {
    return 'not implemented yet :(';
  }

  @Post(':id/downvotes')
  patchDownvote(@Param('id') id: String, @Body() increment: UpdateVotes) {
    return 'not implemented yet :(';
  }

  @Patch(':id')
  updatePin(@Param('id') id: String, @Body() updatePinDTO: UpdatePinDTO) {
    return this.pinsService.updatePin(+id, updatePinDTO);
  }

  //change delete to check if user is deleting their own posts
  @Delete(':id')
  deletePin(@Param('id') id: String, @Req() request: Request) {
    return this.pinsService.removePin(+id, request);
  }
}
