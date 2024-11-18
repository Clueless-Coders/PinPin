import { Controller, Param, Get, Post, Body, Delete, Patch } from '@nestjs/common';
import { PinsService } from './pins.service';
import { Prisma } from '@prisma/client';
import { CreatePinDTO, UpdatePinDTO} from './dto/pins.dto';

@Controller()
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
    postPin(@Body() createPinDTO: CreatePinDTO){
        return this.pinsService.create(createPinDTO);  
    }

    @Patch(':id')
    updatePin(@Param('id') id: String, @Body() updatePinDTO: UpdatePinDTO){
        return this.pinsService.updatePin(+id, updatePinDTO);
    }

    @Delete(':id')
    deletePin(@Param('id') id: String){
        return this.pinsService.removePin(+id);
    }
}
