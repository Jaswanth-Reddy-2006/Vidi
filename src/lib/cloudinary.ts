export const cloudinaryConfig = {
  cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "",
  apiKey: process.env.CLOUDINARY_API_KEY || "",
  apiSecret: process.env.CLOUDINARY_API_SECRET || "",
};

export const CLOUDINARY_UPLOAD_PRESET = "vidi_products";

export function getCloudinaryUrl(publicId: string, options?: {
  width?: number;
  height?: number;
  crop?: string;
  quality?: string;
  format?: string;
}): string {
  const { width, height, crop = "fill", quality = "auto", format = "auto" } = options || {};
  
  const transforms: string[] = [];
  if (width) transforms.push(`w_${width}`);
  if (height) transforms.push(`h_${height}`);
  transforms.push(`c_${crop}`, `q_${quality}`, `f_${format}`);
  
  const transformString = transforms.join(",");
  
  return `https://res.cloudinary.com/${cloudinaryConfig.cloudName}/image/upload/${transformString}/${publicId}`;
}
