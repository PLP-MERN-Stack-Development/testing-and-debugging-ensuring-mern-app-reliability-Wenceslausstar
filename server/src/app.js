const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const logger = require("./utils/logger");
const {
  requestLogger,
  errorHandler,
  notFoundHandler,
} = require("./middleware/errorHandler");
const app = express();
const Post = require("./models/Post");
const User = require("./models/User");

// Request logging middleware
app.use(requestLogger);

app.use(express.json());

// Middleware to authenticate JWT tokens
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Access token required" });
  }

  jwt.verify(token, "secret-key", (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token" });
    }
    req.user = user;
    next();
  });
};

app.get("/api/hello", (req, res) => {
  res.status(200).json({ message: "Hello, world!" });
});

app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;

  if (username === "testuser" && password === "password") {
    res.status(200).json({ message: "Login successful" });
  } else {
    res.status(401).json({ message: "Invalid credentials" });
  }
});

app.post("/api/contact", (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (!email.includes("@")) {
    return res.status(400).json({ message: "Invalid email" });
  }

  res.status(200).json({ message: "Form submitted successfully" });
});

// POST /api/posts - Create a new post
app.post("/api/posts", authenticateToken, async (req, res) => {
  try {
    const { title, content, category } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: "Title and content are required" });
    }

    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const post = new Post({
      title,
      content,
      author: req.user.id,
      category: category || null,
      slug,
    });

    await post.save();
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// GET /api/posts - Get all posts with optional filtering and pagination
app.get("/api/posts", async (req, res) => {
  try {
    const { category, page = 1, limit = 10 } = req.query;
    const query = {};

    if (category) {
      query.category = category;
    }

    const posts = await Post.find(query)
      .populate("author", "username")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// GET /api/posts/:id - Get a single post by ID
app.get("/api/posts/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate(
      "author",
      "username"
    );

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    res.json(post);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// PUT /api/posts/:id - Update a post
app.put("/api/posts/:id", authenticateToken, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    if (post.author.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ error: "Not authorized to update this post" });
    }

    const { title, content, category } = req.body;
    const updates = {};

    if (title) updates.title = title;
    if (content) updates.content = content;
    if (category !== undefined) updates.category = category;

    if (title) {
      updates.slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
    }

    const updatedPost = await Post.findByIdAndUpdate(req.params.id, updates, {
      new: true,
    });
    res.json(updatedPost);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// DELETE /api/posts/:id - Delete a post
app.delete("/api/posts/:id", authenticateToken, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    if (post.author.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ error: "Not authorized to delete this post" });
    }

    await Post.findByIdAndDelete(req.params.id);
    res.json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// 404 handler - must be last route
app.use(notFoundHandler);

// Global error handler - must be last middleware
app.use(errorHandler);

module.exports = app;
