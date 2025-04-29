require("dotenv").config();
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const compression = require("compression");
const app = express();
const rootRouter = require("./src/routes");
const { errorHandler } = require("./src/middlewares");
const { connectDB } = require("./src/config");
const path = require("path");

const port = process.env.PORT || 3000;

connectDB();

app.use(
  helmet({
    crossOriginResourcePolicy: {
      policy: "cross-origin",
    },
  }),
);
app.set("trust proxy", 1);
app.use(
  cors({
    origin: "*",
    credentials: true,
  }),
);
app.use(compression());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: false }));

// Frontend
app.use(express.static(path.join(__dirname, "client", "dist")));

app.get("/", (req, res) => {
  res.sendFile(path.resolve(__dirname, "./", "client", "dist", "index.html"));
});

// Static Files
app.use("/public", express.static(path.join(__dirname, "public")));

// Api
app.use("/api", rootRouter);

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

module.exports = app;
