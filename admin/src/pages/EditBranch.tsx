import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { BranchForm } from '../components/BranchForm';
import { branchService } from '../services/branchApi';
import { Branch } from '../types/branch';

export const EditBranch: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [branch, setBranch] = useState<Branch | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (id) {
      loadBranch(id);
    }
  }, [id]);

  const loadBranch = async (branchId: string) => {
    try {
      const data = await branchService.getBranch(branchId);
      setBranch(data);
    } catch (error) {
      console.error('Failed to load branch:', error);
      navigate('/branches');
    }
  };

  const handleSubmit = async (branchData: Omit<Branch, '_id'>) => {
    if (!id) return;
    
    setIsLoading(true);
    try {
      await branchService.updateBranch(id, branchData);
      navigate('/branches');
    } catch (error) {
      console.error('Failed to update branch:', error);
      alert('Failed to update branch. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!branch) {
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
            to="/branches"
            className="inline-flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Branches
          </Link>
          <h1 className="mt-4 text-3xl font-bold text-gray-900">Edit Branch</h1>
          <p className="mt-2 text-sm text-gray-600">
            Update the branch location details below.
          </p>
        </div>
        <BranchForm
          initialData={branch}
          onSubmit={handleSubmit}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};