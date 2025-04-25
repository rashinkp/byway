import { StaticImageData } from "next/image";
import { Button } from "../ui/button";
import { Upload } from "lucide-react";

export const ImageSection = ({
  src,
  alt,
  onImageChange,
  isUploading,
}: {
  src: string | StaticImageData;
  alt: string;
  onImageChange: () => void;
  isUploading: boolean;
}) => (
  <div className="relative group mb-6">
    <img
      src={typeof src === "string" ? src : src.src}
      alt={alt}
      className="w-full h-64 object-contain rounded-lg"
    />
    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg flex items-center justify-center">
      <Button
        variant="outline"
        className="text-black border-white hover:bg-white/20"
        onClick={onImageChange}
        disabled={isUploading}
        aria-label="Change course thumbnail"
      >
        <Upload className="mr-2 h-4 w-4" />
        {isUploading ? "Uploading..." : "Change Image"}
      </Button>
    </div>
  </div>
);
