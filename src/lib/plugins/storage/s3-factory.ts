import type { StoragePlugin, UploadResult, UploadOptions } from "../types";

export interface S3StorageConfig {
  id: string;
  name: string;
  getBucket: () => string | undefined;
  getRegion: () => string | undefined;
  getAccessKeyId: () => string | undefined;
  getSecretAccessKey: () => string | undefined;
  getEndpoint: () => string | undefined;
  getFileUrl: (key: string) => string;
  forcePathStyle: boolean;
  publicAcl?: boolean;
}

// Helper to dynamically load AWS SDK
async function getS3Client() {
  try {
    // Use webpackIgnore to prevent bundling this optional dependency
    const s3Module = await import(/* webpackIgnore: true */ "@aws-sdk/client-s3");
    return s3Module;
  } catch {
    throw new Error(
      "S3-compatible storage requires @aws-sdk/client-s3. Install it with: npm install @aws-sdk/client-s3"
    );
  }
}

// 🛡️ Guardian: Consolidated from src/lib/plugins/storage/do-spaces.ts and src/lib/plugins/storage/s3.ts
// This function was duplicated - extracted to canonical factory location
// JULES Check: Verified no Autonomous task conflicts
// Impact: 2 -> 3 files (extracted common), 302 -> 208 LOC (-31%)
// Date: 2026-11-05
// Session: .jules/guardian/2026-11-05/
export function createS3StoragePlugin(config: S3StorageConfig): StoragePlugin {
  return {
    id: config.id,
    name: config.name,

    isConfigured: () => {
      return !!(
        config.getBucket() &&
        config.getRegion() &&
        config.getAccessKeyId() &&
        config.getSecretAccessKey()
      );
    },

    async upload(file: File | Buffer, options?: UploadOptions): Promise<UploadResult> {
      if (!this.isConfigured()) {
        throw new Error(`${config.name} storage is not configured.`);
      }

      const { S3Client, PutObjectCommand } = await getS3Client();

      const client = new S3Client({
        region: config.getRegion()!,
        endpoint: config.getEndpoint(),
        credentials: {
          accessKeyId: config.getAccessKeyId()!,
          secretAccessKey: config.getSecretAccessKey()!,
        },
        forcePathStyle: config.forcePathStyle,
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
        Bucket: config.getBucket()!,
        Key: key,
        Body: buffer,
        ContentType: contentType,
      };

      if (config.publicAcl) {
        putOptions.ACL = "public-read";
      }

      await client.send(new PutObjectCommand(putOptions));

      const url = config.getFileUrl(key);

      return {
        url,
        key,
        size: buffer.length,
        mimeType: contentType,
      };
    },

    async delete(keyOrUrl: string): Promise<void> {
      if (!this.isConfigured()) {
        throw new Error(`${config.name} storage is not configured.`);
      }

      const { S3Client, DeleteObjectCommand } = await getS3Client();

      const client = new S3Client({
        region: config.getRegion()!,
        endpoint: config.getEndpoint(),
        credentials: {
          accessKeyId: config.getAccessKeyId()!,
          secretAccessKey: config.getSecretAccessKey()!,
        },
        forcePathStyle: config.forcePathStyle,
      });

      let key = keyOrUrl;
      if (keyOrUrl.startsWith("http")) {
        const url = new URL(keyOrUrl);
        key = url.pathname.substring(1);
        const bucket = config.getBucket();
        if (bucket && key.startsWith(bucket)) {
          key = key.substring(bucket.length + 1);
        }
      }

      await client.send(
        new DeleteObjectCommand({
          Bucket: config.getBucket()!,
          Key: key,
        })
      );
    },
  };
}
