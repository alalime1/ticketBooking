const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    banner: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: ["concert", "theater", "sports", "cinema"],
    },
    location: {
      type: String,
      required: true,
    },
    duration: {
      type: String,
      required: true, // e.g. 3 Hours
    },
    eventPasses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "event_passes",
      },
    ],
  },
  {
    timestamps: true,
  },
);

const Event = mongoose.model("events", eventSchema);

module.exports = Event;
