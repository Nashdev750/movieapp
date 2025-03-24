import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { NewsForm } from '../components/NewsForm';
import { newsService } from '../services/newsApi';

export const AddNews: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (newsData: Omit<News, '_id'>) => {
    setIsLoading(true);
    try {
      await newsService.createNews(newsData);
      navigate('/news');
    } catch (error) {
      console.error('Failed to create news:', error);
      alert('Failed to create news. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link
            to="/news"
            className="inline-flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to News
          </Link>
          <h1 className="mt-4 text-3xl font-bold text-gray-900">Add News</h1>
          <p className="mt-2 text-sm text-gray-600">
            Create a new news article or announcement.
          </p>
        </div>
        <NewsForm onSubmit={handleSubmit} isLoading={isLoading} />
      </div>
    </div>
  );
};