const Post = require('../../models/post');
const cloudinary = require('../../utils/cloudinary');
const fs = require('fs'); // to delete the local temp file if you want

// ==============================
// CREATE POST
// ==============================
const createPost = async (req, res) => {
  try {
    // Extract fields from request body
    const { title, content, metaDesc, category } = req.body;

    // Validate required fields
    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' });
    }

    // Prepare image URL if file was uploaded
    let imageUrl = '';
    if (req.file) {
      // 1. Upload the file from its temporary path
      const result = await cloudinary.uploader.upload(req.file.path);

      // 2. Grab the secure URL from Cloudinary
      imageUrl = result.secure_url;

      // 3. (Optional) delete the file from your server’s /uploads folder
      fs.unlinkSync(req.file.path);
    }

    // Create post object
    const postData = {
      title,
      content,
      metaDesc,
      category,
      image: imageUrl,
      createdBy: req.user.id,
    };

    // Save post to database
    const post = new Post(postData);
    await post.save();

    // Return success response
    res.status(201).json({
      type: 'success',
      message: 'Post has been created successfully',
      post,
    });
  } catch (err) {
    console.error('Error in createPost:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ==============================
// GET ALL POSTS (WITH PAGINATION)
// ==============================
const getAllPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [posts, total] = await Promise.all([
      Post.find()
        .populate('createdBy', 'fullName emailAddress')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Post.countDocuments(),
    ]);

    res.status(200).json({
      posts,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalPosts: total,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// ==============================
// GET SINGLE POST BY ID
// ==============================
const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('createdBy', 'fullName emailAddress');
    if (!post) return res.status(404).json({ message: 'Post not found' });

    res.status(200).json(post);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// ==============================
// UPDATE POST
// ==============================
const updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    // Prepare image URL if file was uploaded
    let imageUrl = '';
    if (req.file) {
      // 1. Upload the file from its temporary path
      const result = await cloudinary.uploader.upload(req.file.path);

      // 2. Grab the secure URL from Cloudinary
      imageUrl = result.secure_url;

      // 3. (Optional) delete the file from your server’s /uploads folder
      fs.unlinkSync(req.file.path);
    }

    // Optional: attach image URL to request (not used directly here)
    req.body.image = imageUrl;

    // Update post in DB
    const updatedPost = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (!updatedPost) {
      return res.status(404).json({
        type: 'Error',
        message: 'Failed to update post, please try again.',
      });
    }

    res.status(200).json({
      message: 'Post updated successfully',
      post: updatedPost,
    });
  } catch (err) {
    console.error('Update Post Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ==============================
// DELETE POST
// ==============================
const deletePost = async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
};
