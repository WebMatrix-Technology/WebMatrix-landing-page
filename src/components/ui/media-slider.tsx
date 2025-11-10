import React, { useEffect, useRef, useState } from 'react';

type MediaItem = { type: 'image' | 'video'; src: string };

interface MediaSliderProps {
  media: MediaItem[];
  className?: string;
  interval?: number;
}

export const MediaSlider: React.FC<MediaSliderProps> = ({ media, className = '', interval = 4000 }) => {
  const [index, setIndex] = useState(0);
  const timerRef = useRef<number | null>(null);
  const [aspect, setAspect] = useState<string | undefined>(undefined);

  const next = () => setIndex((i) => (i + 1) % media.length);
  const prev = () => setIndex((i) => (i - 1 + media.length) % media.length);

  useEffect(() => {
    if (media.length <= 1) return;
    timerRef.current = window.setInterval(() => {
      setIndex((i) => (i + 1) % media.length);
    }, interval);
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, [media.length, interval]);

  if (!media || media.length === 0) {
    return <div className={`aspect-video bg-muted-foreground/5 rounded-2xl ${className}`} />;
  }

  const wrapperStyle: React.CSSProperties = aspect ? { aspectRatio: aspect } : {};

  return (
    <div className={`relative rounded-2xl overflow-hidden ${className}`} style={wrapperStyle}>
      <div className="w-full h-full bg-black flex items-center justify-center">
        {media[index].type === 'image' ? (
          <img
            src={media[index].src}
            alt={`media-${index}`}
            className="w-full h-full object-contain object-center bg-black"
            onLoad={(e) => {
              const img = e.currentTarget as HTMLImageElement;
              if (img.naturalWidth && img.naturalHeight) setAspect(`${img.naturalWidth} / ${img.naturalHeight}`);
            }}
          />
        ) : (
          <video
            src={media[index].src}
            className="w-full h-full object-contain object-center bg-black"
            autoPlay
            loop
            muted
            playsInline
            onLoadedMetadata={(e) => {
              const v = e.currentTarget as HTMLVideoElement;
              if (v.videoWidth && v.videoHeight) setAspect(`${v.videoWidth} / ${v.videoHeight}`);
            }}
          />
        )}
      </div>

      {/* Controls */}
      {media.length > 1 && (
        <>
          <button
            aria-label="Previous"
            onClick={() => {
              prev();
              if (timerRef.current) window.clearInterval(timerRef.current);
            }}
            className="absolute left-3 top-1/2 -translate-y-1/2 z-20 bg-black/40 hover:bg-black/60 text-white rounded-full p-2"
          >
            ‹
          </button>

          <button
            aria-label="Next"
            onClick={() => {
              next();
              if (timerRef.current) window.clearInterval(timerRef.current);
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-20 bg-black/40 hover:bg-black/60 text-white rounded-full p-2"
          >
            ›
          </button>

          {/* Dots */}
          <div className="absolute left-1/2 -translate-x-1/2 bottom-3 z-20 flex gap-2">
            {media.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  setIndex(i);
                  if (timerRef.current) window.clearInterval(timerRef.current);
                }}
                className={`w-2 h-2 rounded-full ${i === index ? 'bg-white' : 'bg-white/40'}`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default MediaSlider;
