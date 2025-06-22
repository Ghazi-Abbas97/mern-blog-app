const jwt = require('jsonwebtoken');
const moment = require("moment");
const SessionModel = require("../models/session");

// function to get session and store session 
exports.generateTokens = async (user) => {
  // Create access token (short-lived)
  const accessToken = jwt.sign(
    { id: user._id, emailAddress: user.emailAddress },
    process.env.JWT_SECRET,
    { expiresIn: '1d' } // token expires in 30 minutes
  );

  // Create refresh token (longer-lived)
  const refreshToken = jwt.sign(
    { id: user._id, emailAddress: user.emailAddress },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: '7d' } // token expires in 7 days
  );

  // Set token expiry date using SESSION_EXPIRE_DAYS from environment
  const tokenExpiry = moment().add(process.env.SESSION_EXPIRE_DAYS, "days");

  // Store session info in database
  const session = await SessionModel.create({
    accessToken,
    refreshToken,
    type: "user",
    userId: user._id,
    expiryDate: new Date(tokenExpiry),
  });

  // Return session object containing tokens and metadata
  return { session };
};
