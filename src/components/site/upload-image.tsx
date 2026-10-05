import Image, { type ImageProps } from 'next/image';

/**
 * next/image for the mirrored WordPress uploads. Browsers still pick an optimized
 * variant from `srcset`, but `src` stays the original /wp-content/uploads URL:
 * image search keeps the URL the old site ranked, and crawlers that ignore
 * `srcset` fetch the static file instead of triggering an image transformation.
 */
export function UploadImage({ src, alt, ...props }: Omit<ImageProps, 'src' | 'overrideSrc'> & { src: string }) {
  return <Image src={src} alt={alt} overrideSrc={src} {...props} />;
}
