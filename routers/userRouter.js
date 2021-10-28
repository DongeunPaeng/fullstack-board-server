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
      // FIXME(dongeun): what's the difference between res and return res?
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "something went wrong! sorry." });
  }
});

module.exports = userRouter;
