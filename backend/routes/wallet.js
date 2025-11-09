const express = require('express');
const { Wallet, Transaction, User } = require('../models');
const { authMiddleware } = require('../middleware/auth');
const router = express.Router();

// Get wallet balance and details
router.get('/', authMiddleware, async (req, res) => {
  try {
    let wallet = await Wallet.findOne({
      where: { user_id: req.userId }
    });

    // Create wallet if it doesn't exist
    if (!wallet) {
      wallet = await Wallet.create({
        user_id: req.userId,
        available_balance: 0.00,
        currency: 'TLB'
      });
    }

    res.json({
      wallet: {
        available_balance: parseFloat(wallet.available_balance),
        locked_balance: parseFloat(wallet.locked_balance),
        pending_balance: parseFloat(wallet.pending_balance),
        total_balance: wallet.getTotalBalance(),
        total_earned: parseFloat(wallet.total_earned),
        total_spent: parseFloat(wallet.total_spent),
        monthly_earned: parseFloat(wallet.monthly_earned),
        monthly_spent: parseFloat(wallet.monthly_spent),
        monthly_bonuses: parseFloat(wallet.monthly_bonuses),
        currency: wallet.currency,
        daily_limit: parseFloat(wallet.daily_limit),
        daily_spent: parseFloat(wallet.daily_spent),
        last_updated: wallet.updated_at
      }
    });

  } catch (error) {
    console.error('Get wallet error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to get wallet information'
    });
  }
});

// Send TLB to another user
router.post('/send', authMiddleware, async (req, res) => {
  try {
    const { recipient, amount, message } = req.body;

    if (!recipient || !amount) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Recipient and amount are required'
      });
    }

    const sendAmount = parseFloat(amount);
    if (isNaN(sendAmount) || sendAmount <= 0) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Amount must be a positive number'
      });
    }

    // Find sender's wallet
    const senderWallet = await Wallet.findOne({
      where: { user_id: req.userId }
    });

    if (!senderWallet || !senderWallet.canSpend(sendAmount)) {
      return res.status(400).json({
        error: 'Insufficient Funds',
        message: 'Insufficient balance or daily limit exceeded'
      });
    }

    // Find recipient by email or username
    const recipientUser = await User.findOne({
      where: {
        [require('sequelize').Op.or]: [
          { email: recipient.toLowerCase() },
          { username: recipient }
        ]
      }
    });

    if (!recipientUser) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Recipient not found'
      });
    }

    if (recipientUser.id === req.userId) {
      return res.status(400).json({
        error: 'Invalid Operation',
        message: 'Cannot send TLB to yourself'
      });
    }

    // Find or create recipient's wallet
    let recipientWallet = await Wallet.findOne({
      where: { user_id: recipientUser.id }
    });

    if (!recipientWallet) {
      recipientWallet = await Wallet.create({
        user_id: recipientUser.id,
        available_balance: 0.00,
        currency: 'TLB'
      });
    }

    // Perform the transfer using a transaction
    const result = await require('../models').sequelize.transaction(async (t) => {
      // Deduct from sender
      await senderWallet.deductFunds(sendAmount);

      // Add to recipient
      await recipientWallet.addFunds(sendAmount, 'received');

      // Create transaction records
      const senderTransaction = await Transaction.create({
        wallet_id: senderWallet.id,
        user_id: req.userId,
        type: 'sent',
        amount: sendAmount,
        currency: 'TLB',
        status: 'completed',
        title: 'TLB Transfer Sent',
        description: `Sent to ${recipientUser.first_name} ${recipientUser.last_name}`,
        icon: 'send',
        color: '#EF4444',
        related_user_id: recipientUser.id,
        message: message || null,
        balance_before: parseFloat(senderWallet.available_balance) + sendAmount,
        balance_after: parseFloat(senderWallet.available_balance),
        processed_at: new Date()
      }, { transaction: t });

      const recipientTransaction = await Transaction.create({
        wallet_id: recipientWallet.id,
        user_id: recipientUser.id,
        type: 'received',
        amount: sendAmount,
        currency: 'TLB',
        status: 'completed',
        title: 'TLB Transfer Received',
        description: `Received from ${req.user.first_name} ${req.user.last_name}`,
        icon: 'arrow-down',
        color: '#10B981',
        related_user_id: req.userId,
        related_transaction_id: senderTransaction.id,
        message: message || null,
        balance_before: parseFloat(recipientWallet.available_balance) - sendAmount,
        balance_after: parseFloat(recipientWallet.available_balance),
        processed_at: new Date()
      }, { transaction: t });

      return { senderTransaction, recipientTransaction };
    });

    res.json({
      message: 'Transfer completed successfully',
      transaction: {
        id: result.senderTransaction.id,
        amount: sendAmount,
        recipient: {
          id: recipientUser.id,
          name: `${recipientUser.first_name} ${recipientUser.last_name}`,
          email: recipientUser.email
        },
        status: 'completed',
        created_at: result.senderTransaction.created_at
      }
    });

  } catch (error) {
    console.error('Send TLB error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Transfer failed'
    });
  }
});

// Request TLB from another user
router.post('/request', authMiddleware, async (req, res) => {
  try {
    const { requester, amount, message } = req.body;

    if (!requester || !amount) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Requester and amount are required'
      });
    }

    const requestAmount = parseFloat(amount);
    if (isNaN(requestAmount) || requestAmount <= 0) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Amount must be a positive number'
      });
    }

    // Find requester by email or username
    const requesterUser = await User.findOne({
      where: {
        [require('sequelize').Op.or]: [
          { email: requester.toLowerCase() },
          { username: requester }
        ]
      }
    });

    if (!requesterUser) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Requester not found'
      });
    }

    if (requesterUser.id === req.userId) {
      return res.status(400).json({
        error: 'Invalid Operation',
        message: 'Cannot request TLB from yourself'
      });
    }

    // Create a pending transaction for the request
    const requestTransaction = await Transaction.create({
      wallet_id: null, // No wallet ID for requests
      user_id: req.userId,
      type: 'received',
      amount: requestAmount,
      currency: 'TLB',
      status: 'pending',
      title: 'TLB Payment Request',
      description: `Payment request sent to ${requesterUser.first_name} ${requesterUser.last_name}`,
      icon: 'download',
      color: '#F59E0B',
      related_user_id: requesterUser.id,
      message: message || null,
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // Expires in 7 days
    });

    // TODO: Send notification to requester about the payment request

    res.json({
      message: 'Payment request sent successfully',
      request: {
        id: requestTransaction.id,
        amount: requestAmount,
        requester: {
          id: requesterUser.id,
          name: `${requesterUser.first_name} ${requesterUser.last_name}`,
          email: requesterUser.email
        },
        status: 'pending',
        expires_at: requestTransaction.expires_at,
        created_at: requestTransaction.created_at
      }
    });

  } catch (error) {
    console.error('Request TLB error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Payment request failed'
    });
  }
});

// Top up wallet (placeholder for payment integration)
router.post('/topup', authMiddleware, async (req, res) => {
  try {
    const { method, amount, paymentDetails } = req.body;

    if (!method || !amount) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Payment method and amount are required'
      });
    }

    const topUpAmount = parseFloat(amount);
    if (isNaN(topUpAmount) || topUpAmount <= 0) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Amount must be a positive number'
      });
    }

    // Validate payment method
    const validMethods = ['card', 'bank', 'crypto', 'gift'];
    if (!validMethods.includes(method)) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Invalid payment method'
      });
    }

    // Get wallet
    const wallet = await Wallet.findOne({
      where: { user_id: req.userId }
    });

    // For demo purposes, we'll simulate successful payment
    // In production, integrate with payment processors like Stripe, PayPal, etc.
    
    const methodDetails = {
      card: { fee: 0.029, minAmount: 10, maxAmount: 5000, description: 'Credit/Debit Card' },
      bank: { fee: 5.00, minAmount: 25, maxAmount: 10000, description: 'Bank Transfer' },
      crypto: { fee: 0.015, minAmount: 50, maxAmount: 25000, description: 'Cryptocurrency' },
      gift: { fee: 0, minAmount: 1, maxAmount: 1000, description: 'Gift Card' }
    };

    const methodInfo = methodDetails[method];
    
    // Calculate fees
    let feeAmount = 0;
    if (method === 'card' || method === 'crypto') {
      feeAmount = topUpAmount * methodInfo.fee;
      if (method === 'card') feeAmount += 0.30; // Fixed fee for cards
    } else if (method === 'bank') {
      feeAmount = methodInfo.fee;
    }

    const netAmount = topUpAmount - feeAmount;

    // Create pending transaction
    const topUpTransaction = await Transaction.create({
      wallet_id: wallet.id,
      user_id: req.userId,
      type: 'topup',
      amount: topUpAmount,
      currency: 'TLB',
      status: 'processing', // Would be 'pending' in production
      title: `Wallet Top Up - ${methodInfo.description}`,
      description: `Added funds via ${methodInfo.description}`,
      icon: 'card',
      color: '#10B981',
      payment_method: method,
      fee_amount: feeAmount,
      net_amount: netAmount,
      metadata: {
        payment_details: paymentDetails,
        method_info: methodInfo
      }
    });

    // For demo, immediately process the transaction
    // In production, this would happen after payment confirmation
    setTimeout(async () => {
      try {
        await wallet.addFunds(netAmount, 'topup');
        
        topUpTransaction.status = 'completed';
        topUpTransaction.processed_at = new Date();
        topUpTransaction.balance_after = parseFloat(wallet.available_balance);
        await topUpTransaction.save();
      } catch (error) {
        console.error('Top up processing error:', error);
        topUpTransaction.status = 'failed';
        await topUpTransaction.save();
      }
    }, 2000);

    res.json({
      message: 'Top up initiated successfully',
      transaction: {
        id: topUpTransaction.id,
        amount: topUpAmount,
        net_amount: netAmount,
        fee_amount: feeAmount,
        method: methodInfo.description,
        status: 'processing',
        estimated_completion: new Date(Date.now() + 5 * 60 * 1000) // 5 minutes for demo
      }
    });

  } catch (error) {
    console.error('Top up error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Top up failed'
    });
  }
});

// Get transaction history
router.get('/transactions', authMiddleware, async (req, res) => {
  try {
    const { limit = 20, offset = 0, type, status } = req.query;

    const wallet = await Wallet.findOne({
      where: { user_id: req.userId }
    });

    if (!wallet) {
      return res.json({ transactions: [], total: 0, pagination: {} });
    }

    const where = { user_id: req.userId };
    
    if (type) {
      where.type = type;
    }
    
    if (status) {
      where.status = status;
    }

    const { count, rows: transactions } = await Transaction.findAndCountAll({
      where,
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'first_name', 'last_name', 'email'],
        required: false
      }],
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    // Format transactions for frontend
    const formattedTransactions = transactions.map(tx => ({
      id: tx.id,
      transaction_id: tx.transaction_id,
      type: tx.type,
      amount: parseFloat(tx.amount),
      currency: tx.currency,
      status: tx.status,
      title: tx.title,
      description: tx.description,
      icon: tx.icon,
      color: tx.color,
      display_amount: tx.getDisplayAmount(),
      time_ago: tx.getTimeAgo(),
      date: tx.created_at.toISOString().split('T')[0],
      time: tx.created_at.toLocaleTimeString(),
      message: tx.message,
      related_user: tx.related_user_id ? {
        id: tx.related_user_id,
        // Would include related user info if needed
      } : null,
      processed_at: tx.processed_at,
      created_at: tx.created_at
    }));

    const totalPages = Math.ceil(count / limit);
    const currentPage = Math.floor(offset / limit) + 1;

    res.json({
      transactions: formattedTransactions,
      total: count,
      pagination: {
        current_page: currentPage,
        total_pages: totalPages,
        per_page: parseInt(limit),
        total_items: count,
        has_more: currentPage < totalPages
      }
    });

  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to get transaction history'
    });
  }
});

// Get specific transaction details
router.get('/transactions/:id', authMiddleware, async (req, res) => {
  try {
    const transaction = await Transaction.findOne({
      where: {
        id: req.params.id,
        user_id: req.userId
      }
    });

    if (!transaction) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Transaction not found'
      });
    }

    res.json({
      transaction: {
        id: transaction.id,
        transaction_id: transaction.transaction_id,
        type: transaction.type,
        amount: parseFloat(transaction.amount),
        currency: transaction.currency,
        status: transaction.status,
        title: transaction.title,
        description: transaction.description,
        icon: transaction.icon,
        color: transaction.color,
        display_amount: transaction.getDisplayAmount(),
        time_ago: transaction.getTimeAgo(),
        message: transaction.message,
        fee_amount: parseFloat(transaction.fee_amount || 0),
        net_amount: parseFloat(transaction.net_amount),
        balance_before: parseFloat(transaction.balance_before || 0),
        balance_after: parseFloat(transaction.balance_after || 0),
        payment_method: transaction.payment_method,
        external_reference: transaction.external_reference,
        processed_at: transaction.processed_at,
        created_at: transaction.created_at,
        metadata: transaction.metadata
      }
    });

  } catch (error) {
    console.error('Get transaction details error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to get transaction details'
    });
  }
});

module.exports = router;