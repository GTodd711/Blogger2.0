const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../middleware/auth');
const { Post, Comment } = require('../models');

// Render form for creating new post
router.get('/new', ensureAuthenticated, (req, res) => {
  res.render('newPost', { user: req.user });
});

// Create new post
router.post('/new', ensureAuthenticated, async (req, res) => {
  try {
    const { title, content } = req.body;
    const newPost = await Post.create({ title, content, author: req.user.id });
    res.redirect(`/posts/${newPost.id}`);
  } catch (err) {
    console.error(err);
    res.render('newPost', { user: req.user, error: err.message });
  }
});

// Render form for editing post
router.get('/:id/edit', ensureAuthenticated, async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id);
    if (!post || post.author !== req.user.id) {
      return res.redirect('/dashboard');
    }
    res.render('editPost', { user: req.user, post });
  } catch (err) {
    console.error(err);
    res.redirect('/dashboard');
  }
});

// Update post
router.post('/:id/edit', ensureAuthenticated, async (req, res) => {
  try {
    const { title, content } = req.body;
    await Post.update({ title, content }, { where: { id: req.params.id, author: req.user.id } });
    res.redirect(`/posts/${req.params.id}`);
  } catch (err) {
    console.error(err);
    res.redirect('/dashboard');
  }
});

// Delete post
router.post('/:id/delete', ensureAuthenticated, async (req, res) => {
  try {
    await Post.destroy({ where: { id: req.params.id, author: req.user.id } });
    res.redirect('/dashboard');
  } catch (err) {
    console.error(err);
    res.redirect('/dashboard');
  }
});

module.exports = router;
