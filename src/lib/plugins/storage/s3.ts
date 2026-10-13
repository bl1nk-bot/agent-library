import type { StoragePlugin, UploadResult, UploadOptions } from "../types";

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

// Helper to dynamically load AWS SDK
async function getS3Client() {
  try {
    // Use webpackIgnore to prevent bundling this optional dependency
    const s3Module = await import(/* webpackIgnore: true */ "@aws-sdk/client-s3");
    return s3Module;
  } catch {
    throw new Error(
      "S3 storage requires @aws-sdk/client-s3. Install it with: npm install @aws-sdk/client-s3"
    );
  }
}

export const s3StoragePlugin: StoragePlugin = {
  id: "s3",
  name: "Amazon S3 Compatible",

  isConfigured: () => {
    // Standard S3 configuration
    if (
      process.env.S3_BUCKET &&
      process.env.S3_REGION &&
      process.env.S3_ACCESS_KEY_ID &&
      process.env.S3_SECRET_ACCESS_KEY
    ) {
      return true;
    }

    // DO Spaces configuration (backward compatibility)
    if (
      process.env.DO_SPACES_BUCKET &&
      process.env.DO_SPACES_REGION &&
      process.env.DO_SPACES_ACCESS_KEY_ID &&
      process.env.DO_SPACES_SECRET_ACCESS_KEY
    ) {
      return true;
    }

    return false;
  },

  async upload(file: File | Buffer, options?: UploadOptions): Promise<UploadResult> {
    if (!this.isConfigured()) {
      throw new Error(
        "S3/Spaces storage is not configured. Please set required environment variables."
      );
    }

    // Determine credentials and config based on which set of env vars is present
    const isDoSpaces = !!process.env.DO_SPACES_BUCKET;

    const region = isDoSpaces ? process.env.DO_SPACES_REGION! : process.env.S3_REGION!;
    const bucket = isDoSpaces ? process.env.DO_SPACES_BUCKET! : process.env.S3_BUCKET!;
    const accessKeyId = isDoSpaces
      ? process.env.DO_SPACES_ACCESS_KEY_ID!
      : process.env.S3_ACCESS_KEY_ID!;
    const secretAccessKey = isDoSpaces
      ? process.env.DO_SPACES_SECRET_ACCESS_KEY!
      : process.env.S3_SECRET_ACCESS_KEY!;

    // Determine endpoint
    let endpoint = process.env.S3_ENDPOINT;
    if (isDoSpaces) {
      endpoint = `https://${region}.digitaloceanspaces.com`;
    }

    const { S3Client, PutObjectCommand } = await getS3Client();

    const client = new S3Client({
      region,
      endpoint,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
      // DO Spaces uses virtual-hosted style URLs (forcePathStyle=false)
      // Standard S3-compatible might need forcePathStyle=true depending on setup
      forcePathStyle: isDoSpaces ? false : !!process.env.S3_ENDPOINT,
    });

    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(2, 8);
    const filename = options?.filename || `file-${timestamp}-${randomId}`;
    const folder = options?.folder || "uploads";
    const key = `${folder}/${filename}`;

    let buffer: Buffer;
    let contentType: string | undefined;

    if (file instanceof File) {
      const arrayBuffer = await file.arrayBuffer();
      buffer = Buffer.from(arrayBuffer);
      contentType = file.type;
    } else {
      buffer = file;
      contentType = options?.mimeType;
    }

    // DO Spaces requires ACL to be set for public access, S3 may restrict this depending on bucket policies
    const uploadParams: any = {
      Bucket: bucket,
      Key: key,
      Body: buffer,
      ContentType: contentType,
    };

    if (isDoSpaces) {
      uploadParams.ACL = "public-read";
    }

    await client.send(new PutObjectCommand(uploadParams));

    // Construct URL
    let url = "";
    if (isDoSpaces) {
      if (process.env.DO_SPACES_CDN_ENDPOINT) {
        url = `${process.env.DO_SPACES_CDN_ENDPOINT}/${key}`;
      } else {
        url = `https://${bucket}.${region}.digitaloceanspaces.com/${key}`;
      }
    } else {
      const s3Endpoint = process.env.S3_ENDPOINT || `https://s3.${region}.amazonaws.com`;
      url = `${s3Endpoint}/${bucket}/${key}`;
    }

    return {
      url,
      key,
      size: buffer.length,
      mimeType: contentType,
    };
  },

  async delete(keyOrUrl: string): Promise<void> {
    if (!this.isConfigured()) {
      throw new Error("S3/Spaces storage is not configured.");
    }

    const isDoSpaces = !!process.env.DO_SPACES_BUCKET;
    const region = isDoSpaces ? process.env.DO_SPACES_REGION! : process.env.S3_REGION!;
    const bucket = isDoSpaces ? process.env.DO_SPACES_BUCKET! : process.env.S3_BUCKET!;
    const accessKeyId = isDoSpaces
      ? process.env.DO_SPACES_ACCESS_KEY_ID!
      : process.env.S3_ACCESS_KEY_ID!;
    const secretAccessKey = isDoSpaces
      ? process.env.DO_SPACES_SECRET_ACCESS_KEY!
      : process.env.S3_SECRET_ACCESS_KEY!;

    let endpoint = process.env.S3_ENDPOINT;
    if (isDoSpaces) {
      endpoint = `https://${region}.digitaloceanspaces.com`;
    }

    const { S3Client, DeleteObjectCommand } = await getS3Client();

    const client = new S3Client({
      region,
      endpoint,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
      forcePathStyle: isDoSpaces ? false : !!process.env.S3_ENDPOINT,
    });

    let key = keyOrUrl;
    if (keyOrUrl.startsWith("http")) {
      const url = new URL(keyOrUrl);
      key = url.pathname.substring(1);

      // Remove bucket name from path if present (usually for S3 path style)
      if (!isDoSpaces && key.startsWith(bucket)) {
        key = key.substring(bucket.length + 1);
      }
    }

    await client.send(
      new DeleteObjectCommand({
        Bucket: bucket,
        Key: key,
      })
    );
  },
};
