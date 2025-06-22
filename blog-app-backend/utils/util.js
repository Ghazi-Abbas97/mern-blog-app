const bcrypt = require("bcryptjs");
const util = require("util");

// Utility function to compare a plain password with a hashed password
exports.comparePassword = (password, hashedPassword) => {
  // bcrypt.compare returns a promise which resolves to true or false
  return bcrypt.compare(password, hashedPassword).then((isEqual) => {
    return isEqual;
  });
};
