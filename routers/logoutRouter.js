const express = require("express");
const logoutRouter = express.Router();

logoutRouter.get("/", async (req, res) => {
  try {
    res.clearCookie("refresh_token");
    res.status(200).json({ message: "Successfully logged out!" });
  } catch (err) {
    return res.status(500).send(err);
  }
});

module.exports = logoutRouter;
