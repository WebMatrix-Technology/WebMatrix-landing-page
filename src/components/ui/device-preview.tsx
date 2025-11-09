import { cn } from '@/lib/utils';

interface DevicePreviewProps {
  desktopImage: string;
  mobileImage?: string;
  title: string;
  className?: string;
  priority?: boolean;
}

export const DevicePreview = ({
  desktopImage,
  mobileImage,
  title,
  className,
  priority = false,
}: DevicePreviewProps) => {
  return (
    <div className={cn("relative w-full aspect-[4/3] md:aspect-[16/9]", className)}>
      {/* Desktop Monitor Frame */}
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
            className="w-full h-full object-cover object-top"
            loading={priority ? "eager" : "lazy"}
          />
        </div>
      </div>

      {/* Mobile Device Frame */}
      {mobileImage && (
        <div className="absolute -right-[5%] bottom-[5%] w-[25%] transition-transform duration-500 group-hover:translate-x-12 group-hover:translate-y-12">
          <div className="relative aspect-[9/19.5]">
            {/* Phone Frame */}
            <div className="absolute inset-0 rounded-[2.5rem] bg-zinc-800 shadow-2xl">
              {/* Phone Notch */}
              <div className="absolute top-3 left-1/2 -translate-x-1/2 w-1/4 h-[0.5rem] bg-zinc-900 rounded-full"></div>
              {/* Phone Screen */}
              <div className="absolute inset-[3%] rounded-[2rem] overflow-hidden border border-zinc-700">
                <img
                  src={mobileImage}
                  alt={`${title} - Mobile View`}
                  className="w-full h-full object-cover object-top"
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