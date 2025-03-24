import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, PlusCircle } from 'lucide-react';
import { BookingCard } from '../components/BookingCard';
import { bookingService } from '../services/bookingApi';
import { Booking } from '../types/booking';

export const BookingList: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      const data = await bookingService.getAllBookings();
      setBookings(data);
    } catch (error) {
      console.error('Failed to load bookings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this booking?')) return;
    
    try {
      await bookingService.deleteBooking(id);
      setBookings(bookings.filter(booking => booking._id !== id));
    } catch (error) {
      console.error('Failed to delete booking:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12">
          <div className="flex-1 min-w-0">
            <div className="flex items-center">
              <Calendar className="h-10 w-10 text-blue-600" />
              <h1 className="ml-3 text-3xl font-bold leading-tight text-gray-900">
                Bookings
              </h1>
            </div>
            <p className="mt-2 text-sm text-gray-600">
              Manage your movie bookings
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <Link
              to="/bookings/add"
              className="inline-flex items-center px-6 py-3 border border-transparent shadow-sm text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
            >
              <PlusCircle className="w-5 h-5 mr-2" />
              Add Booking
            </Link>
          </div>
        </div>

        {bookings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookings.map(booking => (
              <BookingCard
                key={booking._id}
                booking={booking}
                onDelete={handleDelete}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
            <Calendar className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No bookings</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by creating a new booking.</p>
            <div className="mt-6">
              <Link
                to="/bookings/add"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <PlusCircle className="w-4 h-4 mr-2" />
                Add Booking
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};