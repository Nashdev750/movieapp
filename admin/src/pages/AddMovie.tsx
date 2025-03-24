import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { MovieForm } from '../components/MovieForm';
import { api } from '../services/api';

export const AddMovie: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (movieData: Omit<Movie, '_id'>) => {
    setIsLoading(true);
    try {
      await api.createMovie(movieData);
      navigate('/');
    } catch (error) {
      console.error('Failed to create movie:', error);
      alert('Failed to create movie. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Movies
          </Link>
          <h1 className="mt-4 text-3xl font-bold text-gray-900">Add New Movie</h1>
          <p className="mt-2 text-sm text-gray-600">
            Fill in the details below to add a new movie to your collection.
          </p>
        </div>
        <MovieForm onSubmit={handleSubmit} isLoading={isLoading} />
      </div>
    </div>
  );
};