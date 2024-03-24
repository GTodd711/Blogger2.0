const express = require('express');
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require('../middleware/auth');
const { Post, Comment } = require('../models');

// Homepage route
router.get('/', async (req, res) => {
  try {
    const posts = await Post.findAll({ order: [['createdAt', 'DESC']] });
    res.render('home', { user: req.user, posts });
  } catch (err) {
    console.error(err);
    res.render('error', { message: 'Error fetching posts' });
  }
});

// Dashboard route (for authenticated users)
router.get('/dashboard', ensureAuthenticated, async (req, res) => {
  try {
    const userPosts = await Post.findAll({ where: { author: req.user.id }, order: [['createdAt', 'DESC']] });
    res.render('dashboard', { user: req.user, posts: userPosts });
  } catch (err) {
    console.error(err);
    res.render('error', { message: 'Error fetching user posts' });
  }
});

// Post detail route
router.get('/posts/:id', async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id, { include: Comment });
    res.render('post', { user: req.user, post });
  } catch (err) {
    console.error(err);
    res.render('error', { message: 'Error fetching post details' });
  }
});

module.exports = router;
