const asyncHandler = require("express-async-handler");
const { Booking, Event, User } = require("../models");
const { HttpException } = require("../utils");

// Controller to create a new booking
const createBooking = asyncHandler(async (req, res) => {
  const { eventId, numberOfTickets, passName, totalPrice } = req.body;
  const userId = req.user.id; // From the authenticate middleware

  // Check if the event exists
  const event = await Event.findById(eventId);
  if (!event) {
    throw new HttpException(404, "Event not found");
  }

  const booking = await Booking.create({
    user: userId,
    event: eventId,
    numberOfTickets,
    passName,
    totalPrice,
  });

  res
    .status(201)
    .json({ message: "Booking created successfully", data: booking });
});

// Controller to get all bookings of an authenticated user
const getUserBookings = asyncHandler(async (req, res) => {
  const userId = req.user.id; // From the authenticate middleware
  const bookings = await Booking.find({ user: userId }).populate(
    "event",
    "title banner date time location",
  );
  res
    .status(200)
    .json({ message: "Bookings retrieved successfully", data: bookings });
});

// Controller to get a specific booking by ID
const getAllBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find()
    .populate("event", "title")
    .populate("user", "name");
  res
    .status(200)
    .json({ message: "Booking retrieved successfully", data: bookings });
});
// Controller to get a specific booking by ID
const getBooking = asyncHandler(async (req, res) => {
  const bookingId = req.params.id;
  const booking = await Booking.findById(bookingId).populate(
    "event",
    "title banner date time location",
  );
  if (!booking) {
    throw new HttpException(404, "Booking not found");
  }
  res
    .status(200)
    .json({ message: "Booking retrieved successfully", data: booking });
});

// Controller for ADMIN to get all bookings of a specific event
const getAllBookingsOfEvent = asyncHandler(async (req, res) => {
  const eventId = req.params.eventId;
  const event = await Event.findById(eventId);
  if (!event) {
    throw new HttpException(404, "Event not found");
  }
  const bookings = await Booking.find({ event: eventId }).populate(
    "user",
    "name email",
  );
  res.status(200).json(bookings);
});

// Controller for ADMIN to get all bookings of a specific user
const getAllBookingsOfUser = asyncHandler(async (req, res) => {
  const userId = req.params.userId;
  const user = await User.findById(userId); // Assuming you have the User model imported
  if (!user) {
    throw new HttpException(404, "User not found");
  }
  const bookings = await Booking.find({ user: userId }).populate(
    "event",
    "title",
  );
  res
    .status(200)
    .json({ message: "Bookings retrieved successfully", data: bookings });
});

// Controller for ADMIN to get all bookings of a specific user for a specific event
const getUsersBookingsOfEvent = asyncHandler(async (req, res) => {
  const { userId, eventId } = req.params;
  const user = await User.findById(userId); // Assuming you have the User model imported
  const event = await Event.findById(eventId);
  if (!user || !event) {
    throw new HttpException(404, "User or Event not found");
  }
  const bookings = await Booking.find({ user: userId, event: eventId });
  res
    .status(200)
    .json({ message: "Bookings retrieved successfully", data: bookings });
});

module.exports = {
  createBooking,
  getUserBookings,
  getBooking,
  getAllBookings,
  getAllBookingsOfEvent,
  getAllBookingsOfUser,
  getUsersBookingsOfEvent,
};
