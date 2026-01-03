import { Controller } from '@nestjs/common';
import { ImagesService } from './images.service';

@Controller()
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}
  // create
  async createImageS3() {}
  // read
  // update
  // delete
}
