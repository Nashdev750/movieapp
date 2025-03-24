import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { NewsForm } from '../components/NewsForm';
import { newsService } from '../services/newsApi';
import { News } from '../types/news';

export const EditNews: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [news, setNews] = useState<News | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (id) {
      loadNews(id);
    }
  }, [id]);

  const loadNews = async (newsId: string) => {
    try {
      const data = await newsService.getNews(newsId);
      setNews(data);
    } catch (error) {
      console.error('Failed to load news:', error);
      navigate('/news');
    }
  };

  const handleSubmit = async (newsData: Omit<News, '_id'>) => {
    if (!id) return;
    
    setIsLoading(true);
    try {
      await newsService.updateNews(id, newsData);
      navigate('/news');
    } catch (error) {
      console.error('Failed to update news:', error);
      alert('Failed to update news. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!news) {
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
            to="/news"
            className="inline-flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to News
          </Link>
          <h1 className="mt-4 text-3xl font-bold text-gray-900">Edit News</h1>
          <p className="mt-2 text-sm text-gray-600">
            Update the news article details below.
          </p>
        </div>
        <NewsForm
          initialData={news}
          onSubmit={handleSubmit}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};