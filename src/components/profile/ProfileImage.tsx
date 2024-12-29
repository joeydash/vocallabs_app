import React, { useRef, useState } from 'react';
import { useAuth } from '../../services/auth';
import { useUpdateProfileImage } from '../../hooks/useUpdateProfileImage';
import { Camera, Loader2 } from 'lucide-react';

export function ProfileImage() {
  const { user } = useAuth();
  const { updateProfileImage, loading, error } = useUpdateProfileImage();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user?.id) return;

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Convert to base64 and upload
    const base64Reader = new FileReader();
    base64Reader.onloadend = async () => {
      const base64String = (base64Reader.result as string).split(',')[1];
      await updateProfileImage({
        user_id: user.id,
        image: base64String
      });
    };
    base64Reader.readAsDataURL(file);
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative">
        <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-700">
          {preview || user?.dp ? (
            <img
              src={preview || user.dp}
              alt={user?.fullname || 'Profile'}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Camera className="w-12 h-12 text-gray-400" />
            </div>
          )}
        </div>
        
        {loading && (
          <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-white animate-spin" />
          </div>
        )}

        <button
          onClick={() => fileInputRef.current?.click()}
          className="absolute bottom-0 right-0 bg-primary-600 rounded-full p-2 text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          <Camera className="w-5 h-5" />
        </button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
}
