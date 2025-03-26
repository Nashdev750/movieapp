import React, { useState, useEffect } from 'react';
import { ImageIcon } from 'lucide-react';
import { Movie } from '../types/movie';
import { ImageFile } from '../types/image';
import { imageService } from '../services/imageApi';
import { ImageSelectionModal } from './ImageSelectionModal';

interface MovieFormProps {
  initialData?: Movie;
  onSubmit: (data: Omit<Movie, '_id'>) => void;
  isLoading: boolean;
}

export const MovieForm: React.FC<MovieFormProps> = ({ initialData, onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    genre: initialData?.genre || '',
    image: initialData?.image || '',
    description: initialData?.description || '',
    trailerUrl: initialData?.trailerUrl || '',
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [images, setImages] = useState<ImageFile[]>([]);
  const [isLoadingImages, setIsLoadingImages] = useState(false);

  useEffect(() => {
    loadImages();
  }, []);

  const loadImages = async () => {
    try {
      setIsLoadingImages(true);
      const data = await imageService.getAllImages();
      setImages(data);
    } catch (error) {
      console.error('Failed to load images:', error);
    } finally {
      setIsLoadingImages(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleImageSelect = (imageUrl: string) => {
    setFormData({ ...formData, image: imageUrl });
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Movie Title</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors duration-200"
            placeholder="Enter movie title"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Movie Genre</label>
          <input
            type="text"
            value={formData.genre}
            onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors duration-200"
            placeholder="Enter movie genre"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Cover Image</label>
          <div className="mt-1 flex items-center">
            {formData.image ? (
              <div className="relative group w-full">
                <img
                  src={formData.image}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => setIsModalOpen(true)}
                  className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200"
                >
                  <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    Change Image
                  </span>
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="w-full h-48 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center hover:border-gray-400 transition-colors duration-200"
              >
                <ImageIcon className="w-8 h-8 text-gray-400" />
                <span className="mt-2 text-sm text-gray-600">Select from Gallery</span>
              </button>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={4}
            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors duration-200"
            placeholder="Enter movie description"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Trailer URL</label>
          <input
            type="url"
            value={formData.trailerUrl}
            onChange={(e) => setFormData({ ...formData, trailerUrl: e.target.value })}
            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors duration-200"
            placeholder="https://www.youtube.com/embed/..."
            required
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-500/20 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving Changes...
            </span>
          ) : 'Save Movie'}
        </button>
      </form>

      <ImageSelectionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        images={images}
        onSelect={handleImageSelect}
        isLoading={isLoadingImages}
      />
    </>
  );
};