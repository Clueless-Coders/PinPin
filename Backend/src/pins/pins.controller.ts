import { Controller, Param, Get, Post, Body, Delete, Patch, Req } from '@nestjs/common';
import { PinsService } from './pins.service';
import { Prisma } from '@prisma/client';
import { CreatePinDTO, UpdatePinDTO, UpdateVotes } from './dto/pins.dto';
import { Request } from 'express';

@Controller()
export class PinsController {
    constructor(private readonly pinsService: PinsService) { }

    // @Get()
    // getAllPins() {
    //     return this.pinsService.getAllPins()
    // }

    @Get(':id')
    getPin(@Param('id') id: String) {
        return this.pinsService.getPin(+id)
    }

    @Post()
    postPin(@Body() createPinDTO: CreatePinDTO, @Req() request: Request) {
        return this.pinsService.create(createPinDTO, request);
    }

    @Post(":id/upvotes")
    patchUpvote(@Param('id') id: String, @Body() increment: UpdateVotes) {
        return "not implemented yet :(";
        // return this.pinsService.patchUpvote(+id, increment['increment']);
    }

    @Post(":id/downvotes")
    patchDownvote(@Param('id') id: String, @Body() increment: UpdateVotes) {
        return "not implemented yet :(";
        // return this.pinsService.patchDownvote(+id, increment['increment']);
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
