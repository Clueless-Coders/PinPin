import {
  Controller,
  Param,
  Get,
  Post,
  Body,
  Delete,
  Patch,
  Req,
  Put,
} from '@nestjs/common';
import { PinsService } from './pins.service';
import {
  CreatePinDTO,
  LocationDTO,
  LocationRangeDTO,
  UpdatePinDTO,
  UpdateVotes,
  CreateCommentDTO,
} from './dto/pins.dto';
import { Request } from 'express';

@Controller()
export class PinsController {
  constructor(private readonly pinsService: PinsService) {}

  @Post('location')
  async getPinsByLocationRange(@Body() loc: LocationRangeDTO, @Req() { user }) {
    return await this.pinsService.getPinsInLocationRangeByUserId(
      loc.neLat,
      loc.neLong,
      loc.swLat,
      loc.swLong,
      user.id,
    );
  }

  @Post('location/all')
  async getAllPinsByLocationRange(@Body() loc: LocationRangeDTO) {
    return await this.pinsService.getAllPinsInLocationRange(
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
  async getPin(@Param('id') id: string) {
    return await this.pinsService.getPin(+id);
  }

  @Post()
  async postPin(@Body() createPinDTO: CreatePinDTO, @Req() request: Request) {
    return await this.pinsService.create(createPinDTO, request);
  }

  @Post('visible')
  async markPinsVisibleByLocation(@Body() loc: LocationDTO, @Req() { user }) {
    return await this.pinsService.markVisibleByLocation(loc, user.id);
  }

  @Put(':id/upvote')
  async patchUpvote(@Param('id') id: string, @Req() { user }) {
    return await this.pinsService.togglePinVote(+id, user.id, true);
  }

  @Put(':id/downvote')
  async downvote(@Param('id') id: string, @Req() { user }) {
    return await this.pinsService.togglePinVote(+id, user.id, false);
  }

  @Patch(':id')
  async updatePin(
    @Param('id') id: string,
    @Body() updatePinDTO: UpdatePinDTO,
    @Req() { user },
  ) {
    return await this.pinsService.updatePin(+id, updatePinDTO, user.id);
  }

  //change delete to check if user is deleting their own posts
  @Delete(':id')
  async deletePin(@Param('id') id: string, @Req() request: Request) {
    return await this.pinsService.removePin(+id, request);
  }

  @Post('comments')
  async postComment(@Body() commentDTO: CreateCommentDTO, @Req() { user }) {
    return await this.pinsService.createComment(commentDTO, user.id);
  }

  @Get('comments/:id')
  async getComment(@Param('id') pinId: string) {
    return await this.pinsService.getComments(+pinId);
  }
}
