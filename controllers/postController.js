const { Post } = require('../models');

// Render form for creating new post
exports.renderPostForm = (req, res) => {
  res.render('postForm');
};

// Create new post
exports.createPost = async (req, res) => {
  try {
    const { title, content } = req.body;
    const newPost = await Post.create({ title, content, author: req.user.id });
    res.redirect(`/posts/${newPost.id}`);
  } catch (err) {
    console.error(err);
    res.render('postForm', { error: err.message });
  }
};

// Render form for editing post
exports.renderEditForm = async (req, res) => {
  const post = await Post.findByPk(req.params.id);
  if (!post) {
    return res.redirect('/posts');
  }
  res.render('editForm', { post });
};

// Update post
exports.updatePost = async (req, res) => {
  try {
    const { title, content } = req.body;
    await Post.update({ title, content }, { where: { id: req.params.id } });
    res.redirect(`/posts/${req.params.id}`);
  } catch (err) {
    console.error(err);
    res.render('editForm', { error: err.message });
  }
};

// Delete post
exports.deletePost = async (req, res) => {
  try {
    await Post.destroy({ where: { id: req.params.id } });
    res.redirect('/posts');
  } catch (err) {
    console.error(err);
    res.redirect(`/posts/${req.params.id}`);
  }
};
