import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, Phone, Edit, Trash2, Building2, Ticket } from 'lucide-react';
import { Booking, BookingStatus } from '../types/booking';

interface BookingCardProps {
  booking: Booking;
  onDelete: (id: string) => void;
}

export const BookingCard: React.FC<BookingCardProps> = ({ booking, onDelete }) => {
  const getStatusColor = (status: BookingStatus) => {
    switch (status) {
      case BookingStatus.Confirmed:
        return 'bg-green-100 text-green-800';
      case BookingStatus.Canceled:
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getStatusText = (status: BookingStatus) => {
    switch (status) {
      case BookingStatus.Confirmed:
        return 'Confirmed';
      case BookingStatus.Canceled:
        return 'Canceled';
      default:
        return 'Pending';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden border border-gray-100">
      <div className="p-5">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-semibold text-gray-900">
            {booking.fullName}
          </h3>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
            {getStatusText(booking.status)}
          </span>
        </div>

        <div className="space-y-3 mb-4">
          <div className="flex items-center text-gray-600">
            <Building2 className="w-4 h-4 mr-2" />
            {booking.branchName}
          </div>
          
          <div className="flex items-center text-gray-600">
            <Calendar className="w-4 h-4 mr-2" />
            {booking.date}
          </div>
          
          <div className="flex items-center text-gray-600">
            <Clock className="w-4 h-4 mr-2" />
            {booking.time}
          </div>
          
          <div className="flex items-center text-gray-600">
            <Phone className="w-4 h-4 mr-2" />
            {booking.phoneNumber}
          </div>

          {booking.promoCode && (
            <div className="flex items-center text-green-600">
              <Ticket className="w-4 h-4 mr-2" />
              {booking.discountPercentage}% off with {booking.promoCode}
            </div>
          )}
        </div>
        
        <div className="flex justify-end space-x-1">
          <Link
            to={`/bookings/edit/${booking._id}`}
            className="p-2 text-gray-600 hover:text-yellow-600 hover:bg-yellow-50 rounded-full transition-colors duration-200"
          >
            <Edit className="w-4 h-4" />
          </Link>
          <button
            onClick={() => onDelete(booking._id)}
            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors duration-200"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};