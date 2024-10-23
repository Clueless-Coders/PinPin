import { Controller, Param, Get } from '@nestjs/common';

@Controller('pins')
export class PinsController {
    @Get()
    getAllPins(){
        return []
    }

    @Get(':id')
    getPin(@Param('id') id: string){
        return {id}
    }

    

}
