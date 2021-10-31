const express = require("express");
const jwtDecode = require("jwt-decode");
const { createToken } = require("../utils/common");

const tokenRouter = express.Router();

tokenRouter.get("/", async (req, res) => {
  try {
    const cookies = req.cookies;
    const token = cookies.refresh_token;
    const decodedRefreshToken = token ? jwtDecode(token) : null;

    if (!token) {
      return res.status(401).json({ message: "Not authorized!" });
    }
    if (decodedRefreshToken?.exp * 1000 < Date.now()) {
      return res.status(401).json({ message: "Not authorized!" });
    }

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
