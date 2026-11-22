'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ImageOff, Maximize2, X, ChevronLeft, ChevronRight, Images } from 'lucide-react';
import { cn } from '@/utils/cn';

interface ImageGalleryProps {
  images: string[];
  alt?: string;
  className?: string;
}

/**
 * Premium image gallery for a report.
 *  - responsive grid for thumbnails
 *  - full-screen lightbox with prev/next navigation
 *  - graceful fallback when an image fails to load
 */
export function ImageGallery({ images, alt = 'Report image', className }: ImageGalleryProps) {
  const [activeIndex, setActiveIndex] = React.useState<number | null>(null);
  const [broken, setBroken] = React.useState<Set<number>>(new Set());

  const total = images.length;
  const isOpen = activeIndex !== null;

  const openAt = (index: number) => setActiveIndex(index);
  const close = () => setActiveIndex(null);
  const goPrev = React.useCallback(() => {
    setActiveIndex((i) => (i === null ? null : (i - 1 + total) % total));
  }, [total]);
  const goNext = React.useCallback(() => {
    setActiveIndex((i) => (i === null ? null : (i + 1) % total));
  }, [total]);

  React.useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') goPrev();
      if (e.key === 'ArrowRight') goNext();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, goPrev, goNext]);

  if (total === 0) {
    return (
      <div
        className={cn(
          'flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-input bg-muted/30 py-12 text-center',
          className
        )}
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
          <Images className="h-6 w-6 text-muted-foreground/60" />
        </div>
        <p className="text-sm font-medium text-muted-foreground">No images attached</p>
        <p className="text-xs text-muted-foreground/70">This report has no photo evidence.</p>
      </div>
    );
  }

  return (
    <>
      <div className={cn('grid grid-cols-2 gap-3 sm:grid-cols-3', className)}>
        {images.map((src, index) => (
          <button
            key={`${src}-${index}`}
            type="button"
            onClick={() => openAt(index)}
            className="group relative aspect-video overflow-hidden rounded-lg border border-input bg-muted focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1"
            aria-label={`Open image ${index + 1} of ${total}`}
          >
            {broken.has(index) ? (
              <div className="flex h-full w-full flex-col items-center justify-center gap-1 text-muted-foreground">
                <ImageOff className="h-5 w-5" />
                <span className="px-2 text-center text-[10px] leading-tight break-all">{src}</span>
              </div>
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={src}
                alt={`${alt} ${index + 1}`}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                onError={() => setBroken((prev) => new Set(prev).add(index))}
                loading="lazy"
              />
            )}
            <span className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-foreground/70 text-background opacity-0 shadow-sm transition-opacity group-hover:opacity-100">
              <Maximize2 className="h-3.5 w-3.5" />
            </span>
          </button>
        ))}
      </div>

      <AnimatePresence>
        {isOpen && activeIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm"
            onClick={close}
            role="dialog"
            aria-modal="true"
            aria-label="Image viewer"
          >
            <button
              type="button"
              onClick={close}
              className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
              aria-label="Close viewer"
            >
              <X className="h-5 w-5" />
            </button>

            {total > 1 && (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    goPrev();
                  }}
                  className="absolute left-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    goNext();
                  }}
                  className="absolute right-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
                  aria-label="Next image"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </>
            )}

            <motion.div
              key={activeIndex}
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.2 }}
              className="relative max-h-[85vh] max-w-[90vw]"
              onClick={(e) => e.stopPropagation()}
            >
              {broken.has(activeIndex) ? (
                <div className="flex h-64 w-80 flex-col items-center justify-center gap-2 rounded-lg bg-card text-muted-foreground">
                  <ImageOff className="h-8 w-8" />
                  <span className="text-sm">Image could not be loaded</span>
                </div>
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={images[activeIndex]}
                  alt={`${alt} ${activeIndex + 1}`}
                  className="max-h-[85vh] max-w-[90vw] rounded-lg object-contain"
                />
              )}
            </motion.div>

            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white">
              {activeIndex + 1} / {total}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}