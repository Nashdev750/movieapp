import React, { useCallback, useEffect, useState } from 'react';
import { ImageFile } from '../types/image';
import { imageService } from '../services/imageApi';
import { Upload, Trash2, Image as ImageIcon, AlertCircle } from 'lucide-react';

export const Gallery: React.FC = () => {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const loadImages = async () => {
    try {
      setError(null);
      const data = await imageService.getAllImages();
      console.log(data)
      setImages(data);
    } catch (err) {
      setError('Failed to load images');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadImages();
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files).filter(file => 
      file.type.startsWith('image/')
    );

    if (files.length === 0) {
      setError('Please drop only image files');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      await imageService.uploadImages(files);
      await loadImages();
    } catch (err) {
      setError('Failed to upload images');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;

    const files = Array.from(e.target.files);
    
    try {
      setIsLoading(true);
      setError(null);
      await imageService.uploadImages(files);
      await loadImages();
    } catch (err) {
      setError('Failed to upload images');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (imageName: string) => {
    if (!window.confirm('Are you sure you want to delete this image?')) return;

    try {
      setError(null);
      await imageService.deleteImage(imageName);
      setImages(images.filter(img => img.name !== imageName));
    } catch (err) {
      setError('Failed to delete image');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Image Gallery</h1>
            <p className="mt-2 text-sm text-gray-600">
              Upload and manage your images
            </p>
          </div>
          <label className="cursor-pointer inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200">
            <Upload className="w-5 h-5 mr-2" />
            Upload Images
            <input
              type="file"
              className="hidden"
              multiple
              accept="image/*"
              onChange={handleFileSelect}
            />
          </label>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 rounded-lg flex items-center text-red-800">
            <AlertCircle className="w-5 h-5 mr-2" />
            {error}
          </div>
        )}

        <div
          className={`mb-8 border-2 border-dashed rounded-lg p-8 transition-colors duration-200 ${
            isDragging
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="text-center">
            <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-sm text-gray-600">
              Drag and drop your images here, or click the upload button above
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : images.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {images.map((image) => (
              <div
                key={image.name}
                className="group relative bg-white rounded-lg shadow-sm overflow-hidden"
              >
                <img
                  src={image.url}
                  alt={image.name}
                  className="w-full aspect-square object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity duration-200" />
                <button
                  onClick={() => handleDelete(image.name)}
                  className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-50"
                >
                  <Trash2 className="w-5 h-5 text-red-600" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm">
            <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No images</h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by uploading some images
            </p>
          </div>
        )}
      </div>
    </div>
  );
};