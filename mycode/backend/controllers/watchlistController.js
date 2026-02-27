const User = require('../models/User');

const getWatchlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json(user.watchlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addToWatchlist = async (req, res) => {
  try {
    const { symbol, name } = req.body;
    const user = await User.findById(req.user._id);

    const exists = user.watchlist.find(item => item.symbol === symbol);
    if (exists) {
      return res.status(400).json({ message: 'Stock already in watchlist' });
    }

    user.watchlist.push({ symbol, name });
    await user.save();

    res.json(user.watchlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const removeFromWatchlist = async (req, res) => {
  try {
    const { symbol } = req.params;
    const user = await User.findById(req.user._id);

    user.watchlist = user.watchlist.filter(item => item.symbol !== symbol);
    await user.save();

    res.json(user.watchlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getWatchlist, addToWatchlist, removeFromWatchlist };
