const express = require("express");
const { authenticate } = require("../middlewares");
const {
  registerUser,
  loginUser,
  getAllUsers,
  getUser,
  adminStats,
} = require("../controllers/user-controller");

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.get("/me", authenticate(), getUser);
userRouter.get("/all", authenticate("ADMIN"), getAllUsers);
userRouter.get("/admin-stats", authenticate("ADMIN"), adminStats);

module.exports = userRouter;
