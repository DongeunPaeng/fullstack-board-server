const express = require("express");

const { verifyToken } = require("../utils/common");

const UserService = require("../services/userService");
const userService = new UserService();

const deleteRouter = express.Router();

deleteRouter.post("/", verifyToken, async (req, res) => {
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
  }
});

module.exports = deleteRouter;
