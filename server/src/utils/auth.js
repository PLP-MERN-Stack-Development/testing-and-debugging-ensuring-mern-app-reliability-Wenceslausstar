const jwt = require("jsonwebtoken");

const generateToken = (user) => {
  return jwt.sign({ id: user._id, username: user.username }, "secret-key", {
    expiresIn: "1h",
  });
};

module.exports = { generateToken };
