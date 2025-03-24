import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { BranchForm } from '../components/BranchForm';
import { branchService } from '../services/branchApi';

export const AddBranch: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (branchData: Omit<Branch, '_id'>) => {
    setIsLoading(true);
    try {
      await branchService.createBranch(branchData);
      navigate('/branches');
    } catch (error) {
      console.error('Failed to create branch:', error);
      alert('Failed to create branch. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link
            to="/branches"
            className="inline-flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Branches
          </Link>
          <h1 className="mt-4 text-3xl font-bold text-gray-900">Add New Branch</h1>
          <p className="mt-2 text-sm text-gray-600">
            Fill in the details below to add a new branch location.
          </p>
        </div>
        <BranchForm onSubmit={handleSubmit} isLoading={isLoading} />
      </div>
    </div>
  );
};