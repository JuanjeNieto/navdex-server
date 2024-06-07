const express = require('express');
const router = express.Router();
const { Post, Comment } = require('../models');
const { authenticateToken } = require('../middleware/auth');

// Obtener todas las publicaciones
router.get('/', async (req, res) => {
    try {
        const posts = await Post.findAll({ include: [Comment] });
        res.json(posts);
    } catch (error) {
        res.status(500).json({ msg: 'Error al obtener publicaciones' });
    }
});

// Crear una nueva publicación
router.post('/', authenticateToken, async (req, res) => {
    try {
        const { title, content } = req.body;
        const post = await Post.create({ title, content, userId: req.user.userId });
        res.status(201).json(post);
    } catch (error) {
        res.status(500).json({ msg: 'Error al crear publicación' });
    }
});

// Dar like a una publicación
router.post('/:postId/like', authenticateToken, async (req, res) => {
    try {
        const post = await Post.findByPk(req.params.postId);
        if (post) {
            post.likes += 1;
            await post.save();
            res.json(post);
        } else {
            res.status(404).json({ msg: 'Publicación no encontrada' });
        }
    } catch (error) {
        res.status(500).json({ msg: 'Error al dar like a la publicación' });
    }
});

// Crear un nuevo comentario
router.post('/:postId/comments', authenticateToken, async (req, res) => {
    try {
        const { content } = req.body;
        const comment = await Comment.create({ content, userId: req.user.userId, postId: req.params.postId });
        res.status(201).json(comment);
    } catch (error) {
        res.status(500).json({ msg: 'Error al crear comentario' });
    }
});

module.exports = router;
