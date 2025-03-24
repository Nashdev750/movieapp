import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Edit } from 'lucide-react';
import { menuService } from '../services/menuApi';
import { Menu } from '../types/menu';

export const MenuDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [menuItem, setMenuItem] = useState<Menu | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadMenuItem(id);
    }
  }, [id]);

  const loadMenuItem = async (menuId: string) => {
    try {
      const data = await menuService.getMenuItem(menuId);
      setMenuItem(data);
    } catch (error) {
      console.error('Failed to load menu item:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!menuItem) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12 bg-white rounded-xl shadow-sm">
            <p className="text-gray-500 text-lg">Menu item not found</p>
            <Link
              to="/menu"
              className="mt-4 inline-flex items-center text-blue-600 hover:text-blue-800"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Menu
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link
            to="/menu"
            className="inline-flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Menu
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="relative aspect-video">
            <img
              src={menuItem.image}
              alt={menuItem.name}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="p-6 md:p-8">
            <div className="flex justify-between items-start">
              <h1 className="text-3xl font-bold text-gray-900">
                {menuItem.name}
              </h1>
              <Link
                to={`/menu/edit/${menuItem._id}`}
                className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
              >
                <Edit className="w-5 h-5" />
              </Link>
            </div>

            <p className="mt-4 text-gray-600 leading-relaxed">
              {menuItem.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};