const asyncHandler = require("express-async-handler");
const { Event, EventPass } = require("../models");
const path = require("path");
const { HttpException } = require("../utils"); 
// Controller to create a new event and its passes (requires admin authentication)
const createEvent = asyncHandler(async (req, res) => {
  let {
    title,
    description,
    date,
    time,
    category,
    location,
    duration,
    eventPasses,
  } = req.body;

  if (!req.file) {
    throw new HttpException(400, "Please upload a banner image");
  }

  const event = await Event.create({
    title,
    description,
    banner: req.file.path,
    date,
    time,
    category,
    location,
    duration,

    eventPasses: [], // Initialize as an empty array
  });

  // Saving Event Passes
  eventPasses = JSON.parse(eventPasses).map((e) => ({
    name: e.name,
    price: Number(e.price),
    eventId: event._id,
  }));
  eventPasses.sort((a, b) => a.price - b.price);

  for (const pass of eventPasses) {
    const _pass = await EventPass.create(pass);
    event.eventPasses.push(_pass._id);
  }

  await event.save();

  res.status(201).json({ message: "Event created successfully" });
});

const getEvents = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1; // Default to page 1 if not provided
  const limit = parseInt(req.query.limit) || 25;
  const skip = (page - 1) * limit;

  const events = await Event.find()
    .populate("eventPasses")
    .skip(skip)
    .limit(limit);
  const total = await Event.countDocuments();
  const totalPages = Math.ceil(total / limit);

  res.status(200).json({
    message: "Events retrieved successfully",
    data: {
      events,
      page,
      totalPages,
      total,
    },
  });
});

// Controller to get a specific event by ID
const getEventById = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id).populate("eventPasses");

  if (!event) {
    throw new HttpException(404, "Event not found");
  }

  res
    .status(200)
    .json({ message: "Event retrieved successfully", data: event });
});

// Controller to update an existing event by ID (requires admin authentication)
const updateEvent = asyncHandler(async (req, res) => {
  let {
    title,
    description,
    date,
    time,
    category,
    location,
    duration,
    eventPasses,
  } = req.body;
  const eventId = req.params.id;

  const event = await Event.findById(eventId);
  if (!event) {
    throw new HttpException(404, "Event not found");
  }

  // Update basic event details
  event.title = title || event.title;
  event.description = description || event.description;
  event.date = date || event.date;
  event.time = time || event.time;
  event.category = category || event.category;
  event.location = location || event.location;
  event.duration = duration || event.duration; // Updated field

  // Handle banner update
  if (req.file) {
    event.banner = req.file.path;
  }

  if (eventPasses) {
    event.eventPasses = [];

    // Saving Event Passes
    eventPasses = JSON.parse(eventPasses).map((e) => ({
      _id: e._id,
      name: e.name,
      price: Number(e.price),
    }));
    eventPasses.sort((a, b) => a.price - b.price);

    for (const pass of eventPasses) {
      if (pass._id) {
        await EventPass.findByIdAndUpdate(pass._id, {
          name: pass.name,
          price: pass.price,
        });
        event.eventPasses.push(pass._id);
        continue;
      }
      const _pass = await EventPass.create({
        name: pass.name,
        price: pass.price,
        eventId: event._id,
      });
      event.eventPasses.push(_pass._id);
    }
  }

  await event.save();

  res.status(200).json({ message: "Event updated successfully" });
});

// Controller to delete an event by ID (requires admin authentication)
const deleteEvent = asyncHandler(async (req, res) => {
  const event = await Event.findByIdAndDelete(req.params.id);

  if (!event) {
    throw new HttpException(404, "Event not found");
  }

  
  await EventPass.deleteMany({ eventId: event._id });

  res.status(200).json({ message: "Event deleted successfully" });
});

// Controller to create a new event pass for an existing event (requires admin authentication)
const createEventPass = asyncHandler(async (req, res) => {
  const { name, price } = req.body;
  const { eventId } = req.params;

  const event = await Event.findById(eventId);
  if (!event) {
    throw new HttpException(404, "Event not found");
  }

  const newPass = await EventPass.create({ eventId, name, price });

  event.eventPasses.push(newPass._id);
  await event.save();

  // Populate the eventPasses before sending the response
  const populatedEvent = await Event.findById(eventId).populate("eventPasses");

  res.status(201).json({
    message: "Event pass created successfully",
    event: populatedEvent,
    eventPass: newPass,
  });
});

// Controller to update an existing event pass (requires admin authentication)
const updateEventPass = asyncHandler(async (req, res) => {
  const { name, price } = req.body;
  const { passId } = req.params;

  const existingPass = await EventPass.findById(passId);
  if (!existingPass) {
    throw new HttpException(404, "Event pass not found");
  }

  existingPass.name = name || existingPass.name;
  existingPass.price = price || existingPass.price;
  const updatedPass = await existingPass.save();

  res.status(200).json({
    message: "Event pass updated successfully",
    eventPass: updatedPass,
  });
});

// Controller to delete an existing event pass (requires admin authentication)
const deleteEventPass = asyncHandler(async (req, res) => {
  const { passId } = req.params;

  const existingPass = await EventPass.findById(passId);
  if (!existingPass) {
    throw new HttpException(404, "Event pass not found");
  }

  const eventId = existingPass.eventId;

  await EventPass.findByIdAndDelete(passId);

  const event = await Event.findByIdAndUpdate(
    eventId,
    { $pull: { eventPasses: passId } },
    { new: true }, // To get the updated document
  ).populate("eventPasses");

  res
    .status(200)
    .json({ message: "Event pass deleted successfully", event: event });
});

module.exports = {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  createEventPass,
  updateEventPass,
  deleteEventPass,
};
