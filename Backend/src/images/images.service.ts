import {
  CreateBucketCommand,
  DeleteObjectCommand,
  GetObjectCommand,
  paginateListBuckets,
  PutObjectCommand,
  S3Client,
  waitUntilBucketExists,
  waitUntilObjectExists,
  waitUntilObjectNotExists,
} from '@aws-sdk/client-s3';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ImagesService implements OnModuleInit {
  private client: S3Client;
  private bucketName: string;
  private awsRegion: string;
  private readonly logger = new Logger(ImagesService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly prismaService: PrismaService,
  ) {
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

  /**
   * Creates a pre-signed url based on a pin/comment ID.
   * Use URL to upload an image to S3 through a PUT request (usually completed by the client).
   * Please note if the id and type are not unique, this will overwrite the existing image.
   *
   * @param id
   * @param type
   * @returns
   */
  async createImagePresignUrlS3(id: number, type: 'comment' | 'post') {
    const uuid = crypto.randomUUID();
    const key = `${type}/${id}-${uuid}`;
    const command = new PutObjectCommand({ Bucket: this.bucketName, Key: key });
    this.logErrorIfImageNotUploaded(key);

    return {
      url: await getSignedUrl(this.client, command, { expiresIn: 60 }),
      key,
    };
  }

  /**
   * Removes an image from the S3 bucket.
   * This will also remove the reference from any pin/comment that has this image.
   *
   * @param key
   */
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

  private async logErrorIfImageNotUploaded(key: string) {
    try {
      // Will throw an error if the object does not exist
      await waitUntilObjectExists(
        {
          client: this.client,
          maxWaitTime: 60,
        },
        {
          Bucket: this.bucketName,
          Key: key,
        },
      );

      this.logger.log(`Image with key ${key} was uploaded to S3.`);
    } catch (error) {
      // Image hasn't been uploaded yet
      this.logger.warn(
        `Image with key ${key} was uploaded to S3 - removing ref from pin(s)`,
      );

      await this.prismaService.pin.updateMany({
        where: { imageURL: key },
        data: { imageURL: null },
      });
    }
  }

  /**
   * Retrieves the raw image from S3 as a byte stream. Only use if
   * processing the image is necessary (network is expensive)
   *
   * @param key
   * @returns
   */
  async getImageRawS3(key: string) {
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });

    const response = await this.client.send(command);
    return response.Body;
  }
}
