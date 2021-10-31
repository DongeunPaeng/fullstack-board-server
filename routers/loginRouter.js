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

    if (user["deleted"] === 1) {
      res.status(403).json({ message: "no such user!" });
      return;
    }

    const passwordValid = await verifyPassword(password, user.password);

    if (!passwordValid) {
      res.status(403).json({ message: "passwords don't match!" });
      return;
    }

    const refreshToken = createToken(user, "refresh");
    const accessToken = createToken(user, "access");
    const decodedAccessToken = jwtDecode(accessToken);
    const expiresAt = decodedAccessToken.exp;

    user["sub"] = user["id"];

    res.cookie("refresh_token", refreshToken, {
      maxAge: 168 * 60 * 60 * 1000,
      httpOnly: true,
    });
    res.status(200).json({ accessToken, user, expiresAt });
  } catch (err) {
    return res.status(500).json({ message: err });
  }
});

loginRouter.post("/find-password", async (req, res) => {
  const {
    body: { email },
  } = req;

  try {
    const queryResults = await authenticateService.getUser(email);
    const user = queryResults[0];

    if (!user) {
      res.status(406).json({ message: "no such user!" });
      return;
    }

    if (user["deleted"] === 1) {
      res.status(406).json({ message: "no such user!" });
      return;
    }

    const clues = {
      firstLetter: user["first_letter"],
      lastLetter: user["last_letter"],
      length: user["length"],
    };
    return res.status(200).json(clues);
  } catch (err) {
    return res.status(500).json({ message: err });
  }
});

module.exports = loginRouter;
