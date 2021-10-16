const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const jwtDecode = require("jwt-decode");

const verifyPassword = (passwordAttempt, hashedPassword) => {
  return bcrypt.compare(passwordAttempt, hashedPassword);
};

const hashPassword = async (password) => {
  try {
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  } catch (err) {
    throw new Error(err);
  }
};

const createToken = (user, type) => {
  const token = jwt.sign(
    {
      sub: user.sub ?? user.id,
      email: user.email,
      iss: "dongeunpaeng",
      aud: "dongeunpaeng",
    },
    process.env.JWT_SECRET,
    { algorithm: "HS256", expiresIn: type === "refresh" ? "168h" : "1h" }
  );

  return token;
};

module.exports = { verifyPassword, hashPassword, createToken };
