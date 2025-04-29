import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useGetEvent } from "../apis/get-event";
import { baseUrl } from "../apis";
import { useCreateBooking } from "../apis/create-booking";

interface BookingDetails {
  eventId: string;
  numberOfTickets: number;
  passName: string;
  totalPrice: number;
}

function BookingSummary() {
  const location = useLocation();
  const navigate = useNavigate();
  const createBooking = useCreateBooking();
  const bookingDetails = location.state as BookingDetails;
  const getEvent = useGetEvent(bookingDetails.eventId as string);
  const serviceFee = 5.0;

  const [paymentDetails, setPaymentDetails] = useState({
    nameOnCard: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPaymentDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle payment processing here
    createBooking.mutate({
      ...bookingDetails,
      totalPrice: bookingDetails.totalPrice + serviceFee,
    });
  };

  if (getEvent.isLoading) {
    return <div className="text-center py-12">Loading event details...</div>;
  }

  if (getEvent.error) {
    return <div className="text-center py-12">Error loading event details</div>;
  }

  if (!getEvent.data || !bookingDetails) {
    return (
      <div className="text-center py-12">Booking information not found</div>
    );
  }

  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">
        Your Booking Summary
      </h1>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex gap-6">
          <img
            src={((banner) =>
              banner.startsWith("http") ? banner : baseUrl + "/" + banner)(
              (getEvent.data as any).data?.banner,
            )}
            alt={(getEvent.data as any).data?.title}
            className="w-48 h-32 object-cover rounded-md"
          />
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              {(getEvent.data as any).data?.title}
            </h2>
            <p className="text-gray-600 mb-1">
              Date: {(getEvent.data as any).data?.date}
            </p>
            <p className="text-gray-600 mb-1">
              Time: {(getEvent.data as any).data?.time}
            </p>
            <p className="text-gray-600 mb-1">
              Location: {(getEvent.data as any).data?.location}
            </p>
            <p className="text-gray-600">
              Tickets: {bookingDetails.numberOfTickets} x{" "}
              {bookingDetails.passName}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Order Summary
        </h2>
        <div className="space-y-2 mb-4">
          <div className="flex justify-between">
            <span>
              {bookingDetails.numberOfTickets} x {bookingDetails.passName}{" "}
              {bookingDetails.passName}
            </span>
            <span>${bookingDetails.totalPrice}</span>
          </div>
          <div className="flex justify-between">
            <span>Service Fee</span>
            <span>${serviceFee.toFixed(2)}</span>
          </div>
          <div className="border-t pt-2 mt-2">
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span>
                ${(bookingDetails.totalPrice + serviceFee).toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Payment Information
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name on Card
            </label>
            <input
              type="text"
              name="nameOnCard"
              value={paymentDetails.nameOnCard}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Card Number
            </label>
            <input
              type="text"
              name="cardNumber"
              value={paymentDetails.cardNumber}
              onChange={handleInputChange}
              placeholder="1234 5678 9012 3456"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Expiry Date
              </label>
              <input
                type="text"
                name="expiryDate"
                value={paymentDetails.expiryDate}
                onChange={handleInputChange}
                placeholder="MM/YY"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                CVV
              </label>
              <input
                type="text"
                name="cvv"
                value={paymentDetails.cvv}
                onChange={handleInputChange}
                placeholder="123"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white px-6 py-3 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors mt-6"
          >
            Confirm Booking
          </button>
        </form>
      </div>
    </main>
  );
}

export default BookingSummary;
