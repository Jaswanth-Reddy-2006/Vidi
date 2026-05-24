"use client";

import Image, { ImageProps } from "next/image";
import { useState } from "react";

interface SafeImageProps extends Omit<ImageProps, "onError"> {
  fallbackSrc?: string;
}

export function SafeImage({ src, fallbackSrc, alt, ...props }: SafeImageProps) {
  const [imgSrc, setImgSrc] = useState(src);

  return (
    <Image
      {...props}
      src={imgSrc}
      alt={alt || "Image"}
      unoptimized={true}
      onError={() => {
        setImgSrc(fallbackSrc || `https://placehold.co/800x1200/E5E7EB/A1A1AA/png?text=${encodeURIComponent(alt || "Image")}`);
      }}
    />
  );
}
