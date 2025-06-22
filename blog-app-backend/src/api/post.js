const router = require("express").Router();
const {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost
} = require('../controllers/post');
const verifyToken = require("../middleware/authMiddleware");
const upload = require('../middleware/uploadMiddleware');

// Route to create a new post (protected, with image upload)
router.post(
  "/add/post",
  verifyToken,               // Verify JWT before allowing access
  upload.single('image'),    // Handle single image upload under field name 'image'
  createPost                 // Controller to handle creating the post
);

// Route to fetch paginated list of all posts (protected)
router.get(
  "/all/posts",
  verifyToken,               // Verify JWT before allowing access
  getAllPosts                // Controller to retrieve posts
);

// Route to fetch a single post by its ID (protected)
router.get(
  "/post/:id",
  verifyToken,               // Verify JWT before allowing access
  getPostById                // Controller to retrieve a single post
);

// Route to update an existing post by its ID (protected, with optional image upload)
router.put(
  "/update-post/:id",
  verifyToken,               // Verify JWT before allowing access
  upload.single('image'),    // Handle single new image upload if provided
  updatePost                 // Controller to handle updating the post
);

// Route to delete a post by its ID (protected)
router.delete(
  "/delete-post/:id",
  verifyToken,               // Verify JWT before allowing access
  deletePost                 // Controller to handle deleting the post
);

module.exports = router;  // Export this router for mounting in the main API router
