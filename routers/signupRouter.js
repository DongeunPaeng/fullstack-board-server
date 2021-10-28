const express = require("express");
const jwtDecode = require("jwt-decode");

const { hashPassword, createToken } = require("../utils/common");

const AuthenticateService = require("../services/authenticateService");
const authenticateService = new AuthenticateService();

const signupRouter = express.Router();

signupRouter.post("/", async (req, res) => {
  try {
    const {
      body: { email, password },
    } = req;

    const clues = [password[0], password.slice(-1), password.length];
    const hashedPassword = await hashPassword(password);

    const queryResults = await authenticateService.getUser(email);
    const user = queryResults[0];

    if (user) {
      res.status(409).json({ message: "this email has been used before!" });
      return;
    }

    const insertId = await authenticateService.saveUser(email, hashedPassword, clues);
    if (insertId) {
      const newUser = {
        sub: insertId,
        email,
      };

      const refreshToken = createToken(newUser, "refresh");

      const accessToken = createToken(newUser, "access");
      const decodedAccessToken = jwtDecode(accessToken);
      const expiresAt = decodedAccessToken.exp;

      res.cookie("refresh_token", refreshToken, {
        maxAge: 168 * 60 * 60 * 1000,
        httpOnly: true,
      });
      res.status(200).json({
        user: newUser,
        accessToken,
        expiresAt,
      });
    }
  } catch (err) {
    return res.status(500).json({ message: err });
  }
});

module.exports = signupRouter;
