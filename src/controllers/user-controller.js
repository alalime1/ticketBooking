const asyncHandler = require("express-async-handler");
const { User, Event, Booking } = require("../models");
const bcrypt = require("bcrypt");
const { jwt, HttpException } = require("../utils");

// Controller for registering a new user
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // Check if the user with this email already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new HttpException(400, "Email already exists");
  }

  // Create a new user
  const newUser = new User({
    name,
    email,
    password,
  });

  // Save the user to the database
  const savedUser = await newUser.save();

  // Generate a JWT token for the newly registered user
  const token = jwt.generateToken(savedUser._id, savedUser.role);

  res
    .status(201)
    .json({ message: "User registered successfully", data: { token } });
});

// Controller for logging in an existing user
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Find the user by email
  const user = await User.findOne({ email });
  if (!user) {
    throw new HttpException(401, "Invalid credentials");
  }

  // Compare the provided password with the stored hashed password
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new HttpException(401, "Invalid credentials");
  }

  // Generate a JWT token
  const token = jwt.generateToken(user._id, user.role);

  res.status(200).json({ message: "Login successful", data: { token } });
});

const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");

  if (!user) {
    throw new HttpException(404, "User not found");
  }

  res.status(200).json({
    message: "User retrieved successfully",
    data: {
      _id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
  });
});

const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password");

  res.status(200).json({
    message: "Users retrieved successfully",
    data: users,
  });
});

const adminStats = asyncHandler(async (req, res) => {
  const totalEvents = await Event.countDocuments();
  const bookings = await Booking.find({}).select("numberOfTickets totalPrice");
  let totalTickets = 0;
  let totalRevenue = 0;
  const totalUsers = await User.countDocuments();

  bookings.forEach((booking) => {
    totalTickets += booking.numberOfTickets;
    totalRevenue += booking.totalPrice;
  });

  res.status(200).json({
    message: "Admin Stats",
    data: { totalEvents, totalTickets, totalRevenue, totalUsers },
  });
});

module.exports = {
  registerUser,
  loginUser,
  getUser,
  getAllUsers,
  adminStats,
};
