const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const User = require('../models/User');

const JWT_SECRET = '432025a54215d90965adf08f9f78e82ec90369551948d19f01d8c3c4945e40aa';

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function(req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

// Middleware para autenticar al usuario usando JWT
const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization'].split(' ')[1];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

const upload = multer({ storage });

// Validación de la contraseña
const validarPassword = (password) => {
    const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return regex.test(password);
};

// Registro de usuario
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        
        if (!validarPassword(password)) {
            return res.status(400).json({ msg: 'La contraseña debe tener al menos 8 caracteres y contener letras y números.' });
        }

        let user = await User.findOne({ where: { email } });
        if (user) {
            return res.status(400).json({ msg: 'El usuario ya existe' });
        }

        // Asignar la foto de perfil por defecto
        const defaultProfilePicture = '../default-profile.png';

        const hashedPassword = await bcrypt.hash(password, 10);
        user = await User.create({ name, email, password: hashedPassword, profilePicture: defaultProfilePicture });
        res.status(201).json(user);
    } catch (error) {
        console.error('Error al registrar usuario:', error);
        res.status(500).json({ msg: 'Error al registrar usuario' });
    }
});

// Inicio de sesión
router.post('/login', async (req, res) => {
    const { name, password } = req.body;

    try {
        const user = await User.findOne({ where: { name } });
        if (!user) {
            return res.status(400).json({ message: 'Usuario no encontrado' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Contraseña incorrecta' });
        }

        const token = jwt.sign({ userId: user.id, name: user.name }, JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        res.status(500).json({ message: 'Error del servidor' });
    }
});

// Validar token
router.post('/validate-token', (req, res) => {
    const token = req.headers['authorization'].split(' ')[1];
    if (!token) {
        return res.status(401).json({ valid: false });
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ valid: false });
        }
        return res.json({ valid: true, userId: decoded.userId });
    });
});

// Subir foto de perfil
router.post('/upload-profile-pic', authenticateToken, upload.single('profilePicture'), async (req, res) => {
    try {
        const user = await User.findByPk(req.user.userId);
        user.profilePicture = req.file.filename;
        await user.save();
        res.json(user);
    } catch (error) {
        console.error('Error al subir la foto de perfil:', error);
        res.status(500).json({ msg: 'Error al subir la foto de perfil' });
    }
});

// Obtener perfil de usuario
router.get('/profile', authenticateToken, async (req, res) => {
    try {
        const user = await User.findByPk(req.user.userId);
        res.json(user);
    } catch (error) {
        console.error('Error al obtener el perfil del usuario:', error);
        res.status(500).json({ msg: 'Error al obtener el perfil del usuario' });
    }
});

// Actualizar perfil de usuario
router.put('/profile', authenticateToken, upload.single('profilePicture'), async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const user = await User.findByPk(req.user.userId);

        if (name) user.name = name;
        if (email) user.email = email;
        if (password) user.password = await bcrypt.hash(password, 10);
        if (req.file) user.profilePicture = req.file.filename;

        await user.save();
        res.json(user);
    } catch (error) {
        console.error('Error al actualizar el perfil del usuario:', error);
        res.status(500).json({ msg: 'Error al actualizar el perfil del usuario' });
    }
});

module.exports = router;
