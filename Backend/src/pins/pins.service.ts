import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class PinsService {
    constructor(private readonly databaseService: DatabaseService){}

    async create(createPin : Prisma.PinCreateInput){
        return this.databaseService.pin.create({data: createPin});
    }

    async getAllPins(){
        return this.databaseService.pin.findMany();
    }

    async getPin(pinID: number){
        return this.databaseService.pin.findUnique({
            where : { 
                id: pinID,
            }
        });
    } 

    async updatePin(pinID: number,updatePinDTO: Prisma.PinUpdateInput){
        return this.databaseService.pin.update({ 
            where: {
                id: pinID,
            },
            data: updatePinDTO,
        });
    }

    async removePin(pinID: number){
        return this.databaseService.pin.delete({
            where : {
                id: pinID,
            }
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