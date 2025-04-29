const express = require("express");
const userRouter = require("./user-routes");
const eventRouter = require("./event-routes");
const bookingRouter = require("./booking-routes");

const rootRouter = express.Router();

rootRouter.use("/users", userRouter);
rootRouter.use("/events", eventRouter);
rootRouter.use("/bookings", bookingRouter);

module.exports = rootRouter;
