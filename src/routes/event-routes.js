const express = require("express");
const multerConfig = require("../config/multer-config");
const { authenticate } = require("../middlewares");
const multer = require("multer");
const {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  createEventPass,
  updateEventPass,
  deleteEventPass,
} = require("../controllers/event-controller");

const upload = multer(multerConfig);
const eventRouter = express.Router();

eventRouter.post(
  "/",
  authenticate("ADMIN"),
  upload.single("banner"),
  createEvent,
);
eventRouter.get("/", getEvents);
eventRouter.get("/:id", getEventById);
eventRouter.put(
  "/:id",
  authenticate("ADMIN"),
  upload.single("banner"),
  updateEvent,
);
eventRouter.delete("/:id", authenticate("ADMIN"), deleteEvent);

// Routes for event passes
eventRouter.post("/:eventId/passes", authenticate("ADMIN"), createEventPass);
eventRouter.put(
  "/event-passes/:passId",
  authenticate("ADMIN"),
  updateEventPass,
);
eventRouter.delete(
  "/event-passes/:passId",
  authenticate("ADMIN"),
  deleteEventPass,
);

module.exports = eventRouter;
