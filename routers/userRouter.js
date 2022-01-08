const express = require("express");

const { verifyToken } = require("../utils/common");

const UserService = require("../services/userService");
const userService = new UserService();

const userRouter = express.Router();

userRouter.post("/", verifyToken, async (req, res) => {
  const {
    user: { sub },
  } = req;

  try {
    const affectedRows = await userService.deleteUser(sub);
    if (affectedRows) {
      res.clearCookie("refresh_token");
      res.status(200).json({ message: "Delete success!" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "something went wrong! sorry." });
    // FIXME(dongteun): check if this works. I removed 'return'.
  }
});

module.exports = userRouter;
