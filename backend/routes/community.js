const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const { 
  User, Bonus, Referral, Commission, Transaction, Wallet
} = require('../models');

// Get referral tree
router.get('/referrals/tree', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get direct referrals for the user
    const referrals = await Referral.findAll({
      where: { referrer_id: userId },
      include: [
        {
          model: User,
          as: 'referred',
          attributes: ['id', 'first_name', 'last_name', 'email', 'created_at', 'total_earned']
        }
      ]
    });

    // Format for frontend
    const treeData = referrals.map(referral => ({
      id: referral.referred.id,
      name: `${referral.referred.first_name} ${referral.referred.last_name}`,
      email: referral.referred.email,
      joinDate: referral.referred.created_at,
      totalEarnings: referral.referred.total_earned || 0,
      generation: referral.level || 1,
      status: referral.status
    }));

    res.json({
      tree: treeData,
      totalCount: treeData.length
    });

  } catch (error) {
    console.error('Get referral tree error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to get referral tree'
    });
  }
});

// Get referral stats
router.get('/referrals/stats', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get total referrals count
    const totalReferrals = await Referral.count({
      where: { referrer_id: userId }
    });

    // Get total commissions earned
    const totalCommissions = await Commission.sum('commission_amount', {
      where: { 
        affiliate_id: userId,
        status: 'approved'
      }
    }) || 0;

    // Get this month's commissions
    const currentMonth = new Date();
    currentMonth.setDate(1);
    currentMonth.setHours(0, 0, 0, 0);
    
    const monthlyCommissions = await Commission.sum('commission_amount', {
      where: { 
        affiliate_id: userId,
        status: 'approved',
        created_at: {
          [require('sequelize').Op.gte]: currentMonth
        }
      }
    }) || 0;

    res.json({
      totalReferrals,
      totalEarnings: totalCommissions,
      thisMonthEarnings: monthlyCommissions,
      generationBreakdown: [
        { generation: 1, count: totalReferrals, earnings: totalCommissions }
      ]
    });

  } catch (error) {
    console.error('Get referral stats error:', error);
    res.status(500).json({
      error: 'Internal Server Error', 
      message: 'Failed to get referral stats'
    });
  }
});

// Get available bonuses
router.get('/bonuses', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    
    const bonuses = await Bonus.findAll({
      where: { 
        recipient_id: userId,
        status: 'available'
      },
      order: [['created_at', 'DESC']]
    });

    const formattedBonuses = bonuses.map(bonus => ({
      id: bonus.id,
      type: bonus.type,
      amount: bonus.amount,
      title: bonus.title,
      description: bonus.description,
      icon: bonus.icon,
      color: bonus.color,
      expires_at: bonus.expires_at,
      can_forward: bonus.can_forward,
      giver_name: bonus.giver_name,
      message: bonus.message
    }));

    res.json({
      bonuses: formattedBonuses
    });

  } catch (error) {
    console.error('Get bonuses error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to get bonuses'
    });
  }
});

// Claim bonus
router.post('/bonuses/:id/claim', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const bonusId = req.params.id;

    const bonus = await Bonus.findOne({
      where: { 
        id: bonusId,
        recipient_id: userId,
        status: 'available'
      }
    });

    if (!bonus) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Bonus not found or already claimed'
      });
    }

    // Check if expired
    if (bonus.expires_at && new Date() > bonus.expires_at) {
      return res.status(400).json({
        error: 'Expired',
        message: 'This bonus has expired'
      });
    }

    // Get user's wallet
    const wallet = await Wallet.findOne({
      where: { user_id: userId }
    });

    if (!wallet) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Wallet not found'
      });
    }

    // Start transaction
    const sequelize = require('../config/database').sequelize;
    const transaction = await sequelize.transaction();

    try {
      // Update bonus status
      await bonus.update({
        status: 'claimed',
        claimed_at: new Date()
      }, { transaction });

      // Add amount to wallet
      await wallet.update({
        available_balance: wallet.available_balance + bonus.amount,
        total_earned: wallet.total_earned + bonus.amount,
        monthly_earned: wallet.monthly_earned + bonus.amount,
        monthly_bonuses: wallet.monthly_bonuses + bonus.amount
      }, { transaction });

      // Create transaction record
      await Transaction.create({
        wallet_id: wallet.id,
        user_id: userId,
        transaction_id: `BONUS-${bonus.id}-${Date.now()}`,
        type: 'bonus',
        amount: bonus.amount,
        net_amount: bonus.amount,
        currency: 'TLB',
        status: 'completed',
        title: bonus.title,
        description: bonus.description,
        icon: bonus.icon,
        color: bonus.color,
        processed_at: new Date()
      }, { transaction });

      await transaction.commit();

      res.json({
        message: 'Bonus claimed successfully',
        amount: bonus.amount,
        newBalance: wallet.available_balance + bonus.amount
      });

    } catch (error) {
      await transaction.rollback();
      throw error;
    }

  } catch (error) {
    console.error('Claim bonus error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to claim bonus'
    });
  }
});

// Forward bonus
router.post('/bonuses/:id/forward', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const bonusId = req.params.id;
    const { recipientId, message } = req.body;

    if (!recipientId) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Recipient ID is required'
      });
    }

    const bonus = await Bonus.findOne({
      where: { 
        id: bonusId,
        recipient_id: userId,
        status: 'available'
      }
    });

    if (!bonus) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Bonus not found or already claimed'
      });
    }

    if (!bonus.can_forward) {
      return res.status(400).json({
        error: 'Invalid Operation',
        message: 'This bonus cannot be forwarded'
      });
    }

    // Check recipient exists
    const recipient = await User.findByPk(recipientId);
    if (!recipient) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Recipient not found'
      });
    }

    const sequelize = require('../config/database').sequelize;
    const transaction = await sequelize.transaction();

    try {
      // Update original bonus
      await bonus.update({
        status: 'forwarded',
        claimed_at: new Date()
      }, { transaction });

      // Create new bonus for recipient
      await Bonus.create({
        recipient_id: recipientId,
        giver_id: userId,
        type: 'gift_of_legacy',
        title: bonus.title,
        description: bonus.description,
        amount: bonus.amount,
        icon: bonus.icon,
        color: bonus.color,
        status: 'available',
        message: message || 'Forwarded with love!',
        giver_name: `${req.user.first_name} ${req.user.last_name}`,
        can_forward: bonus.max_forwards > 1,
        max_forwards: bonus.max_forwards - 1,
        expires_at: bonus.expires_at
      }, { transaction });

      await transaction.commit();

      res.json({
        message: 'Bonus forwarded successfully'
      });

    } catch (error) {
      await transaction.rollback();
      throw error;
    }

  } catch (error) {
    console.error('Forward bonus error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to forward bonus'
    });
  }
});

// Get commissions
router.get('/commissions', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    
    const commissions = await Commission.findAll({
      where: { affiliate_id: userId },
      include: [
        {
          model: User,
          as: 'buyer',
          attributes: ['first_name', 'last_name']
        }
      ],
      order: [['created_at', 'DESC']],
      limit: 50
    });

    const formattedCommissions = commissions.map(commission => ({
      id: commission.id,
      amount: commission.commission_amount,
      percentage: commission.commission_percentage,
      level: commission.level,
      status: commission.status,
      buyerName: commission.buyer ? 
        `${commission.buyer.first_name} ${commission.buyer.last_name}` : 
        'Unknown',
      orderValue: commission.order_value,
      createdAt: commission.created_at,
      paidAt: commission.paid_at
    }));

    res.json({
      commissions: formattedCommissions
    });

  } catch (error) {
    console.error('Get commissions error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to get commissions'
    });
  }
});

module.exports = router;