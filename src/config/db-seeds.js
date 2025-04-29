const { User, Event, EventPass } = require("../models");
const events = require("../seeds/events.json");

async function adminSeeding() {
  const admin = {
    email: process.env.ADMIN_MAIL,
    password: process.env.ADMIN_PASSWORD,
    name: "Admin",
    role: "ADMIN",
  };

  if (!admin.email || !admin.password) {
    return;
  }

  const user = await User.findOne({ email: admin.email });
  if (!user) {
    await User.create(admin);

    console.log("Admin Seeded");
  }
}

async function eventsSeeding() {
  for (let event of events) {
    const findEvent = await Event.findOne({ title: event.title });
    if (findEvent) continue;
    const _event = await Event.create({
      title: event.title,
      description: event.description,
      banner: event.banner,
      date: event.date,
      time: event.time,
      category: event.category,
      location: event.location,
      duration: event.duration,
      eventPasses: [],
    });

    for (let eventPass of event.eventPasses) {
      const pass = await EventPass.create({
        eventId: _event._id,
        name: eventPass.name,
        price: eventPass.price,
      });

      _event.eventPasses.push(pass._id);
    }

    await _event.save();
  }

  console.log("Events Seeded");
}

module.exports = {
  adminSeeding,
  eventsSeeding,
};
