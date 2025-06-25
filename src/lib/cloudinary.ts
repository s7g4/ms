import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export { cloudinary };

export interface UploadResult {
  url: string;
  secureUrl: string;
  publicId: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
}

export interface UploadOptions {
  folder?: string;
  transformation?: Record<string, unknown>[];
  allowedFormats?: string[];
  maxFileSize?: number; // bytes
}

/**
 * Upload a file buffer or base64 string to Cloudinary.
 * Returns a structured result with URLs and metadata.
 */
export async function uploadImage(
  file: string | Buffer,
  folder = "mysteryscoop",
  options: UploadOptions = {}
): Promise<UploadResult> {
  const {
    transformation,
    allowedFormats = ["jpg", "jpeg", "png", "webp", "gif", "avif"],
    maxFileSize = 10 * 1024 * 1024, // 10MB
  } = options;

  // Convert Buffer to base64 data URI if needed
  const uploadSource =
    Buffer.isBuffer(file) ? `data:image/png;base64,${file.toString("base64")}` : file;

  const result = await cloudinary.uploader.upload(uploadSource, {
    folder,
    allowed_formats: allowedFormats,
    max_bytes: maxFileSize,
    ...(transformation ? { transformation } : {}),
    resource_type: "image",
    overwrite: false,
    unique_filename: true,
  });

  return {
    url: result.url,
    secureUrl: result.secure_url,
    publicId: result.public_id,
    width: result.width,
    height: result.height,
    format: result.format,
    bytes: result.bytes,
  };
}

/**
 * Delete an image from Cloudinary by its public ID.
 */
export async function deleteImage(publicId: string): Promise<void> {
  await cloudinary.uploader.destroy(publicId);
}

/**
 * Generate a signed upload URL for direct client-side uploads.
 */
export function generateSignedUploadParams(folder = "mysteryscoop"): {
  signature: string;
  timestamp: number;
  apiKey: string;
  cloudName: string;
  folder: string;
} {
  const timestamp = Math.round(Date.now() / 1000);
  const params = { timestamp, folder };
  const signature = cloudinary.utils.api_sign_request(
    params,
    process.env.CLOUDINARY_API_SECRET!
  );

  return {
    signature,
    timestamp,
    apiKey: process.env.CLOUDINARY_API_KEY!,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME!,
    folder,
  };
}
