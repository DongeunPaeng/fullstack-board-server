const express = require("express");
const jwtDecode = require("jwt-decode");
const { createToken } = require("../utils/common");

const tokenRouter = express.Router();

tokenRouter.get("/", async (req, res) => {
  try {
    const cookies = req.cookies;
    const refreshToken = cookies.refresh_token;
    const decodedRefreshToken = jwtDecode(refreshToken);
    if (!decodedRefreshToken)
      return res.status(403).json({ message: "not allowed to access" });
    const accessToken = createToken(decodedRefreshToken);
    const expiresAt = jwtDecode(accessToken).exp;
    // respond with user object, access token, and expiration time.
    return res.status(200).json({
      user: {
        sub: decodedRefreshToken.sub,
        email: decodedRefreshToken.email,
      },
      accessToken,
      expiresAt,
    });
  } catch (err) {
    return res.status(500).send(err);
  }
});

module.exports = tokenRouter;
