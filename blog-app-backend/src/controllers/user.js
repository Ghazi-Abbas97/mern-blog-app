const UserModel = require("../../models/user");
const bcrypt = require("bcryptjs");
const Joi = require("joi");
const jwt = require('jsonwebtoken');
const clean = require("../../utils/clean");
const _ = require("lodash");

const {
  comparePassword,
} = require("../../utils/util");

const {
  generateTokens,
} = require("../../utils/jwt");

// ==============================
// SIGNUP USER
// ==============================
const signupUser = async (req, res) => {
  try {
    // Extract required fields from request using clean helper
    const params = clean.request(
      req,
      [],
      [],
      ["password", "emailAddress", "fullName"],
      []
    );

    // Validate input using Joi
    const schema = Joi.object({
      password: Joi.string().min(6).required(),
      emailAddress: Joi.string().email().required(),
      fullName: Joi.string().required(),
    });

    const { error } = schema.validate(params, {
      abortEarly: false,
      allowUnknown: true,
    });

    if (error) {
      return res.status(400).json({
        type: "error",
        message: error.details.map((detail) => detail.message).join(", "),
      });
    }

    // Check for existing user by email
    const existingUser = await UserModel.findOne({ emailAddress: params.emailAddress });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists",
      });
    }

    // Hash password before saving
    params.password = await bcrypt.hash(params.password, 15);

    // Create user and save to DB
    const newUser = new UserModel(params);
    await newUser.save();

    // Generate access & refresh tokens
    const { session } = await generateTokens(newUser);

    return res.status(201).json({
      success: true,
      message: "User Signup successfully!",
      user: {
        _id: newUser._id,
        fullName: newUser.fullName,
        emailAddress: newUser.emailAddress,
      },
      session,
    });

  } catch (error) {
    console.error("Signup Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// ==============================
// LOGIN USER
// ==============================
const loginUser = async (req, res) => {
  try {
    // Extract login fields
    let params = clean.request(req, [], [], ["password", "emailAddress"], []);

    // Validate input
    const schema = Joi.object({
      password: Joi.string().required(),
      emailAddress: Joi.string().email().required(),
    });

    const { error } = schema.validate(params, {
      abortEarly: false,
      allowUnknown: true,
    });

    if (error) {
      return res.status(400).json({
        type: "error",
        message: error.details.map((detail) => detail.message).join(", "),
      });
    }

    // Find user by email
    let user = await UserModel.findOne({
      emailAddress: params.emailAddress.toLowerCase(),
    });

    if (user) {
      // Compare password with hashed value
      const isEqual = await comparePassword(params.password, user.password);
      if (!isEqual) {
        return res.status(401).json({
          status: 401,
          message: "Incorrect Password",
        });
      }

      // Update terms acceptance flag
      user = await UserModel.findOneAndUpdate(
        { _id: user._id },
        {
          $set: {
            isTermsAndConditionAccepted: true,
          },
        },
        {
          new: true,
        }
      ).lean();

      // Remove password from response
      delete user.password;

      // Generate session tokens
      const { session } = await generateTokens(user);

      // Send login response
      res.json({
        status: 200,
        session,
        user,
        type: "Success",
        message: "User Login Successfully!"
      });

    } else {
      // User not found
      res
        .status(404)
        .json({
          type: "Error",
          message: "User is not registered with specified login details",
        })
        .end();
    }
  } catch (error) {
    console.error(error);
  }
};

// ==============================
// REFRESH TOKEN
// ==============================
const refreshToken = async (req, res) => {
  try {
    const authHeader = req.headers['Authorization'];

    // Check for Bearer token
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    // Extract token from header
    const refreshToken = authHeader.split(' ')[1];

    // Verify token with refresh secret
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    // Generate new access token
    const accessToken = jwt.sign(
      { id: decoded.id, email: decoded.email },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    res.status(200).json({
      accessToken
    });

  } catch (err) {
    console.error("Invalid refresh token:", err.message);
    return res.status(403).json({ message: "Invalid or expired refresh token" });
  }
};

module.exports = {
  signupUser,
  loginUser,
  refreshToken
};
