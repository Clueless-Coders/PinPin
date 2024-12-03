import { IsInt, IsNumber, IsOptional, IsString, Length } from 'class-validator';

export class CreatePinDTO {
  @IsString()
  @Length(1, 300)
  text: string;

  @IsOptional()
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
}

export class UpdateVotes {
  @IsInt()
  changeBy: number;
}

export class LocationRangeDTO {
  @IsNumber()
  neLat: number;

  @IsNumber()
  neLong: number;

  @IsNumber()
  swLat: number;

  @IsNumber()
  swLong: number;
}

export class LocationDTO {
  @IsNumber()
  latitude: number;

  @IsNumber()
  longitude: number;
}

export class createVotesDTO {
  @IsInt()
  postID: number
  @IsInt()
  vote: number
}