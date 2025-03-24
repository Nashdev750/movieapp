import React from 'react';
import { NavLink } from 'react-router-dom';
import { Film, Image as ImageIcon, Plus, Building2, Newspaper, UtensilsCrossed, Calendar } from 'lucide-react';

export const Navbar: React.FC = () => {
  return (
    <nav className="bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <NavLink
              to="/"
              className="flex items-center px-2 py-2 text-gray-900 hover:text-blue-600 transition-colors duration-200"
            >
              <Film className="w-6 h-6" />
              <span className="ml-2 text-lg font-semibold">MovieBox</span>
            </NavLink>
          </div>

          <div className="flex space-x-2">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                  isActive
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`
              }
            >
              <Film className="w-4 h-4 mr-2" />
              Movies
            </NavLink>

            <NavLink
              to="/bookings"
              className={({ isActive }) =>
                `flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                  isActive
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`
              }
            >
              <Calendar className="w-4 h-4 mr-2" />
              Bookings
            </NavLink>

            <NavLink
              to="/menu"
              className={({ isActive }) =>
                `flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                  isActive
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`
              }
            >
              <UtensilsCrossed className="w-4 h-4 mr-2" />
              Menu
            </NavLink>

            <NavLink
              to="/branches"
              className={({ isActive }) =>
                `flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                  isActive
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`
              }
            >
              <Building2 className="w-4 h-4 mr-2" />
              Branches
            </NavLink>

            <NavLink
              to="/news"
              className={({ isActive }) =>
                `flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                  isActive
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`
              }
            >
              <Newspaper className="w-4 h-4 mr-2" />
              News
            </NavLink>

            <NavLink
              to="/gallery"
              className={({ isActive }) =>
                `flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                  isActive
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`
              }
            >
              <ImageIcon className="w-4 h-4 mr-2" />
              Gallery
            </NavLink>

            <NavLink
              to="/add"
              className={({ isActive }) =>
                `flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                  isActive
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`
              }
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Movie
            </NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
};