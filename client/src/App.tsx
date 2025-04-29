import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Events from "./pages/Events";
import EventDetails from "./pages/EventDetails";
import MyBookings from "./pages/MyBookings";
import BookingSummary from "./pages/BookingSummary";
import BookingConfirmation from "./pages/BookingConfirmation";
import Admin from "./pages/Admin";
import CreateEvent from "./pages/CreateEvent";
import AdminEvents from "./pages/AdminEvents";
import AdminUsers from "./pages/AdminUsers";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminLayout from "./components/AdminLayout";
import Navbar from "./components/Navbar";
import QueryProvider from "./components/QueryProvider";
import { Toaster } from "react-hot-toast";

export const events = [
  {
    id: 1,
    title: "Summer Beats Festival",
    date: "June 15, 2025 | 8:00 PM",
    venue: "City Arena",
    price: 49.99,
    image: "https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg",
  },
  {
    id: 2,
    title: "Romeo & Juliet",
    date: "June 20-25, 2025 | 7:30 PM",
    venue: "National Theater",
    price: 29.99,
    image: "https://images.pexels.com/photos/109669/pexels-photo-109669.jpeg",
  },
  {
    id: 3,
    title: "Championship Final",
    date: "July 10, 2025 | 3:00 PM",
    venue: "Olympic Stadium",
    price: 79.99,
    image:
      "https://images.pexels.com/photos/46798/the-ball-stadion-football-the-pitch-46798.jpeg",
  },
  {
    id: 4,
    title: "Blockbuster Premiere",
    date: "July 15, 2025 | 6:00 PM",
    venue: "Star Cineplex",
    price: 19.99,
    image: "https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg",
  },
];

export const categories = [
  {
    id: "concert",
    title: "Concerts",
    image: "https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg",
  },
  {
    id: "theater",
    title: "Theater",
    image: "https://images.pexels.com/photos/109669/pexels-photo-109669.jpeg",
  },
  {
    id: "sports",
    title: "Sports",
    image:
      "https://images.pexels.com/photos/46798/the-ball-stadion-football-the-pitch-46798.jpeg",
  },
  {
    id: "cinema",
    title: "Cinema",
    image: "https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg",
  },
];

function App() {
  return (
    <Router>
      <QueryProvider>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          {/* Navbar */}
          <Navbar />

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/events" element={<Events />} />
            <Route path="/events/:id" element={<EventDetails />} />
            <Route path="/booking-summary" element={<BookingSummary />} />
            <Route
              path="/booking-confirmation/:id"
              element={
                <ProtectedRoute>
                  <BookingConfirmation />
                </ProtectedRoute>
              }
            />
            <Route path="/login" element={<Login />} />
            <Route
              path="/my-bookings"
              element={
                <ProtectedRoute>
                  <MyBookings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute requireAdmin>
                  <AdminLayout>
                    <Admin />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/events"
              element={
                <ProtectedRoute requireAdmin>
                  <AdminLayout>
                    <AdminEvents />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/events/create"
              element={
                <ProtectedRoute requireAdmin>
                  <AdminLayout>
                    <CreateEvent />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/events/:id/edit"
              element={
                <ProtectedRoute requireAdmin>
                  <AdminLayout>
                    <CreateEvent editMode />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <ProtectedRoute requireAdmin>
                  <AdminLayout>
                    <AdminUsers />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />
          </Routes>

          <footer className="bg-gray-100 py-8 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-600">
              <p>© 2025 TicketHub. All rights reserved.</p>
            </div>
          </footer>
        </div>
        <Toaster />
      </QueryProvider>
    </Router>
  );
}

export default App;
