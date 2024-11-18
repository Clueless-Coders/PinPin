import { IsInt, IsNumber, IsOptional, IsString, Length } from "class-validator";

export class CreatePinDTO {
    @IsString()
    @Length(1, 300)
    text: string;
    @IsInt()
    userID: number;
    @IsString()
    imageURL?: string;
    @IsNumber()
    longitude: number;
    @IsNumber()
    latitude: number;
}

export class UpdatePinDTO {
    @IsString()
    @Length(1, 300)
    text: string;
    @IsString()
    imageURL: string;
    @IsInt()
    downvote: number;
    @IsInt()
    upvote: number;

}