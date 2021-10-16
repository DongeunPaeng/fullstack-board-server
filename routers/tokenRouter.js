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

    // FIXME dongeun: check the expiration date before issuing accessToken

    const { sub, email } = decodedRefreshToken;

    const user = {
      sub,
      email,
    };

    const accessToken = createToken(user, "access");
    const expiresAt = jwtDecode(accessToken).exp;

    return res.status(200).json({
      user,
      accessToken,
      expiresAt,
    });
  } catch (err) {
    return res.status(500).json({ message: err });
  }
});

module.exports = tokenRouter;
