const mongoose = require("mongoose");
const { randomHex } = require("../utils");

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "events",
      required: true,
    },
    numberOfTickets: {
      type: Number,
      required: true,
      min: 1,
    },
    passName: {
      type: String,
      required: true, // The name of the pass booked (e.g., VIP, Standard)
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled"],
      default: "confirmed", 
    },
    referenceNumber: {
      type: String,
      unique: true, // Ensure each reference number is unique
    },
  },
  {
    timestamps: true,
  },
);

// Middleware to auto-generate the reference number before saving a booking
bookingSchema.pre("save", async function (next) {
  if (!this.referenceNumber) {
    const randomDigits = randomHex(8); // Generate 8 random hex characters
    this.referenceNumber = `THB-${randomDigits.toUpperCase()}`;

  
    let existingBooking = await this.constructor.findOne({
      referenceNumber: this.referenceNumber,
    });
    while (existingBooking) {
      const newRandomDigits = randomHex(8);
      this.referenceNumber = `THB-${newRandomDigits.toUpperCase()}`;
      existingBooking = await this.constructor.findOne({
        referenceNumber: this.referenceNumber,
      });
    }
  }
  next();
});

const Booking = mongoose.model("bookings", bookingSchema);

module.exports = Booking;
