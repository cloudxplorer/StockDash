const express = require('express');
const router = express.Router();
const { getStockQuote, getStockHistory, getPopularStocks, searchStocks } = require('../controllers/stockController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/popular', authMiddleware, getPopularStocks);
router.get('/search', authMiddleware, searchStocks);
router.get('/quote/:symbol', authMiddleware, getStockQuote);
router.get('/history/:symbol', authMiddleware, getStockHistory);

module.exports = router;
