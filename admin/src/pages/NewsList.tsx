import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Newspaper, PlusCircle } from 'lucide-react';
import { NewsCard } from '../components/NewsCard';
import { newsService } from '../services/newsApi';
import { News } from '../types/news';

export const NewsList: React.FC = () => {
  const [news, setNews] = useState<News[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadNews();
  }, []);

  const loadNews = async () => {
    try {
      const data = await newsService.getAllNews();
      setNews(data);
    } catch (error) {
      console.error('Failed to load news:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this news item?')) return;
    
    try {
      await newsService.deleteNews(id);
      setNews(news.filter(item => item._id !== id));
    } catch (error) {
      console.error('Failed to delete news:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12">
          <div className="flex-1 min-w-0">
            <div className="flex items-center">
              <Newspaper className="h-10 w-10 text-blue-600" />
              <h1 className="ml-3 text-3xl font-bold leading-tight text-gray-900">
                Latest News
              </h1>
            </div>
            <p className="mt-2 text-sm text-gray-600">
              Manage your news and announcements
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <Link
              to="/news/add"
              className="inline-flex items-center px-6 py-3 border border-transparent shadow-sm text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
            >
              <PlusCircle className="w-5 h-5 mr-2" />
              Add News
            </Link>
          </div>
        </div>

        {news.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {news.map(item => (
              <NewsCard
                key={item._id}
                news={item}
                onDelete={handleDelete}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
            <Newspaper className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No news</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by adding some news or announcements.</p>
            <div className="mt-6">
              <Link
                to="/news/add"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <PlusCircle className="w-4 h-4 mr-2" />
                Add News
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};