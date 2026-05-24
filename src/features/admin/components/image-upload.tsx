"use client";

import { CldUploadWidget } from "next-cloudinary";
import { ImagePlus, X } from "lucide-react";
import Image from "next/image";

interface ImageUploadProps {
  value: string[];
  onChange: (value: string) => void;
  onRemove: (value: string) => void;
}

export function ImageUpload({ value, onChange, onRemove }: ImageUploadProps) {
  const onUpload = (result: any) => {
    onChange(result.info.secure_url);
  };

  return (
    <div>
      <div className="mb-4 flex items-center gap-4 flex-wrap">
        {value.map((url) => (
          <div key={url} className="relative w-32 h-32 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-800">
            <div className="z-10 absolute top-1 right-1">
              <button
                type="button"
                onClick={() => onRemove(url)}
                className="bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors shadow-sm"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <Image fill className="object-cover" alt="Image" src={url} />
          </div>
        ))}
      </div>

      <CldUploadWidget onUpload={onUpload} uploadPreset="vidi_store">
        {({ open }) => {
          const onClick = (e: any) => {
            e.preventDefault();
            open();
          };

          return (
            <button
              type="button"
              onClick={onClick}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium transition-colors border border-gray-200 dark:border-gray-700"
            >
              <ImagePlus className="h-4 w-4" />
              Upload an Image
            </button>
          );
        }}
      </CldUploadWidget>
    </div>
  );
}
