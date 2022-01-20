const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const jwtDecode = require("jwt-decode");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  const decodedToken = token ? jwtDecode(token) : null;

  if (!token) {
    return res.status(401).json({ message: "Not authorized!" });
  }
  if (decodedToken?.exp * 1000 < Date.now()) {
    return res.status(401).json({ message: "Not authorized!" });
  }
  jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
    if (err) return res.status(403).json({ message: "Not authorized!" });
    req.user = user;
    next();
  });
};

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
      sub: user.id,
      email: user.email,
      iss: "dongeunpaeng",
      aud: "dongeunpaeng",
    },
    process.env.JWT_SECRET,
    { algorithm: "HS256", expiresIn: type === "refresh" ? "168h" : "1h" }
  );

  return token;
};

module.exports = { verifyToken, verifyPassword, hashPassword, createToken };
