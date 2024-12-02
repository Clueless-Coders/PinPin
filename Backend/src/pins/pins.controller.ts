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
    LocationDTO,
    LocationRangeDTO,
    UpdatePinDTO,
    UpdateVotes,
} from './dto/pins.dto';
import { Request } from 'express';
import { request } from 'http';
import { createVotesDTO } from './dto/pins.dto';
@Controller()
export class PinsController {
    constructor(private readonly pinsService: PinsService) { }

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

    @Post(':id/votes')
    async postPinVote(@Body() vote: createVotesDTO, @Req() request: Request) {
        return await this.pinsService.postPinVote(vote, request);
    }

    @Post('comment/:id/votes')
    async postCommentVote(@Body() vote: createVotesDTO, @Req() request: Request) {
        return await this.pinsService.postCommentVote(vote, request);
    }

    @Get(':id/votes')
    async getPinVote(@Param('id') id: string) {
        return await this.pinsService.getPinVotes(+id);
    }

    @Get('comment/:id/votes')
    async getCommentVote(@Param('id') id: string) {
        return await this.pinsService.getCommentVotes(+id);
    }

    @Delete(':id/votes')
    async deletePinVote(@Param('id') id: string, @Req() req: Request) {
        return await this.pinsService.deletePinVote(+id, req);
    }

    @Delete('comment/:id/votes')
    async deleteCommentVote(@Param('id') id: string, @Req() req: Request) {
        return await this.pinsService.deleteCommentVote(+id, req);
    }

    @Patch(':id')
    async updatePin(
        @Param('id') id: string,
        @Body() updatePinDTO: UpdatePinDTO,
        @Req() req: Request,
    ) {
        return await this.pinsService.updatePin(+id, updatePinDTO, req);
    }

    //change delete to check if user is deleting their own posts
    @Delete(':id')
    async deletePin(@Param('id') id: String, @Req() request: Request) {
        return await this.pinsService.removePin(+id, request);
    }
}
