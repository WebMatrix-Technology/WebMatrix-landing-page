import React from 'react';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/supabase';

type DropzoneProps = {
  label?: string;
  className?: string;
  onImageSelected: (params: { file: File; dataUrl: string; url?: string }) => void;
  previewUrl?: string;
  getAccessToken?: () => Promise<string | null>;
};

export const ImageDropzone: React.FC<DropzoneProps> = ({
  label = 'Drop image here or click to upload',
  className,
  onImageSelected,
  previewUrl,
  // getAccessToken, // Not needed for direct upload with Anon key (assuming public bucket or RLS allows anon uploads)
}) => {
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = React.useState(false);
  const [preview, setPreview] = React.useState<string | undefined>(previewUrl);
  const [uploading, setUploading] = React.useState(false);

  React.useEffect(() => {
    setPreview(previewUrl);
  }, [previewUrl]);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    if (!file.type.startsWith('image/')) return;

    // Create base64 preview for immediate feedback
    const base64DataUrl = await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = String(reader.result || '');
        setPreview(dataUrl);
        resolve(dataUrl);
      };
      reader.readAsDataURL(file);
    });

    try {
      setUploading(true);

      // Generate a unique file name
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      // Upload to Supabase Storage directly
      const { data, error } = await supabase.storage
        .from('project-images') // Bucket name found in backend/api/upload.ts
        .upload(filePath, file);

      if (error) {
        throw error;
      }

      if (data) {
        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('project-images')
          .getPublicUrl(filePath);

        setPreview(publicUrl);
        onImageSelected({ file, dataUrl: publicUrl, url: publicUrl });
        return;
      }
    } catch (error) {
      console.error('Upload to Supabase Storage failed:', error);
      // Fallback to base64 if upload fails (optional, or show error)
      // onImageSelected({ file, dataUrl: base64DataUrl }); // Uncomment if you want fallback
      alert('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
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
          <div className="font-medium">
            {uploading ? 'Uploading...' : 'Upload image'}
          </div>
          <div className="text-muted-foreground">{label}</div>
        </div>
      </div>
    </div>
  );
};

