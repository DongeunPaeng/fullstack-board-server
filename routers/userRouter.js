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
    const insertId = await userService.deleteUser(sub);
    if (insertId) {
      // FIXME dongeun: do something here, or don't make the insertId variable
    }
    res.status(200).json({ message: "Delete success!" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "something went wrong! sorry." });
  }
});

module.exports = userRouter;
