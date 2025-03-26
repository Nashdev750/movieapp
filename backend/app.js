const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { Booking, BookingStatus } = require('./bookingmodel');
const { Menu } = require('./menu.model');

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect('mongodb://127.0.0.1:27017/moviesDB');

const movieSchema = new mongoose.Schema({
  title: String,
  genre: String,
  image: String,
  description: String,
  trailerUrl: String,
}, { timestamps: true });

const newsSchema = new mongoose.Schema({
  title: String,
  image: String,
  date: String,
  description: String,
  gallery: [String],
}, { timestamps: true });

const branchSchema = new mongoose.Schema({
  name: String,
  address: String,
  googleMapsUrl: String,
  images: [String],
}, { timestamps: true });

const Movie = mongoose.model('Movie', movieSchema);
const News = mongoose.model('News', newsSchema);
const Branch = mongoose.model('Branch', branchSchema);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage: storage });
const router = express.Router();

// CRUD for Movies
router.post('/movies', async (req, res) => {
  try {
    const newMovie = new Movie(req.body);
    await newMovie.save();
    res.status(201).json(newMovie);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/movies', async (req, res) => {
  const movies = await Movie.find().sort({ createdAt: 1 });
  res.json(movies);
});

router.get('/movies/:id', async (req, res) => {
  const movie = await Movie.findById(req.params.id);
  res.json(movie);
});

router.put('/movies/:id', async (req, res) => {
  const updatedMovie = await Movie.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updatedMovie);
});

router.delete('/movies/:id', async (req, res) => {
  await Movie.findByIdAndDelete(req.params.id);
  res.json({ message: 'Movie deleted successfully' });
});

// CRUD for News
router.post('/news', async (req, res) => {
  try {
    const newNews = new News(req.body);
    await newNews.save();
    res.status(201).json(newNews);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/news', async (req, res) => {
  const news = await News.find().sort({ createdAt: 1 });
  res.json(news);
});

router.get('/news/:id', async (req, res) => {
  const newsArticle = await News.findById(req.params.id);
  res.json(newsArticle);
});

router.put('/news/:id', async (req, res) => {
  const updatedNews = await News.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updatedNews);
});

router.delete('/news/:id', async (req, res) => {
  await News.findByIdAndDelete(req.params.id);
  res.json({ message: 'News deleted successfully' });
});

// CRUD for Branches
router.post('/branches', async (req, res) => {
  try {
    const newBranch = new Branch(req.body);
    await newBranch.save();
    res.status(201).json(newBranch);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/branches', async (req, res) => {
  const branches = await Branch.find().sort({ createdAt: 1 });
  res.json(branches);
});

router.get('/branches/:id', async (req, res) => {
  const branch = await Branch.findById(req.params.id);
  res.json(branch);
});

router.put('/branches/:id', async (req, res) => {
  const updatedBranch = await Branch.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updatedBranch);
});

router.delete('/branches/:id', async (req, res) => {
  await Branch.findByIdAndDelete(req.params.id);
  res.json({ message: 'Branch deleted successfully' });
});

// Upload images in bulk
router.post('/upload', upload.array('images', 10), (req, res) => {
  const filePaths = req.files.map(file => `/uploads/${file.filename}`);
  res.json({ images: filePaths });
});

// Get all image URLs
router.get('/images', (req, res) => {
  fs.readdir('uploads/', (err, files) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to read images directory' });
    }
  
    // Sort files based on the numeric timestamp at the start of the filename
    files.sort((a, b) => {
      const timestampA = parseInt(a.split('-')[0]); // Extract timestamp from filename
      const timestampB = parseInt(b.split('-')[0]);
      return timestampB - timestampA; // Sort in descending order (latest first)
    });
  
    // Format response
    res.json(files.map(file => ({
      url: `https://genz-panel.space/api/images/${file}`,
      name: file
    })));
  });
  });

// Get a single image URL
router.get('/images/:imageName', (req, res) => {
  res.sendFile(path.join(__dirname, 'uploads', req.params.imageName));
});

// Delete an image
router.delete('/images/:imageName', (req, res) => {
  const fs = require('fs');
  const filePath = path.join(__dirname, 'uploads', req.params.imageName);

  fs.unlink(filePath, (err) => {
    if (err) return res.status(500).json({ error: 'Image not found or already deleted' });
    res.json({ message: 'Image deleted successfully' });
  });
});




// Create a new booking
router.post('/bookings', async (req, res) => {
  try {
    const { branchName, date, time, fullName, phoneNumber, status, promoCode, discountPercentage } = req.body;
    
    const booking = new Booking({
      userid,
      branchName,
      date,
      time,
      fullName,
      phoneNumber,
      status,
      promoCode,
      discountPercentage
    });
    
    await booking.save();
    res.status(201).json(booking);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all bookings
router.get('/bookings', async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: 1 });
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.get('/bookings/user/:userid', async (req, res) => {
  const bookings = await Booking.find({userid: req.params.userid}).sort({ createdAt: 1 });
  res.json(bookings);
});

// Get a specific booking by ID
router.get('/bookings/:id', async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    res.status(200).json(booking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a booking by ID
router.put('/bookings/:id', async (req, res) => {
  try {
    const { branchName, date, time, fullName, phoneNumber, status, promoCode, discountPercentage } = req.body;
    
    const updatedBooking = await Booking.findByIdAndUpdate(req.params.id, {
      branchName,
      date,
      time,
      fullName,
      phoneNumber,
      status,
      promoCode,
      discountPercentage
    }, { new: true });

    if (!updatedBooking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    res.status(200).json(updatedBooking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a booking by ID
router.delete('/bookings/:id', async (req, res) => {
  try {
    const deletedBooking = await Booking.findByIdAndDelete(req.params.id);
    if (!deletedBooking) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    res.status(200).json({ message: 'Booking deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
})

// Create a new menu item
router.post('/menus', async (req, res) => {
  try {
    const { name, image, description } = req.body;
    const menu = new Menu({
      name,
      image,
      description
    });
    
    await menu.save();
    res.status(201).json(menu);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all menu items
router.get('/menus', async (req, res) => {
  try {
    const menus = await Menu.find().sort({ createdAt: 1 });
    res.status(200).json(menus);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a specific menu item by ID
router.get('/menus/:id', async (req, res) => {
  try {
    const menu = await Menu.findById(req.params.id);
    if (!menu) {
      return res.status(404).json({ error: 'Menu item not found' });
    }
    res.status(200).json(menu);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a menu item by ID
router.put('/menus/:id', async (req, res) => {
  try {
    const { name, image, description } = req.body;
    
    const updatedMenu = await Menu.findByIdAndUpdate(req.params.id, {
      name,
      image,
      description
    }, { new: true });

    if (!updatedMenu) {
      return res.status(404).json({ error: 'Menu item not found' });
    }

    res.status(200).json(updatedMenu);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a menu item by ID
router.delete('/menus/:id', async (req, res) => {
  try {
    const deletedMenu = await Menu.findByIdAndDelete(req.params.id);
    if (!deletedMenu) {
      return res.status(404).json({ error: 'Menu item not found' });
    }
    res.status(200).json({ message: 'Menu item deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


app.use('/api', router);
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
