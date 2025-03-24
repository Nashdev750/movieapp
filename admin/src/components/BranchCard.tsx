import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Edit, Trash2, ExternalLink } from 'lucide-react';
import { Branch } from '../types/branch';

interface BranchCardProps {
  branch: Branch;
  onDelete: (id: string) => void;
}

export const BranchCard: React.FC<BranchCardProps> = ({ branch, onDelete }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden border border-gray-100">
      <div className="relative aspect-video overflow-hidden">
        <img
          src={branch.images[0]}
          alt={branch.name}
          className="w-full h-full object-cover"
        />
        {branch.images.length > 1 && (
          <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
            +{branch.images.length - 1} more
          </div>
        )}
      </div>
      
      <div className="p-5">
        <h3 className="text-xl font-semibold mb-2 text-gray-900">
          {branch.name}
        </h3>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {branch.address}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex space-x-2">
            <a
              href={branch.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 text-sm font-medium hover:bg-blue-100 transition-colors duration-200"
            >
              <MapPin className="w-4 h-4 mr-1.5" />
              View Map
              <ExternalLink className="w-3 h-3 ml-1" />
            </a>
          </div>
          
          <div className="flex space-x-1">
            <Link
              to={`/branches/edit/${branch._id}`}
              className="p-2 text-gray-600 hover:text-yellow-600 hover:bg-yellow-50 rounded-full transition-colors duration-200"
            >
              <Edit className="w-4 h-4" />
            </Link>
            <button
              onClick={() => onDelete(branch._id)}
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