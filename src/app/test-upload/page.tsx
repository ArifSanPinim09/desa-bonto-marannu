'use client';

import { useState } from 'react';
import { ImageUpload } from '@/src/components/shared';
import { toast } from 'sonner';

export default function TestUploadPage() {
  const [singleImageUrl, setSingleImageUrl] = useState<string[]>([]);
  const [multipleImageUrls, setMultipleImageUrls] = useState<string[]>([]);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-12">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Image Upload Component Test
          </h1>
          <p className="text-gray-600">
            Testing the ImageUpload component with Supabase Storage integration
          </p>
        </div>

        {/* Single Image Upload */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Single Image Upload
          </h2>
          <ImageUpload
            bucket="hero-images"
            folder="test"
            multiple={false}
            maxSizeMB={5}
            existingImages={singleImageUrl}
            onUploadComplete={(urls) => {
              setSingleImageUrl(urls);
              toast.success('Image uploaded successfully!');
            }}
            onUploadError={(error) => {
              toast.error(`Upload failed: ${error.message}`);
            }}
            onRemoveExisting={(url) => {
              setSingleImageUrl(prev => prev.filter(u => u !== url));
              toast.info('Image removed');
            }}
          />
          {singleImageUrl.length > 0 && (
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Uploaded URL:</p>
              <code className="text-xs bg-gray-100 p-2 rounded block break-all">
                {singleImageUrl[0]}
              </code>
            </div>
          )}
        </div>

        {/* Multiple Image Upload */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Multiple Image Upload (Gallery)
          </h2>
          <ImageUpload
            bucket="destination-images"
            folder="test"
            multiple={true}
            maxSizeMB={5}
            existingImages={multipleImageUrls}
            onUploadComplete={(urls) => {
              setMultipleImageUrls(prev => [...prev, ...urls]);
              toast.success(`${urls.length} image(s) uploaded successfully!`);
            }}
            onUploadError={(error) => {
              toast.error(`Upload failed: ${error.message}`);
            }}
            onRemoveExisting={(url) => {
              setMultipleImageUrls(prev => prev.filter(u => u !== url));
              toast.info('Image removed');
            }}
          />
          {multipleImageUrls.length > 0 && (
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-700 mb-2">
                Uploaded URLs ({multipleImageUrls.length}):
              </p>
              <div className="space-y-1">
                {multipleImageUrls.map((url, index) => (
                  <code key={index} className="text-xs bg-gray-100 p-2 rounded block break-all">
                    {url}
                  </code>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
