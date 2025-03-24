import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { MenuForm } from '../components/MenuForm';
import { menuService } from '../services/menuApi';

export const AddMenuItem: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (menuData: Omit<Menu, '_id'>) => {
    setIsLoading(true);
    try {
      await menuService.createMenuItem(menuData);
      navigate('/menu');
    } catch (error) {
      console.error('Failed to create menu item:', error);
      alert('Failed to create menu item. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

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
          <h1 className="mt-4 text-3xl font-bold text-gray-900">Add Menu Item</h1>
          <p className="mt-2 text-sm text-gray-600">
            Create a new concession menu item.
          </p>
        </div>
        <MenuForm onSubmit={handleSubmit} isLoading={isLoading} />
      </div>
    </div>
  );
};