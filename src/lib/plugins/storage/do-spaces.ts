import { createS3StoragePlugin } from "./s3-factory";

/**
 * DigitalOcean Spaces Storage Plugin
 *
 * DigitalOcean Spaces is S3-compatible but uses a different endpoint format.
 *
 * Required env vars:
 * - DO_SPACES_BUCKET
 * - DO_SPACES_REGION (e.g., nyc3, sfo3, ams3, sgp1, fra1)
 * - DO_SPACES_ACCESS_KEY_ID
 * - DO_SPACES_SECRET_ACCESS_KEY
 *
 * Optional env vars:
 * - DO_SPACES_CDN_ENDPOINT (for CDN-enabled Spaces, e.g., https://bucket.region.cdn.digitaloceanspaces.com)
 *
 * Note: Requires @aws-sdk/client-s3 to be installed:
 * npm install @aws-sdk/client-s3
 */
export const doSpacesStoragePlugin = createS3StoragePlugin({
  id: "do-spaces",
  name: "DigitalOcean Spaces",
  getBucket: () => process.env.DO_SPACES_BUCKET,
  getRegion: () => process.env.DO_SPACES_REGION,
  getAccessKeyId: () => process.env.DO_SPACES_ACCESS_KEY_ID,
  getSecretAccessKey: () => process.env.DO_SPACES_SECRET_ACCESS_KEY,
  getEndpoint: () => `https://${process.env.DO_SPACES_REGION}.digitaloceanspaces.com`,
  getFileUrl: (key: string) => {
    const bucket = process.env.DO_SPACES_BUCKET!;
    const region = process.env.DO_SPACES_REGION!;
    if (process.env.DO_SPACES_CDN_ENDPOINT) {
      return `${process.env.DO_SPACES_CDN_ENDPOINT}/${key}`;
    }
    return `https://${bucket}.${region}.digitaloceanspaces.com/${key}`;
  },
  forcePathStyle: false, // DO Spaces uses virtual-hosted style URLs
  publicAcl: true, // Make files publicly accessible
});
