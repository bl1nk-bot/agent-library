import type { StoragePlugin, UploadResult, UploadOptions } from "../types";

/**
 * S3 Storage Plugin
 *
 * Supports AWS S3 and S3-compatible services (MinIO, DigitalOcean Spaces, etc.)
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

interface S3Config {
  bucket: string;
  region: string;
  accessKeyId: string;
  secretAccessKey: string;
  endpoint?: string;
  forcePathStyle?: boolean;
  publicAcl?: boolean;
}

// 🛡️ Guardian: Extracted shared S3 implementation
// This function consolidates the duplicate upload/delete logic for both Amazon S3 and DO Spaces.
// JULES Check: Verified no Autonomous task conflicts
// Impact: 2 -> 1 file, deduplicates the S3 API integration logic
// Date: 2026-09-17
// Session: .Jules/guardian/2026-09-17/
function createS3CompatiblePlugin(
  id: string,
  name: string,
  envVars: string[],
  configFactory: () => S3Config | null,
  urlFactory: (config: S3Config, key: string) => string
): StoragePlugin {
  return {
    id,
    name,
    isConfigured: () => {
      return envVars.every((v) => !!process.env[v]);
    },
    async upload(file: File | Buffer, options?: UploadOptions): Promise<UploadResult> {
      if (!this.isConfigured()) {
        throw new Error(
          `${name} storage is not configured. Please set ${envVars.join(", ")} environment variables.`
        );
      }

      const config = configFactory()!;
      const { S3Client, PutObjectCommand } = await getS3Client();

      const client = new S3Client({
        region: config.region,
        endpoint: config.endpoint,
        credentials: {
          accessKeyId: config.accessKeyId,
          secretAccessKey: config.secretAccessKey,
        },
        forcePathStyle: !!config.forcePathStyle,
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

      const putOptions: any = {
        Bucket: config.bucket,
        Key: key,
        Body: buffer,
        ContentType: contentType,
      };

      if (config.publicAcl) {
        putOptions.ACL = "public-read";
      }

      await client.send(new PutObjectCommand(putOptions));

      const url = urlFactory(config, key);

      return {
        url,
        key,
        size: buffer.length,
        mimeType: contentType,
      };
    },
    async delete(keyOrUrl: string): Promise<void> {
      if (!this.isConfigured()) {
        throw new Error(`${name} storage is not configured.`);
      }

      const config = configFactory()!;
      const { S3Client, DeleteObjectCommand } = await getS3Client();

      const client = new S3Client({
        region: config.region,
        endpoint: config.endpoint,
        credentials: {
          accessKeyId: config.accessKeyId,
          secretAccessKey: config.secretAccessKey,
        },
        forcePathStyle: !!config.forcePathStyle,
      });

      let key = keyOrUrl;
      if (keyOrUrl.startsWith("http")) {
        const urlObj = new URL(keyOrUrl);
        key = urlObj.pathname.substring(1);
        // Special case for standard S3 URLs to strip bucket name from path if forcePathStyle logic applied
        if (id === "s3" && key.startsWith(config.bucket)) {
          key = key.substring(config.bucket.length + 1);
        }
      }

      await client.send(
        new DeleteObjectCommand({
          Bucket: config.bucket,
          Key: key,
        })
      );
    },
  };
}

export const s3StoragePlugin: StoragePlugin = createS3CompatiblePlugin(
  "s3",
  "Amazon S3",
  ["S3_BUCKET", "S3_REGION", "S3_ACCESS_KEY_ID", "S3_SECRET_ACCESS_KEY"],
  () => ({
    bucket: process.env.S3_BUCKET!,
    region: process.env.S3_REGION!,
    accessKeyId: process.env.S3_ACCESS_KEY_ID!,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
    endpoint: process.env.S3_ENDPOINT,
    forcePathStyle: !!process.env.S3_ENDPOINT,
  }),
  (config, key) => {
    const endpoint = config.endpoint || `https://s3.${config.region}.amazonaws.com`;
    return `${endpoint}/${config.bucket}/${key}`;
  }
);

export const doSpacesStoragePlugin: StoragePlugin = createS3CompatiblePlugin(
  "do-spaces",
  "DigitalOcean Spaces",
  [
    "DO_SPACES_BUCKET",
    "DO_SPACES_REGION",
    "DO_SPACES_ACCESS_KEY_ID",
    "DO_SPACES_SECRET_ACCESS_KEY",
  ],
  () => ({
    bucket: process.env.DO_SPACES_BUCKET!,
    region: process.env.DO_SPACES_REGION!,
    accessKeyId: process.env.DO_SPACES_ACCESS_KEY_ID!,
    secretAccessKey: process.env.DO_SPACES_SECRET_ACCESS_KEY!,
    endpoint: `https://${process.env.DO_SPACES_REGION!}.digitaloceanspaces.com`,
    forcePathStyle: false,
    publicAcl: true,
  }),
  (config, key) => {
    if (process.env.DO_SPACES_CDN_ENDPOINT) {
      return `${process.env.DO_SPACES_CDN_ENDPOINT}/${key}`;
    }
    return `https://${config.bucket}.${config.region}.digitaloceanspaces.com/${key}`;
  }
);
