import {
  CreateBucketCommand,
  paginateListBuckets,
  S3Client,
  waitUntilBucketExists,
} from '@aws-sdk/client-s3';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ImagesService implements OnModuleInit {
  private client: S3Client;
  private bucketName: string;
  private awsRegion: string;
  private readonly logger = new Logger(ImagesService.name);

  constructor(private readonly configService: ConfigService) {
    // Ensure AWS credentials are set in environment variables
    this.awsRegion = this.configService.getOrThrow<string>('AWS_REGION');
    this.configService.getOrThrow<string>('AWS_ACCESS_KEY_ID');
    this.configService.getOrThrow<string>('AWS_SECRET_ACCESS_KEY');

    this.client = new S3Client({
      region: this.awsRegion,
    });
    this.bucketName =
      this.configService.getOrThrow<string>('AWS_S3_BUCKET_NAME');
  }

  async onModuleInit() {
    const bucketExists = await this.checkIfS3BucketExists();
    if (!bucketExists) {
      await this.createS3Bucket();
    }
    this.logger.log(`Images referenced from S3 Bucket: ${this.bucketName}`);
  }

  async checkIfS3BucketExists() {
    const paginator = paginateListBuckets({ client: this.client }, {});
    for await (const page of paginator) {
      if (page.Buckets) {
        const res = page.Buckets.find(
          (bucket) => bucket.Name === this.bucketName,
        );
        if (res) {
          return true;
        }
      }
    }
    return false;
  }

  async createS3Bucket() {
    const { Location } = await this.client.send(
      new CreateBucketCommand({
        Bucket: this.bucketName,
      }),
    );

    await waitUntilBucketExists(
      { client: this.client, maxWaitTime: 20 },
      { Bucket: this.bucketName },
    );
    this.logger.log(`Created S3 Bucket: ${Location}`);
  }

  // create
  async createImageS3() {}
  // read
  // update
  // delete
}
