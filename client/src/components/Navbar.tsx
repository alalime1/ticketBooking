import { useState } from "react";
import { useUserStore } from "../store/userStore";
import { Link, useNavigate } from "react-router-dom";
import {
  User,
  LogOut,
  ChevronDown,
  Ticket,
  LayoutDashboard,
} from "lucide-react";
import { useGetMe } from "../apis/me";

export default function Navbar() {
  const navigate = useNavigate();
  useGetMe();
  const { user, isAuthenticated, isAdmin, setUser } = useUserStore();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = () => {
    setUser(null);
    setIsDropdownOpen(false);
    localStorage.removeItem("token");
    navigate("/");
  };
  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="text-xl font-bold text-blue-900">TicketHub</div>
          <div className="flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-blue-900">
              Home
            </Link>
            <Link to="/events" className="text-gray-700 hover:text-blue-900">
              Events
            </Link>
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center space-x-2 text-gray-700 hover:text-blue-900"
                >
                  <span>{user?.name}</span>
                  <ChevronDown className="w-4 h-4" />
                </button>

                {isDropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0"
                      onClick={() => setIsDropdownOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5">
                      <Link
                        to="/my-bookings"
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <Ticket className="w-4 h-4 mr-2" />
                        <span>My Bookings</span>
                      </Link>
                      {isAdmin && (
                        <Link
                          to="/admin"
                          onClick={() => setIsDropdownOpen(false)}
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <LayoutDashboard className="w-4 h-4 mr-2" />
                          <span>Admin Dashboard</span>
                        </Link>
                      )}
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        <span>Logout</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center text-gray-700 hover:text-blue-900"
              >
                <User className="w-5 h-5 mr-2" />
                <span>Login/Signup</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
