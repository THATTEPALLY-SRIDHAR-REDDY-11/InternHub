import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Upload, File, X, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface FileUploadProps {
  onUploadComplete?: (fileData: { url: string; filename: string }) => void;
  acceptedTypes?: string;
  maxSize?: number; // in MB
}

export const FileUpload = ({ 
  onUploadComplete, 
  acceptedTypes = '.pdf,.doc,.docx,.jpg,.jpeg,.png',
  maxSize = 5 
}: FileUploadProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.size > maxSize * 1024 * 1024) {
        toast({
          title: 'File too large',
          description: `File size must be less than ${maxSize}MB`,
          variant: 'destructive',
        });
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:4000/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      toast({
        title: 'Success',
        description: 'File uploaded successfully',
      });

      if (onUploadComplete) {
        onUploadComplete({ url: data.url, filename: data.filename });
      }

      setFile(null);
    } catch (error) {
      toast({
        title: 'Upload failed',
        description: 'Failed to upload file. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    setFile(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Input
          type="file"
          accept={acceptedTypes}
          onChange={handleFileChange}
          disabled={uploading}
          className="flex-1"
        />
        {file && (
          <Button
            type="button"
            onClick={handleUpload}
            disabled={uploading}
            size="sm"
          >
            {uploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Upload
              </>
            )}
          </Button>
        )}
      </div>

      {file && (
        <div className="flex items-center justify-between p-3 bg-secondary rounded-lg">
          <div className="flex items-center gap-2">
            <File className="h-4 w-4" />
            <span className="text-sm">{file.name}</span>
            <span className="text-xs text-muted-foreground">
              ({(file.size / 1024).toFixed(2)} KB)
            </span>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleRemove}
            disabled={uploading}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};
