const express = require("express");
const jwtDecode = require("jwt-decode");

const { verifyPassword, createToken } = require("../utils/common");

const AuthenticateService = require("../services/authenticateService");
const authenticateService = new AuthenticateService();

const loginRouter = express.Router();

loginRouter.post("/", async (req, res) => {
  try {
    const {
      body: { email, password },
    } = req;

    const queryResults = await authenticateService.getUser(email);
    const user = queryResults[0];

    if (!user) {
      res.status(403).json({ message: "no such user!" });
      return;
    }

    const passwordValid = await verifyPassword(password, user.password);

    if (!passwordValid) {
      res.status(403).json({ message: "passwords don't match!" });
      return;
    }

    const token = createToken(user);
    const decodedToken = jwtDecode(token);
    const expiresAt = decodedToken.exp;

    res.cookie("token", token, { httpOnly: true });
    res
      .status(200)
      .json({ message: "Welcome back!", token, user: user.email, expiresAt });
  } catch (err) {
    return res.status(500).send(err);
  }
});

module.exports = loginRouter;
