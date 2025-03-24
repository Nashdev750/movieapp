import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { MovieForm } from '../components/MovieForm';
import { api } from '../services/api';
import { Movie } from '../types/movie';

export const EditMovie: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (id) {
      loadMovie(id);
    }
  }, [id]);

  const loadMovie = async (movieId: string) => {
    try {
      const data = await api.getMovie(movieId);
      setMovie(data);
    } catch (error) {
      console.error('Failed to load movie:', error);
      navigate('/');
    }
  };

  const handleSubmit = async (movieData: Omit<Movie, '_id'>) => {
    if (!id) return;
    
    setIsLoading(true);
    try {
      await api.updateMovie(id, movieData);
      navigate('/');
    } catch (error) {
      console.error('Failed to update movie:', error);
      alert('Failed to update movie. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!movie) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

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
          <h1 className="mt-4 text-3xl font-bold text-gray-900">Edit Movie</h1>
          <p className="mt-2 text-sm text-gray-600">
            Update the movie details below.
          </p>
        </div>
        <MovieForm
          initialData={movie}
          onSubmit={handleSubmit}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};