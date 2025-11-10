import React, { useState } from 'react';
import { cn } from '@/lib/utils';

interface DevicePreviewProps {
  desktopImage: string;
  mobileImage?: string;
  title: string;
  className?: string;
  priority?: boolean;
  // display controls whether to show both frames, or only one
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

  // inline style to apply when we know the natural aspect ratio
  const containerStyle: React.CSSProperties = desktopAspect ? { aspectRatio: desktopAspect } : {};

  return (
    <div className={cn("relative w-full transition-all duration-300", className)} style={containerStyle}>
      {/* Desktop Monitor Frame */}
      {display !== 'mobile' && (
        <div className="absolute inset-0 rounded-2xl overflow-hidden bg-background shadow-2xl">
        {/* Monitor Stand */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/4 h-[8%] bg-zinc-800"></div>
        <div className="absolute bottom-[8%] left-1/2 -translate-x-1/2 w-[30%] h-[2%] bg-zinc-700"></div>
        {/* Monitor Frame */}
        <div className="absolute inset-[2%] rounded-lg overflow-hidden border border-zinc-800 bg-zinc-900">
          {/* Desktop Screenshot */}
          <img
            src={desktopImage}
            alt={`${title} - Desktop View`}
            className="w-full h-full object-contain object-center bg-black"
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
            loading={priority ? "eager" : "lazy"}
          />
        </div>
        </div>
      )}

      {/* Mobile Device Frame */}
      {mobileImage && display !== 'desktop' && (
        <div className="absolute -right-[5%] bottom-[5%] w-[25%] transition-transform duration-500 group-hover:translate-x-12 group-hover:translate-y-12">
          <div className="relative" style={mobileAspect ? { aspectRatio: mobileAspect } : { aspectRatio: '9 / 19.5' }}>
            {/* Phone Frame */}
            <div className="absolute inset-0 rounded-[2.5rem] bg-zinc-800 shadow-2xl">
              {/* Phone Notch */}
              <div className="absolute top-3 left-1/2 -translate-x-1/2 w-1/4 h-[0.5rem] bg-zinc-900 rounded-full"></div>
              {/* Phone Screen */}
              <div className="absolute inset-[3%] rounded-[2rem] overflow-hidden border border-zinc-700">
                <img
                  src={mobileImage}
                  alt={`${title} - Mobile View`}
                  className="w-full h-full object-contain object-center bg-black"
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