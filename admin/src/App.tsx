import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { MovieList } from './pages/MovieList';
import { MovieDetail } from './pages/MovieDetail';
import { AddMovie } from './pages/AddMovie';
import { EditMovie } from './pages/EditMovie';
import { Gallery } from './pages/Gallery';
import { BranchList } from './pages/BranchList';
import { AddBranch } from './pages/AddBranch';
import { EditBranch } from './pages/EditBranch';
import { NewsList } from './pages/NewsList';
import { NewsDetail } from './pages/NewsDetail';
import { AddNews } from './pages/AddNews';
import { EditNews } from './pages/EditNews';
import { MenuList } from './pages/MenuList';
import { MenuDetail } from './pages/MenuDetail';
import { AddMenuItem } from './pages/AddMenuItem';
import { EditMenuItem } from './pages/EditMenuItem';
import { BookingList } from './pages/BookingList';
import { AddBooking } from './pages/AddBooking';
import { EditBooking } from './pages/EditBooking';
import { Navbar } from './components/Navbar';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="pt-4">
          <Routes>
            <Route path="/" element={<MovieList />} />
            <Route path="/movie/:id" element={<MovieDetail />} />
            <Route path="/add" element={<AddMovie />} />
            <Route path="/edit/:id" element={<EditMovie />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/branches" element={<BranchList />} />
            <Route path="/branches/add" element={<AddBranch />} />
            <Route path="/branches/edit/:id" element={<EditBranch />} />
            <Route path="/news" element={<NewsList />} />
            <Route path="/news/:id" element={<NewsDetail />} />
            <Route path="/news/add" element={<AddNews />} />
            <Route path="/news/edit/:id" element={<EditNews />} />
            <Route path="/menu" element={<MenuList />} />
            <Route path="/menu/:id" element={<MenuDetail />} />
            <Route path="/menu/add" element={<AddMenuItem />} />
            <Route path="/menu/edit/:id" element={<EditMenuItem />} />
            <Route path="/bookings" element={<BookingList />} />
            <Route path="/bookings/add" element={<AddBooking />} />
            <Route path="/bookings/edit/:id" element={<EditBooking />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;