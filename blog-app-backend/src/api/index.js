const express = require("express");

const userApi = require("./user");
const postApi = require("./post");

// Create a router for API endpoints
const apiRouter = express.Router();

// Mount user-related routes (signup, login, refreshToken)
apiRouter.use(userApi);

// Mount post-related routes (CRUD for blog posts)
apiRouter.use(postApi);

// Export the configured API router
module.exports = apiRouter;
