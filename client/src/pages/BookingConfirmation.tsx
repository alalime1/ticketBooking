import React, { useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import { CheckCircle, Printer } from "lucide-react";
import { useParams } from "react-router-dom";
import { useGetBooking } from "../apis/get-booking";

interface BookingDetails {
  referenceNumber: string;
  event: {
    title: string;
    banner: string;
    date: string;
    time: string;
    location: string;
  };
  passName: string;
  numberOfTickets: number;
  totalPrice: number;
}

function BookingConfirmation() {
  const { id } = useParams();

  const booking = useGetBooking(useMemo(() => id, [id]));
  const location = useLocation();
  const navigate = useNavigate();
  const mockBookingDetails: BookingDetails = {
    referenceNumber: `THB-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
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
  };
  const bookingDetails =
    (location.state as BookingDetails) || mockBookingDetails;

  const handlePrint = () => {
    window.print();
  };

  if (booking.isError) {
    return <div className="text-center py-12">Booking not found</div>;
  }

  if (booking.isLoading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-8">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Booking Confirmed!
        </h1>
        <p className="text-xl text-gray-600 mb-2">
          Your booking reference:{" "}
          <span className="font-semibold">
            {(booking.data as any).data.referenceNumber}
          </span>
        </p>
        <p className="text-gray-600">
          A confirmation has been sent to your email address.
        </p>
      </div>

      <div className="bg-white rounded-3xl shadow-lg p-12 mb-8 print-only">
        <div className="space-y-6">
          <h2 className="text-4xl font-bold text-gray-900">Romeo & Juliet</h2>

          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="space-y-4">
                <p className="text-xl text-gray-600">
                  <span className="text-gray-500">Date:</span> June 22, 2025
                </p>
                <p className="text-xl text-gray-600">
                  <span className="text-gray-500">Time:</span> 7:30 PM
                </p>
                <p className="text-xl text-gray-600">
                  <span className="text-gray-500">Venue:</span> National Theater
                </p>
                <p className="text-xl text-gray-600">
                  <span className="text-gray-500">Seats:</span>{" "}
                  {(booking.data as any).data.passName}, Row D (Seats 12-13)
                </p>
                <p className="text-xl text-gray-600">
                  <span className="text-gray-500">Total:</span> $
                  {(booking.data as any).data.totalPrice.toFixed(2)}
                </p>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center">
              <QRCodeSVG
                value={(booking.data as any).data.referenceNumber}
                size={180}
                level="H"
                className="mb-4"
              />
              <p className="text-base text-gray-500 text-center">
                Scan this QR code at the
                <br />
                venue entrance
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center space-x-4">
        <button
          onClick={handlePrint}
          className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <Printer className="w-5 h-5 mr-2" />
          Print Ticket
        </button>
        <button
          onClick={() => navigate("/my-bookings")}
          className="px-6 py-3 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
        >
          My Bookings
        </button>
      </div>
    </main>
  );
}

export default BookingConfirmation;
