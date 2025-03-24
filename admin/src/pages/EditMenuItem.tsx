import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { MenuForm } from '../components/MenuForm';
import { menuService } from '../services/menuApi';
import { Menu } from '../types/menu';

export const EditMenuItem: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [menuItem, setMenuItem] = useState<Menu | null>(null);
  const [isLoading, setIsLoading] = useState(false);

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
      navigate('/menu');
    }
  };

  const handleSubmit = async (menuData: Omit<Menu, '_id'>) => {
    if (!id) return;
    
    setIsLoading(true);
    try {
      await menuService.updateMenuItem(id, menuData);
      navigate('/menu');
    } catch (error) {
      console.error('Failed to update menu item:', error);
      alert('Failed to update menu item. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!menuItem) {
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
            to="/menu"
            className="inline-flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Menu
          </Link>
          <h1 className="mt-4 text-3xl font-bold text-gray-900">Edit Menu Item</h1>
          <p className="mt-2 text-sm text-gray-600">
            Update the menu item details below.
          </p>
        </div>
        <MenuForm
          initialData={menuItem}
          onSubmit={handleSubmit}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};