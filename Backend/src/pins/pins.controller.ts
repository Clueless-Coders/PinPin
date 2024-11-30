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
    async getPin(@Param('id') id: String) {
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

    @Post(':id/upvotes')
    patchUpvote(@Param('id') id: String, @Body() increment: UpdateVotes) {
        return 'not implemented yet :(';
    }

    @Post(':id/downvotes')
    patchDownvote(@Param('id') id: String, @Body() increment: UpdateVotes) {
        return 'not implemented yet :(';
    }

    @Patch(':id')
    async updatePin(
        @Param('id') id: String,
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
