const express = require("express");
const {
  createBooking,
  getUserBookings,
  getBooking,
  getAllBookings,
  getAllBookingsOfEvent,
  getUsersBookingsOfEvent,
  getAllBookingsOfUser,
} = require("../controllers/booking-controller");
const { authenticate } = require("../middlewares");

const bookingRouter = express.Router();
bookingRouter.post("/", authenticate(), createBooking);

// Get all bookings of an authenticated user (from req.user.id)
bookingRouter.get("/my-bookings", authenticate(), getUserBookings);

bookingRouter.get("/:id", authenticate(), getBooking);

// Get all bookings of an event
bookingRouter.get("/", authenticate("ADMIN"), getAllBookings);
// Get all bookings of an event
bookingRouter.get(
  "/event/:eventId",
  authenticate("ADMIN"),
  getAllBookingsOfEvent,
);
// Get all bookings of a user
bookingRouter.get("/user/:userId", authenticate("ADMIN"), getAllBookingsOfUser);

// Get all bookings of a user for an event
bookingRouter.get(
  "/user/:userId/event/:eventId",
  authenticate("ADMIN"),
  getUsersBookingsOfEvent,
);

module.exports = bookingRouter;
