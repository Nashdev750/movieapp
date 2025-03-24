const mongoose = require('mongoose');

// Define BookingStatus Enum
const BookingStatus = {
  Pending: 0,
  Confirmed: 1,
  Canceled: 2
};

// Define the Booking schema
const bookingSchema = new mongoose.Schema({
  branchName: {
    type: String,
    required: true
  },
  date: {
    type: String,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  fullName: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: String,
    required: true
  },
  status: {
    type: Number,
    enum: Object.values(BookingStatus),
    required: true
  },
  promoCode: {
    type: String
  },
  discountPercentage: {
    type: Number
  }
});

// Create the model
const Booking = mongoose.model('Booking', bookingSchema);

module.exports = { Booking, BookingStatus };
