import React, { useMemo, useState } from 'react';
import { cn } from '@/lib/utils';

interface DevicePreviewProps {
  desktopImage: string;
  mobileImage?: string;
  title: string;
  className?: string;
  priority?: boolean;
  display?: 'both' | 'desktop' | 'mobile';
}

export const DevicePreview = ({
  desktopImage,
  mobileImage,
  title,
  className,
  priority = false,
  display = 'both',
}: DevicePreviewProps) => {
  const [desktopAspect, setDesktopAspect] = useState<string | undefined>(undefined);
  const [mobileAspect, setMobileAspect] = useState<string | undefined>(undefined);

  const fallbackDesktopAspect = useMemo(() => '16 / 10', []);
  const fallbackMobileAspect = useMemo(() => '9 / 19.5', []);

  const containerStyle: React.CSSProperties = {
    aspectRatio: desktopAspect ?? fallbackDesktopAspect,
    minHeight: '240px',
  };

  return (
    <div
      className={cn(
        'relative mx-auto w-full max-w-[920px] overflow-visible transition-all duration-500 ease-out',
        'sm:max-w-[960px] md:drop-shadow-[0_20px_60px_rgba(8,12,26,0.35)]',
        className
      )}
      style={containerStyle}
    >
      {display !== 'mobile' && (
        <div className="absolute inset-0 rounded-2xl border border-zinc-800/80 bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 shadow-[0_24px_70px_rgba(5,8,20,0.55)]">
          <div className="absolute bottom-0 left-1/2 h-[8%] w-1/4 -translate-x-1/2 rounded-t-[1.3rem] bg-zinc-800/90 shadow-[0_12px_25px_rgba(12,16,28,0.6)]" />
          <div className="absolute bottom-[8%] left-1/2 h-[2.2%] w-[32%] -translate-x-1/2 rounded-[0.75rem] bg-zinc-700/70 backdrop-blur-sm" />
          <div className="absolute inset-[2%] rounded-xl border border-zinc-800/90 bg-zinc-950/95 p-[0.35rem] shadow-inner">
            <div className="h-full w-full overflow-hidden rounded-[0.9rem] border border-zinc-900/80 bg-black">
              <img
                src={desktopImage}
                alt={`${title} - Desktop View`}
                className="h-full w-full object-contain object-center"
                onLoad={(e) => {
                  try {
                    const img = e.currentTarget as HTMLImageElement;
                    if (img.naturalWidth && img.naturalHeight) {
                      setDesktopAspect(`${img.naturalWidth} / ${img.naturalHeight}`);
                    }
                  } catch (err) {
                    // ignore
                  }
                }}
                loading={priority ? 'eager' : 'lazy'}
              />
            </div>
          </div>
        </div>
      )}

      {mobileImage && display !== 'desktop' && (
        <div
          className={cn(
            'absolute bottom-[8%] right-[8%] w-[34%] max-w-[180px] origin-bottom-right transition-transform duration-500',
            'sm:bottom-[7%] sm:right-[7%] sm:w-[30%] sm:max-w-[200px]',
            'md:bottom-[6%] md:right-[6%] md:w-[26%] md:max-w-[240px]',
            'group-hover:translate-x-2 group-hover:translate-y-2 sm:group-hover:translate-x-6 sm:group-hover:translate-y-6'
          )}
        >
          <div
            className="relative"
            style={mobileAspect ? { aspectRatio: mobileAspect } : { aspectRatio: fallbackMobileAspect }}
          >
            <div className="absolute inset-0 rounded-[1.6rem] border border-zinc-700/85 bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 shadow-[0_18px_45px_rgba(10,10,20,0.55)]">
              <div className="absolute inset-0 rounded-[1.6rem] opacity-60 ring-1 ring-zinc-700/60" />
              <div className="absolute top-3 left-1/2 flex h-[1.2rem] w-16 -translate-x-1/2 items-center justify-between rounded-full bg-zinc-800/90 px-3">
                <span className="h-1 w-6 rounded-full bg-zinc-700/90" />
                <span className="h-1.5 w-1.5 rounded-full bg-zinc-600" />
              </div>
              <div className="absolute inset-[4%] rounded-[1.25rem] overflow-hidden border border-zinc-800/80 bg-black shadow-[inset_0_-6px_12px_rgba(4,6,12,0.55)]">
                <img
                  src={mobileImage}
                  alt={`${title} - Mobile View`}
                  className="h-full w-full object-contain object-center bg-black"
                  onLoad={(e) => {
                    try {
                      const img = e.currentTarget as HTMLImageElement;
                      if (img.naturalWidth && img.naturalHeight) {
                        setMobileAspect(`${img.naturalWidth} / ${img.naturalHeight}`);
                      }
                    } catch (err) {
                      // ignore
                    }
                  }}
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};