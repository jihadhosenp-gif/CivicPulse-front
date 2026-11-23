'use client';

import * as React from 'react';
import { ImagePlus, X, Loader2, ImageOff, RefreshCw, UploadCloud } from 'lucide-react';
import { cn } from '@/utils/cn';
import { Button } from '@/components/ui/button';
import {
  ACCEPTED_IMAGE_TYPES,
  MAX_IMAGE_BYTES,
  MAX_IMAGES,
} from '@/services/reports';
import type { SelectedImage } from '@/types/report';

interface ImageUploadProps {
  images: SelectedImage[];
  onChange: (images: SelectedImage[]) => void;
  /** Called with a human-readable error string when a file is rejected. */
  onError?: (message: string) => void;
  /** Disable all interaction (e.g. while submitting). */
  disabled?: boolean;
  /** Maximum number of images (defaults to the backend limit). */
  maxImages?: number;
  className?: string;
}

let imageIdCounter = 0;
function nextImageId() {
  imageIdCounter += 1;
  return `img-${Date.now()}-${imageIdCounter}`;
}

function isAcceptedFile(file: File): boolean {
  // Accept by MIME type; fall back to extension for pickers that omit type.
  if (file.type) return ACCEPTED_IMAGE_TYPES.includes(file.type);
  return /\.(jpe?g|png|webp)$/i.test(file.name);
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  const mb = bytes / (1024 * 1024);
  return `${mb.toFixed(1)}MB`;
}

/**
 * Premium multi-image uploader:
 *  - drag & drop + click to browse
 *  - image preview thumbnails
 *  - per-file type/size validation
 *  - remove and replace individual images
 *  - per-image upload progress bar (when `progress` is set on the image)
 */
export function ImageUpload({
  images,
  onChange,
  onError,
  disabled = false,
  maxImages = MAX_IMAGES,
  className,
}: ImageUploadProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  // Per-image replace picker; `replaceTarget` holds the id being replaced.
  const replaceInputRef = React.useRef<HTMLInputElement>(null);
  const replaceTargetRef = React.useRef<string | null>(null);
  const [isDragging, setIsDragging] = React.useState(false);
  const [brokenPreviews, setBrokenPreviews] = React.useState<Set<string>>(new Set());

  const atLimit = images.length >= maxImages;

  // Revoke object URLs when they are removed or the component unmounts.
  React.useEffect(() => {
    return () => {
      images.forEach((img) => URL.revokeObjectURL(img.previewUrl));
    };
    // Only revoke on unmount; per-image revocation happens in removeImage/replace.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const buildAccepted = React.useCallback(
    (fileList: FileList | null, limit: number): { accepted: SelectedImage[]; errors: string[] } => {
      const accepted: SelectedImage[] = [];
      const errors: string[] = [];
      if (!fileList) return { accepted, errors };

      for (const file of Array.from(fileList)) {
        if (limit <= 0) {
          errors.push(`You can upload at most ${maxImages} images.`);
          break;
        }
        if (!isAcceptedFile(file)) {
          errors.push(`"${file.name}" is not a supported image (JPG, PNG, WEBP).`);
          continue;
        }
        if (file.size > MAX_IMAGE_BYTES) {
          errors.push(`"${file.name}" is ${formatBytes(file.size)}. Max size is 5MB.`);
          continue;
        }
        accepted.push({
          id: nextImageId(),
          file,
          previewUrl: URL.createObjectURL(file),
        });
        limit -= 1;
      }

      return { accepted, errors };
    },
    [maxImages]
  );

  const addFiles = React.useCallback(
    (fileList: FileList | null) => {
      if (!fileList || disabled) return;
      const { accepted, errors } = buildAccepted(fileList, maxImages - images.length);

      if (errors.length && onError) {
        // Report the first error; the uploader surfaces one message at a time.
        onError(errors[0]);
      }

      if (accepted.length) {
        onChange([...images, ...accepted]);
      }
    },
    [images, onChange, disabled, maxImages, onError, buildAccepted]
  );

  const removeImage = React.useCallback(
    (id: string) => {
      const target = images.find((img) => img.id === id);
      if (target) URL.revokeObjectURL(target.previewUrl);
      onChange(images.filter((img) => img.id !== id));
      setBrokenPreviews((prev) => {
        if (!prev.has(id)) return prev;
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    },
    [images, onChange]
  );

  const openReplacePicker = (id: string) => {
    if (disabled) return;
    replaceTargetRef.current = id;
    replaceInputRef.current?.click();
  };

  const handleReplaceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const targetId = replaceTargetRef.current;
    const file = e.target.files?.[0];
    // Reset so re-selecting the same file fires change again.
    e.target.value = '';
    replaceTargetRef.current = null;
    if (!targetId || !file || disabled) return;

    if (!isAcceptedFile(file)) {
      onError?.(`"${file.name}" is not a supported image (JPG, PNG, WEBP).`);
      return;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      onError?.(`"${file.name}" is ${formatBytes(file.size)}. Max size is 5MB.`);
      return;
    }

    const previous = images.find((img) => img.id === targetId);
    const replacement: SelectedImage = {
      id: nextImageId(),
      file,
      previewUrl: URL.createObjectURL(file),
    };
    if (previous) URL.revokeObjectURL(previous.previewUrl);

    onChange(images.map((img) => (img.id === targetId ? replacement : img)));
    setBrokenPreviews((prev) => {
      if (!prev.has(targetId)) return prev;
      const next = new Set(prev);
      next.delete(targetId);
      return next;
    });
  };

  const openPicker = () => {
    if (disabled || atLimit) return;
    inputRef.current?.click();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;
    addFiles(e.dataTransfer.files);
  };

  return (
    <div className={cn('space-y-3', className)}>
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_IMAGE_TYPES.join(',')}
        multiple
        className="hidden"
        onChange={(e) => {
          addFiles(e.target.files);
          // Reset so re-selecting the same file fires change again.
          e.target.value = '';
        }}
      />
      {/* Hidden single-file picker used for per-image replace. */}
      <input
        ref={replaceInputRef}
        type="file"
        accept={ACCEPTED_IMAGE_TYPES.join(',')}
        className="hidden"
        onChange={handleReplaceChange}
      />

      {images.length > 0 && (
        <div className="grid grid-cols-2 gap-3 min-[420px]:grid-cols-3 sm:grid-cols-4 md:grid-cols-5">
          {images.map((image) => {
            const isUploading =
              typeof image.progress === 'number' && image.progress < 100;
            return (
              <div
                key={image.id}
                className="group relative aspect-square overflow-hidden rounded-xl border border-input bg-muted shadow-soft"
              >
                {brokenPreviews.has(image.id) ? (
                  <div className="flex h-full w-full flex-col items-center justify-center gap-1 px-1 text-muted-foreground">
                    <ImageOff className="h-5 w-5" />
                    <span className="w-full break-all text-center text-[10px] leading-tight">
                      {image.file.name}
                    </span>
                  </div>
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={image.previewUrl}
                    alt={image.file.name}
                    className="h-full w-full object-cover"
                    onError={() =>
                      setBrokenPreviews((prev) => new Set(prev).add(image.id))
                    }
                  />
                )}

                {/* Subtle bottom gradient so hover actions stay legible on photos. */}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-black/40 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

                {isUploading && (
                  <div className="absolute inset-x-0 bottom-0 bg-background/85 px-1.5 py-1">
                    <div className="h-1 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-primary transition-all"
                        style={{ width: `${image.progress ?? 0}%` }}
                      />
                    </div>
                  </div>
                )}

                {!disabled && (
                  <div className="absolute right-1.5 top-1.5 flex gap-1 opacity-0 transition-opacity focus-within:opacity-100 group-hover:opacity-100 max-sm:opacity-100">
                    <button
                      type="button"
                      onClick={() => openReplacePicker(image.id)}
                      className="flex h-7 w-7 items-center justify-center rounded-full bg-foreground/80 text-background shadow-sm transition-colors hover:bg-primary hover:text-primary-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      aria-label={`Replace ${image.file.name}`}
                    >
                      <RefreshCw className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeImage(image.id)}
                      className="flex h-7 w-7 items-center justify-center rounded-full bg-foreground/80 text-background shadow-sm transition-colors hover:bg-danger hover:text-danger-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      aria-label={`Remove ${image.file.name}`}
                    >
                      {isUploading ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <X className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <div
        onDragOver={(e) => {
          e.preventDefault();
          if (!disabled && !atLimit) setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={openPicker}
        role="button"
        tabIndex={disabled || atLimit ? -1 : 0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            openPicker();
          }
        }}
        aria-disabled={disabled || atLimit}
        className={cn(
          'flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed px-4 py-8 text-center transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1',
          isDragging
            ? 'border-primary bg-primary/5'
            : 'border-input bg-muted/30 hover:border-primary/60 hover:bg-primary/5',
          (disabled || atLimit) &&
            'cursor-not-allowed opacity-60 hover:border-input hover:bg-muted/30'
        )}
      >
        <div
          className={cn(
            'flex h-12 w-12 items-center justify-center rounded-full transition-transform',
            isDragging
              ? 'scale-110 bg-primary text-primary-foreground'
              : 'bg-primary/10 text-primary'
          )}
        >
          {isDragging ? (
            <UploadCloud className="h-6 w-6" />
          ) : (
            <ImagePlus className="h-6 w-6" />
          )}
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium text-foreground">
            {atLimit ? (
              'Image limit reached'
            ) : isDragging ? (
              'Drop images to upload'
            ) : (
              <>
                <span className="text-primary">Click to upload</span> or drag and drop
              </>
            )}
          </p>
          <p className="text-xs text-muted-foreground">
            JPG, PNG or WEBP · up to {maxImages} images · 5MB each
          </p>
        </div>
      </div>

      {images.length > 0 && !atLimit && !disabled && (
        <Button
          type="button"
          variant="soft"
          size="sm"
          onClick={openPicker}
          className="w-full"
        >
          <ImagePlus className="mr-2 h-4 w-4" />
          Add more images ({images.length}/{maxImages})
        </Button>
      )}
    </div>
  );
}