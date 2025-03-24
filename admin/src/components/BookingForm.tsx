import React, { useState, useEffect } from 'react';
import { Booking, BookingStatus } from '../types/booking';
import { branchService } from '../services/branchApi';
import { promoService } from '../services/promoApi';
import { Branch } from '../types/branch';
import { Ticket, X } from 'lucide-react';

interface BookingFormProps {
  initialData?: Booking;
  onSubmit: (data: Omit<Booking, '_id'>) => void;
  isLoading: boolean;
}

export const BookingForm: React.FC<BookingFormProps> = ({
  initialData,
  onSubmit,
  isLoading,
}) => {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [formData, setFormData] = useState({
    branchName: initialData?.branchName || '',
    date: initialData?.date || '',
    time: initialData?.time || '',
    fullName: initialData?.fullName || '',
    phoneNumber: initialData?.phoneNumber || '',
    status: initialData?.status || BookingStatus.Pending,
    promoCode: initialData?.promoCode || '',
    discountPercentage: initialData?.discountPercentage || 0,
  });

  const [promoError, setPromoError] = useState<string | null>(null);
  const [isValidatingPromo, setIsValidatingPromo] = useState(false);
  const [promoApplied, setPromoApplied] = useState(false);

  useEffect(() => {
    loadBranches();
  }, []);

  const loadBranches = async () => {
    try {
      const data = await branchService.getAllBranches();
      setBranches(data);
    } catch (error) {
      console.error('Failed to load branches:', error);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const validatePromoCode = async () => {
    if (!formData.promoCode) {
      setPromoError('Please enter a promo code');
      return;
    }

    setIsValidatingPromo(true);
    setPromoError(null);

    try {
      const promoData = await promoService.validatePromoCode(formData.promoCode);
      setFormData(prev => ({
        ...prev,
        discountPercentage: promoData.discountPercentage,
      }));
      setPromoApplied(true);
    } catch (error) {
      setPromoError('Invalid or expired promo code');
      setFormData(prev => ({
        ...prev,
        discountPercentage: 0,
      }));
      setPromoApplied(false);
    } finally {
      setIsValidatingPromo(false);
    }
  };

  const removePromoCode = () => {
    setFormData(prev => ({
      ...prev,
      promoCode: '',
      discountPercentage: 0,
    }));
    setPromoApplied(false);
    setPromoError(null);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Branch</label>
        <select
          value={formData.branchName}
          onChange={(e) => setFormData({ ...formData, branchName: e.target.value })}
          className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors duration-200"
          required
        >
          <option value="">Select a branch</option>
          {branches.map((branch) => (
            <option key={branch._id} value={branch.name}>
              {branch.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
        <input
          type="date"
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors duration-200"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
        <input
          type="time"
          value={formData.time}
          onChange={(e) => setFormData({ ...formData, time: e.target.value })}
          className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors duration-200"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
        <input
          type="text"
          value={formData.fullName}
          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
          className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors duration-200"
          placeholder="Enter your full name"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
        <input
          type="tel"
          value={formData.phoneNumber}
          onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
          className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors duration-200"
          placeholder="Enter your phone number"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Promo Code</label>
        <div className="relative">
          <input
            type="text"
            value={formData.promoCode}
            onChange={(e) => setFormData({ ...formData, promoCode: e.target.value.toUpperCase() })}
            className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors duration-200 ${
              promoApplied ? 'border-green-500 bg-green-50' : promoError ? 'border-red-500 bg-red-50' : 'border-gray-200'
            }`}
            placeholder="Enter promo code"
            disabled={promoApplied}
          />
          {!promoApplied && (
            <button
              type="button"
              onClick={validatePromoCode}
              disabled={isValidatingPromo || !formData.promoCode}
              className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isValidatingPromo ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Validating
                </span>
              ) : (
                'Apply'
              )}
            </button>
          )}
          {promoApplied && (
            <button
              type="button"
              onClick={removePromoCode}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
        {promoError && (
          <p className="mt-1 text-sm text-red-600">{promoError}</p>
        )}
        {promoApplied && (
          <div className="mt-2 flex items-center text-green-700 text-sm">
            <Ticket className="w-4 h-4 mr-1.5" />
            {formData.discountPercentage}% discount applied
          </div>
        )}
      </div>

      {initialData && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: Number(e.target.value) })}
            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors duration-200"
            required
          >
            <option value={BookingStatus.Pending}>Pending</option>
            <option value={BookingStatus.Confirmed}>Confirmed</option>
            <option value={BookingStatus.Canceled}>Canceled</option>
          </select>
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-500/20 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
      >
        {isLoading ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Saving Changes...
          </span>
        ) : initialData ? 'Update Booking' : 'Create Booking'}
      </button>
    </form>
  );
};