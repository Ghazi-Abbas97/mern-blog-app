const router = require("express").Router();
const { signupUser, loginUser, refreshToken } = require("../controllers/user");

// Route for user signup
router.post("/auth/signup", signupUser);

// Route for user login
router.post("/auth/login", loginUser);

// Route to refresh JWT using a valid refresh token
router.post("/auth/refresh-token", refreshToken);

module.exports = router;  // Export the router for mounting in the main API router
