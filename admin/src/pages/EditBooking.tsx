import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { BookingForm } from '../components/BookingForm';
import { bookingService } from '../services/bookingApi';
import { Booking } from '../types/booking';

export const EditBooking: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (id) {
      loadBooking(id);
    }
  }, [id]);

  const loadBooking = async (bookingId: string) => {
    try {
      const data = await bookingService.getBooking(bookingId);
      setBooking(data);
    } catch (error) {
      console.error('Failed to load booking:', error);
      navigate('/bookings');
    }
  };

  const handleSubmit = async (bookingData: Omit<Booking, '_id'>) => {
    if (!id) return;
    
    setIsLoading(true);
    try {
      await bookingService.updateBooking(id, bookingData);
      navigate('/bookings');
    } catch (error) {
      console.error('Failed to update booking:', error);
      alert('Failed to update booking. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!booking) {
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
            to="/bookings"
            className="inline-flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Bookings
          </Link>
          <h1 className="mt-4 text-3xl font-bold text-gray-900">Edit Booking</h1>
          <p className="mt-2 text-sm text-gray-600">
            Update the booking details below.
          </p>
        </div>
        <BookingForm
          initialData={booking}
          onSubmit={handleSubmit}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};