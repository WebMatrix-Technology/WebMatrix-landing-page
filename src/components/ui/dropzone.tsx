import React from 'react';
import { cn } from '@/lib/utils';

type DropzoneProps = {
  label?: string;
  className?: string;
  onImageSelected: (params: { file: File; dataUrl: string }) => void;
  previewUrl?: string;
};

export const ImageDropzone: React.FC<DropzoneProps> = ({
  label = 'Drop image here or click to upload',
  className,
  onImageSelected,
  previewUrl,
}) => {
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = React.useState(false);
  const [preview, setPreview] = React.useState<string | undefined>(previewUrl);

  React.useEffect(() => {
    setPreview(previewUrl);
  }, [previewUrl]);

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = String(reader.result || '');
      setPreview(dataUrl);
      onImageSelected({ file, dataUrl });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div
      className={cn(
        'rounded-lg border border-dashed border-border/60 bg-muted/10 p-3 hover:bg-muted/20 transition-colors cursor-pointer',
        isDragging && 'bg-muted/30',
        className,
      )}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragging(false);
        handleFiles(e.dataTransfer.files);
      }}
      onClick={() => inputRef.current?.click()}
      role="button"
      aria-label="Upload image"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          inputRef.current?.click();
        }
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
      <div className="flex items-center gap-3">
        <div className="h-14 w-14 rounded-md overflow-hidden bg-muted/40 flex items-center justify-center shrink-0">
          {preview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview} alt="preview" className="h-full w-full object-cover" />
          ) : (
            <div className="text-xs text-muted-foreground">No image</div>
          )}
        </div>
        <div className="text-sm">
          <div className="font-medium">Upload image</div>
          <div className="text-muted-foreground">{label}</div>
        </div>
      </div>
    </div>
  );
};

