import {
  CreateBucketCommand,
  DeleteObjectCommand,
  paginateListBuckets,
  PutObjectCommand,
  S3Client,
  waitUntilBucketExists,
  waitUntilObjectNotExists,
} from '@aws-sdk/client-s3';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

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

  /**
   * Check if the S3 bucket specified in the environment variables exists.
   * @returns
   */
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

  /**
   * Create the S3 bucket specified in the environment variables.
   * WARNING: ONLY CALL IF YOU ARE SURE THE BUCKET DOES NOT EXIST.
   */
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
  async createImagePresignUrlS3(id: number, type: 'comment' | 'post') {
    const uuid = crypto.randomUUID();
    const key = `${type}/${id}-${uuid}`;
    const command = new PutObjectCommand({ Bucket: this.bucketName, Key: key });
    this.logErrorIfImageNotUploaded(key);

    return {
      url: await getSignedUrl(this.client, command, { expiresIn: 3600 }),
      key,
    };
  }

  // read
  // update
  // delete
  async deleteImageS3(key: string) {
    await this.client.send(
      new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      }),
    );
    await waitUntilObjectNotExists(
      { client: this.client, maxWaitTime: 3 },
      { Bucket: this.bucketName, Key: key },
    );
  }

  async logErrorIfImageNotUploaded(key: string) {
    try {
      this.logger.error('waiting...');
      await waitUntilObjectNotExists(
        { client: this.client, maxWaitTime: 4000 },
        { Bucket: this.bucketName, Key: key },
      );
      this.logger.error(`Image with key ${key} was not uploaded to S3.`);
    } catch (error) {
      // Image was uploaded successfully
      this.logger.log(`Image with key ${key} was uploaded to S3.`);
    }
  }
}
