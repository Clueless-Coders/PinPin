import { Controller, Param, Get, Post, Body, Delete, Patch } from '@nestjs/common';
import { PinsService } from './pins.service';
import { Prisma } from '@prisma/client';

@Controller('pins')
export class PinsController {
    constructor(private readonly pinsService: PinsService){}

    @Get()
    getAllPins(){
        return this.pinsService.getAllPins()
    }

    @Get(':id')
    getPin(@Param('id') id: String){
        return this.pinsService.getPin(+id)
    }

    @Post()
    postPin(@Body() createPinDto: Prisma.PinCreateInput){
        return this.pinsService.create(createPinDto);  
    }

    @Patch(':id')
    updatePin(@Param('id') id: String, @Body() updatePinDTO: Prisma.PinUpdateInput){
        return this.pinsService.updatePin(+id, updatePinDTO);
    }

    @Delete(':id')
    deletePin(@Param('id') id: String){
        return this.pinsService.removePin(+id);
    }
}
