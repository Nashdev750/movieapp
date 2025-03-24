import React from 'react';
import { Link } from 'react-router-dom';
import { Edit, Trash2, UtensilsCrossed } from 'lucide-react';
import { Menu } from '../types/menu';

interface MenuCardProps {
  menuItem: Menu;
  onDelete: (id: string) => void;
}

export const MenuCard: React.FC<MenuCardProps> = ({ menuItem, onDelete }) => {
  return (
    <div className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden border border-gray-100">
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={menuItem.image}
          alt={menuItem.name}
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-200"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
      </div>
      
      <div className="p-5">
        <h3 className="text-xl font-semibold mb-2 text-gray-900">
          {menuItem.name}
        </h3>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {menuItem.description}
        </p>
        
        <div className="flex justify-between items-center">
          <Link
            to={`/menu/${menuItem._id}`}
            className="flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors duration-200"
          >
            <UtensilsCrossed className="w-4 h-4 mr-1.5" />
            View Details
          </Link>
          
          <div className="flex space-x-1">
            <Link
              to={`/menu/edit/${menuItem._id}`}
              className="p-2 text-gray-600 hover:text-yellow-600 hover:bg-yellow-50 rounded-full transition-colors duration-200"
            >
              <Edit className="w-4 h-4" />
            </Link>
            <button
              onClick={() => onDelete(menuItem._id)}
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