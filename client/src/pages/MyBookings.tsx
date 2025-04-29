import React from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, MapPin, Clock, QrCode, Printer } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { useGetMyBookings } from "../apis/get-my-bookings";
import { baseUrl } from "../apis";

// Mock data for bookings
const mockBookings = [
  {
    referenceNumber: "THB-X7K9M2",
    event: {
      title: "Romeo & Juliet",
      banner:
        "https://images.pexels.com/photos/109669/pexels-photo-109669.jpeg",
      date: "June 22, 2025",
      time: "7:30 PM",
      location: "National Theater",
    },
    passName: "Premium",
    numberOfTickets: 2,
    totalPrice: 120.0,
  },
  {
    referenceNumber: "THB-L4N8P6",
    event: {
      title: "Summer Beats Festival",
      banner:
        "https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg",
      date: "June 15, 2025",
      time: "8:00 PM",
      location: "City Arena",
    },
    passName: "General Admission",
    numberOfTickets: 1,
    totalPrice: 49.99,
  },
];

function MyBookings() {
  const navigate = useNavigate();

  const bookings = useGetMyBookings();

  const handlePrint = (bookingId: string) => {
    window.print();
  };

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Bookings</h1>

      <div className="space-y-6">
        {bookings.isSuccess &&
          // @ts-ignore
          (bookings.data as any).data.map((booking) => (
            <div
              key={booking.referenceNumber}
              className="bg-white rounded-xl shadow-md overflow-hidden print-only"
            >
              <div className="md:flex">
                <div className="md:w-1/3">
                  <img
                    src={((banner) =>
                      banner.startsWith("http")
                        ? banner
                        : baseUrl + "/" + banner)(booking.event.banner)}
                    alt={booking.event.title}
                    className="h-full w-full object-cover"
                  />
                </div>

                <div className="p-8 md:w-2/3">
                  <div className="flex justify-between items-start mb-4">
                    <h2 className="text-2xl font-bold text-gray-900">
                      {booking.event.title}
                    </h2>
                    <span className="text-sm font-medium text-gray-500">
                      #{booking.referenceNumber}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="flex items-center text-gray-600">
                      <Calendar className="w-5 h-5 mr-2" />
                      <span>{booking.event.date}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Clock className="w-5 h-5 mr-2" />
                      <span>{booking.event.time}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <MapPin className="w-5 h-5 mr-2" />
                      <span>{booking.event.location}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <QrCode className="w-5 h-5 mr-2" />
                      <span>{booking.passName}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t pt-4">
                    <div>
                      <p className="text-sm text-gray-500">
                        Tickets: {booking.numberOfTickets}
                      </p>
                      <p className="mt-1 text-lg font-semibold text-gray-900">
                        Total: ${booking.totalPrice.toFixed(2)}
                      </p>
                    </div>

                    <div className="flex space-x-3">
                      <QRCodeSVG
                        value={booking.referenceNumber}
                        size={80}
                        level="H"
                        className="hidden md:block"
                      />
                      <button
                        onClick={() =>
                          navigate(`/booking-confirmation/${booking._id}`)
                        }
                        className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                      >
                        <Printer className="w-4 h-4 mr-2" />
                        Print
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

        {mockBookings.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <p className="text-gray-500 text-lg">
              You haven't made any bookings yet.
            </p>
            <button
              onClick={() => navigate("/events")}
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Browse Events
            </button>
          </div>
        )}
      </div>
    </main>
  );
}

export default MyBookings;
