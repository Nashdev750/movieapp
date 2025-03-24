import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ChevronRight, Edit, Trash2 } from 'lucide-react';
import { News } from '../types/news';

interface NewsCardProps {
  news: News;
  onDelete: (id: string) => void;
}

export const NewsCard: React.FC<NewsCardProps> = ({ news, onDelete }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden border border-gray-100">
      <div className="relative aspect-video overflow-hidden">
        <img
          src={news.image}
          alt={news.title}
          className="w-full h-full object-cover"
        />
        {news.gallery.length > 0 && (
          <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
            +{news.gallery.length} in gallery
          </div>
        )}
      </div>
      
      <div className="p-5">
        <div className="flex items-center text-sm text-gray-500 mb-3">
          <Calendar className="w-4 h-4 mr-1.5" />
          {news.date}
        </div>
        
        <h3 className="text-xl font-semibold mb-2 text-gray-900 line-clamp-2">
          {news.title}
        </h3>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {news.description}
        </p>
        
        <div className="flex items-center justify-between">
          <Link
            to={`/news/${news._id}`}
            className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            Read More
            <ChevronRight className="w-4 h-4 ml-1" />
          </Link>
          
          <div className="flex space-x-1">
            <Link
              to={`/news/edit/${news._id}`}
              className="p-2 text-gray-600 hover:text-yellow-600 hover:bg-yellow-50 rounded-full transition-colors duration-200"
            >
              <Edit className="w-4 h-4" />
            </Link>
            <button
              onClick={() => onDelete(news._id)}
              className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors duration-200"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};