import { Button } from '@/components/ui/button';
import { DevicePreview } from '@/components/ui/device-preview';
import { cn } from '@/lib/utils';
import { Monitor, Smartphone, Video } from 'lucide-react';

interface PreviewModesProps {
  desktopImage: string;
  mobileImage?: string;
  videoSrc?: string;
  title: string;
  mode: 'both' | 'desktop' | 'mobile' | 'video';
  onModeChange: (mode: 'both' | 'desktop' | 'mobile' | 'video') => void;
  className?: string;
  showDevicePreview?: boolean; // optionally hide device preview area (keep controls)
}

export const PreviewModes = ({
  desktopImage,
  mobileImage,
  videoSrc,
  title,
  mode,
  onModeChange,
  className,
  showDevicePreview = true,
}: PreviewModesProps) => {
  return (
    <div className={cn("space-y-4", className)}>
      {/* Mode selector */}
      <div className="flex justify-center gap-2">
        <Button
          variant={mode === 'both' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onModeChange('both')}
          className={cn(
            "transition-all duration-300",
            mode === 'both' && "shadow-glow hover:shadow-accent-glow"
          )}
        >
          <Monitor className="w-4 h-4 mr-2" />
          Both
        </Button>
        <Button
          variant={mode === 'desktop' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onModeChange('desktop')}
          className={cn(
            "transition-all duration-300",
            mode === 'desktop' && "shadow-glow hover:shadow-accent-glow"
          )}
        >
          <Monitor className="w-4 h-4 mr-2" />
          Desktop
        </Button>
        {mobileImage && (
          <Button
            variant={mode === 'mobile' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onModeChange('mobile')}
            className={cn(
              "transition-all duration-300",
              mode === 'mobile' && "shadow-glow hover:shadow-accent-glow"
            )}
          >
            <Smartphone className="w-4 h-4 mr-2" />
            Mobile
          </Button>
        )}
        {/* Always show the Video button; disable it when there is no video source */}
        <Button
          variant={mode === 'video' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onModeChange('video')}
          disabled={!videoSrc}
          title={!videoSrc ? 'No video available for this project' : undefined}
          className={cn(
            "transition-all duration-300",
            mode === 'video' && "shadow-glow hover:shadow-accent-glow"
          )}
        >
          <Video className="w-4 h-4 mr-2" />
          Video
        </Button>
      </div>

      {/* Preview area */}
      <div className="relative w-full">
        {/* Device Preview */}
        {mode !== 'video' && showDevicePreview && (
          <div className={cn("transition-all duration-500", "opacity-100")}>
            <DevicePreview
              desktopImage={desktopImage}
              mobileImage={mobileImage}
              title={title}
              // mode is narrowed by the conditional, cast to the accepted union for the prop
              display={mode as 'both' | 'desktop' | 'mobile'}
            />
          </div>
        )}

        {/* Video Preview (show fallback if video not available) */}
        {mode === 'video' && (
          <div className={cn(
            "relative w-full aspect-video rounded-2xl overflow-hidden",
            "transition-all duration-500",
            mode === 'video' ? "opacity-100" : "opacity-0"
          )}>
            {videoSrc ? (
              <video
                src={videoSrc}
                controls
                className="absolute inset-0 w-full h-full object-cover"
                poster={desktopImage}
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-zinc-900 text-muted-foreground">
                <div className="text-center">
                  <div className="text-2xl font-medium mb-2">No video available</div>
                  <div className="text-sm">This project doesn't include a video preview.</div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};