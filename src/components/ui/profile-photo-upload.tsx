import React, { useState } from 'react';
import { Camera, Upload, Image } from 'lucide-react';
import { Button } from './button';

interface ProfilePhotoUploadProps {
  currentPhoto?: string | null;
  onPhotoUpdate: (file: File) => Promise<void>;
  employeeId: string;
  size?: 'sm' | 'md' | 'lg';
}

const ProfilePhotoUpload: React.FC<ProfilePhotoUploadProps> = ({
  currentPhoto,
  onPhotoUpdate,
  employeeId,
  size = 'md'
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [hover, setHover] = useState(false);

  const sizeClasses = {
    sm: 'w-20 h-20',
    md: 'w-24 h-24',
    lg: 'w-32 h-32'
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsUploading(true);
      try {
        await onPhotoUpdate(file);
      } catch (error) {
        console.error('Upload failed:', error);
      } finally {
        setIsUploading(false);
      }
    }
  };

  return (
    <div 
      className={`
        relative rounded-full border-4 border-white/20 bg-gradient-to-br from-slate-700 to-slate-800
        flex items-center justify-center cursor-pointer transition-all duration-300
        ${sizeClasses[size]} mx-auto
        ${hover ? 'ring-4 ring-blue-500/30 scale-105' : 'ring-0 scale-100'}
      `}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <input
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        disabled={isUploading}
      />
      
      {currentPhoto ? (
        <div className="relative w-full h-full rounded-full overflow-hidden">
          <img
            src={currentPhoto}
            alt="Profile"
            className="w-full h-full object-cover rounded-full"
          />
          {hover && (
            <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
              <Camera className="w-6 h-6 text-white" />
            </div>
          )}
        </div>
      ) : (
        <div className="text-center space-y-1">
          {isUploading ? (
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          ) : (
            <>
              <div className={`w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center mb-1 ${size === 'lg' ? 'w-10 h-10' : ''}`}>
                <Camera className={`w-4 h-4 text-blue-400 ${size === 'lg' ? 'w-5 h-5' : ''}`} />
              </div>
              <p className={`text-xs text-slate-400 ${size === 'lg' ? 'text-sm' : ''}`}>
                Add Photo
              </p>
            </>
          )}
        </div>
      )}
      
      {isUploading && (
        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-3 py-1 rounded-full text-xs">
          Uploading...
        </div>
      )}
    </div>
  );
};

export default ProfilePhotoUpload;
