import {
  IsBoolean,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class CreatePinDTO {
  @IsString()
  @Length(1, 300)
  text: string;

  @IsOptional()
  @IsBoolean()
  isUploadingImage?: boolean;

  @IsNumber()
  longitude: number;

  @IsNumber()
  latitude: number;
}

export class CreateCommentDTO {
  @IsInt()
  pinID: number;
  @IsString()
  @Length(1, 300)
  text: string;
}

export class UpdatePinDTO {
  @IsString()
  @IsOptional()
  @Length(1, 300)
  text?: string;

  @IsOptional()
  @IsBoolean()
  willUploadImage?: boolean;
}

export interface UpdatePinOptions extends UpdatePinDTO {
  imageURL?: string;
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
