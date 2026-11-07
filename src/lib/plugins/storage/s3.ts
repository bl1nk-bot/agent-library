import { createS3StoragePlugin } from "./s3-factory";

/**
 * S3 Storage Plugin
 *
 * Supports AWS S3 and S3-compatible services (MinIO, DigitalOcean Spaces, etc.)
 *
 * Required env vars:
 * - S3_BUCKET
 * - S3_REGION
 * - S3_ACCESS_KEY_ID
 * - S3_SECRET_ACCESS_KEY
 * - S3_ENDPOINT (optional, for S3-compatible services)
 *
 * Note: Requires @aws-sdk/client-s3 to be installed:
 * npm install @aws-sdk/client-s3
 */
export const s3StoragePlugin = createS3StoragePlugin({
  id: "s3",
  name: "Amazon S3",
  getBucket: () => process.env.S3_BUCKET,
  getRegion: () => process.env.S3_REGION,
  getAccessKeyId: () => process.env.S3_ACCESS_KEY_ID,
  getSecretAccessKey: () => process.env.S3_SECRET_ACCESS_KEY,
  getEndpoint: () => process.env.S3_ENDPOINT,
  getFileUrl: (key: string) => {
    const endpoint = process.env.S3_ENDPOINT || `https://s3.${process.env.S3_REGION}.amazonaws.com`;
    return `${endpoint}/${process.env.S3_BUCKET}/${key}`;
  },
  forcePathStyle: !!process.env.S3_ENDPOINT,
});
