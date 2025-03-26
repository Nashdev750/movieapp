const mongoose = require('mongoose');

// Define the Menu schema
const menuSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  }
}, { timestamps: true });

// Create the model
const Menu = mongoose.model('Menu', menuSchema);

module.exports = { Menu };
