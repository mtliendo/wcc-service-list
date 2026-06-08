import { getImageProps } from "next/image";

const THUMBNAIL_SIZE = 128;

/** Returns a Next.js Image-optimized, resized URL for member card/table avatars. */
export function getThumbnailUrl(imageUrl: string): string {
  const {
    props: { src },
  } = getImageProps({
    src: imageUrl,
    alt: "",
    width: THUMBNAIL_SIZE,
    height: THUMBNAIL_SIZE,
  });
  return src;
}
