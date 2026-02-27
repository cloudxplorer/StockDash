const express = require('express');
const router = express.Router();
const { signup, login, getProfile, getAllUsers } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

router.post('/signup', signup);
router.post('/login', login);
router.get('/profile', authMiddleware, getProfile);
router.get('/users', authMiddleware, adminMiddleware, getAllUsers);

module.exports = router;
