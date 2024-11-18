import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';
import { CreatePinDTO, UpdatePinDTO } from './dto/pins.dto';

@Injectable()
export class PinsService {
    constructor(private readonly databaseService: DatabaseService){}

    async create(createPin : CreatePinDTO){
        return this.databaseService.pin.create({data:{
            text: createPin.text,
            userID: createPin.userID,
            imageURL: createPin.imageURL, // This will be optional
            longitude: createPin.longitude,
            latitude: createPin.latitude,
            downvotes: 0,
            upvotes: 0
        }
        });
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

    async updatePin(pinID: number,updatePinDTO:UpdatePinDTO ){
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