const Transaction = require('../models/Transaction');
const User = require('../models/User');

const createTransaction = async (req, res) => {
  try {
    const { symbol, name, type, quantity, price } = req.body;
    const user = await User.findById(req.user._id);

    const totalAmount = quantity * price;

    if (type === 'buy') {
      if (user.balance < totalAmount) {
        return res.status(400).json({ message: 'Insufficient balance' });
      }
    } else if (type === 'sell') {
      const holding = user.holdings.find(h => h.symbol === symbol);
      if (!holding || holding.quantity < quantity) {
        return res.status(400).json({ message: 'Insufficient holdings' });
      }
    }

    const transaction = await Transaction.create({
      user: req.user._id,
      symbol,
      name,
      type,
      quantity,
      price,
      totalAmount,
      status: 'pending'
    });

    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUserTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user._id })
      .sort({ createdAt: -1 });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find()
      .populate('user', 'name email')
      .populate('processedBy', 'name')
      .sort({ createdAt: -1 });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const approveTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const transaction = await Transaction.findById(id);

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    if (transaction.status !== 'pending') {
      return res.status(400).json({ message: 'Transaction already processed' });
    }

    const user = await User.findById(transaction.user);

    if (transaction.type === 'buy') {
      if (user.balance < transaction.totalAmount) {
        transaction.status = 'rejected';
        transaction.notes = 'Insufficient balance';
        await transaction.save();
        return res.status(400).json({ message: 'Insufficient balance' });
      }

      user.balance -= transaction.totalAmount;
      
      const existingHolding = user.holdings.find(h => h.symbol === transaction.symbol);
      if (existingHolding) {
        const totalValue = (existingHolding.quantity * existingHolding.avgPrice) + 
                          (transaction.quantity * transaction.price);
        existingHolding.quantity += transaction.quantity;
        existingHolding.avgPrice = totalValue / existingHolding.quantity;
      } else {
        user.holdings.push({
          symbol: transaction.symbol,
          quantity: transaction.quantity,
          avgPrice: transaction.price
        });
      }
    } else if (transaction.type === 'sell') {
      const holding = user.holdings.find(h => h.symbol === transaction.symbol);
      if (!holding || holding.quantity < transaction.quantity) {
        transaction.status = 'rejected';
        transaction.notes = 'Insufficient holdings';
        await transaction.save();
        return res.status(400).json({ message: 'Insufficient holdings' });
      }

      user.balance += transaction.totalAmount;
      holding.quantity -= transaction.quantity;
      
      if (holding.quantity === 0) {
        user.holdings = user.holdings.filter(h => h.symbol !== transaction.symbol);
      }
    }

    transaction.status = 'approved';
    transaction.processedBy = req.user._id;
    transaction.processedAt = new Date();
    
    await transaction.save();
    await user.save();

    res.json(transaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const rejectTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const { notes } = req.body;
    
    const transaction = await Transaction.findById(id);

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    if (transaction.status !== 'pending') {
      return res.status(400).json({ message: 'Transaction already processed' });
    }

    transaction.status = 'rejected';
    transaction.processedBy = req.user._id;
    transaction.processedAt = new Date();
    transaction.notes = notes || 'Rejected by admin';
    
    await transaction.save();

    res.json(transaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createTransaction,
  getUserTransactions,
  getAllTransactions,
  approveTransaction,
  rejectTransaction
};
