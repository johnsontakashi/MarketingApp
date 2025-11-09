module.exports = (sequelize, DataTypes) => {
  const Bonus = sequelize.define('Bonus', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    recipient_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    giver_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'Users',
        key: 'id'
      },
      onDelete: 'SET NULL'
    },
    source_order_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'Orders',
        key: 'id'
      },
      onDelete: 'SET NULL'
    },
    type: {
      type: DataTypes.ENUM(
        'birthday', 'daily_login', 'weekly', 'monthly', 'gift_of_legacy', 
        'welcome', 'loyalty', 'achievement', 'seasonal', 'support', 'referral'
      ),
      allowNull: false
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    amount: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      validate: {
        min: 0
      }
    },
    currency: {
      type: DataTypes.STRING,
      defaultValue: 'TLB'
    },
    status: {
      type: DataTypes.ENUM('available', 'claimed', 'expired', 'cancelled'),
      defaultValue: 'available'
    },
    icon: {
      type: DataTypes.STRING,
      defaultValue: '🎁'
    },
    color: {
      type: DataTypes.STRING,
      defaultValue: '#10B981'
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    giver_name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    conditions: {
      type: DataTypes.JSON,
      defaultValue: {}
    },
    metadata: {
      type: DataTypes.JSON,
      defaultValue: {}
    },
    available_from: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    expires_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    claimed_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    can_forward: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    forward_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    max_forwards: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    is_recurring: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    recurring_frequency: {
      type: DataTypes.ENUM('daily', 'weekly', 'monthly', 'yearly'),
      allowNull: true
    },
    next_occurrence: {
      type: DataTypes.DATE,
      allowNull: true
    },
    streak_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    min_streak_required: {
      type: DataTypes.INTEGER,
      defaultValue: 1
    },
    achievement_data: {
      type: DataTypes.JSON,
      defaultValue: {}
    }
  }, {
    tableName: 'bonuses',
    indexes: [
      {
        fields: ['recipient_id']
      },
      {
        fields: ['giver_id']
      },
      {
        fields: ['source_order_id']
      },
      {
        fields: ['type']
      },
      {
        fields: ['status']
      },
      {
        fields: ['available_from']
      },
      {
        fields: ['expires_at']
      },
      {
        fields: ['created_at']
      },
      {
        fields: ['claimed_at']
      },
      {
        fields: ['is_recurring']
      },
      {
        fields: ['next_occurrence']
      }
    ],
    hooks: {
      beforeCreate: async (bonus) => {
        // Set default expiry if not provided (7 days for most bonuses)
        if (!bonus.expires_at) {
          const expiry = new Date();
          const defaultDays = {
            'birthday': 30,
            'daily_login': 1,
            'weekly': 7,
            'monthly': 30,
            'gift_of_legacy': 14,
            'welcome': 30,
            'loyalty': 90,
            'achievement': 30,
            'seasonal': 7,
            'support': 30,
            'referral': 30
          };
          
          expiry.setDate(expiry.getDate() + (defaultDays[bonus.type] || 7));
          bonus.expires_at = expiry;
        }

        // Set default icon and color based on type
        if (!bonus.icon) {
          const typeIcons = {
            'birthday': '🎂',
            'daily_login': '🎁',
            'weekly': '📅',
            'monthly': '🗓️',
            'gift_of_legacy': '⭐',
            'welcome': '👋',
            'loyalty': '💎',
            'achievement': '🏆',
            'seasonal': '🎉',
            'support': '🛡️',
            'referral': '👥'
          };
          bonus.icon = typeIcons[bonus.type] || '🎁';
        }

        // Set recurring schedule for recurring bonuses
        if (bonus.is_recurring && !bonus.next_occurrence) {
          const next = new Date();
          switch (bonus.recurring_frequency) {
            case 'daily':
              next.setDate(next.getDate() + 1);
              break;
            case 'weekly':
              next.setDate(next.getDate() + 7);
              break;
            case 'monthly':
              next.setMonth(next.getMonth() + 1);
              break;
            case 'yearly':
              next.setFullYear(next.getFullYear() + 1);
              break;
          }
          bonus.next_occurrence = next;
        }
      },
      beforeUpdate: (bonus) => {
        // Set claimed timestamp
        if (bonus.changed('status') && bonus.status === 'claimed' && !bonus.claimed_at) {
          bonus.claimed_at = new Date();
        }

        // Update next occurrence for recurring bonuses
        if (bonus.changed('status') && bonus.status === 'claimed' && bonus.is_recurring) {
          const next = new Date();
          switch (bonus.recurring_frequency) {
            case 'daily':
              next.setDate(next.getDate() + 1);
              break;
            case 'weekly':
              next.setDate(next.getDate() + 7);
              break;
            case 'monthly':
              next.setMonth(next.getMonth() + 1);
              break;
            case 'yearly':
              next.setFullYear(next.getFullYear() + 1);
              break;
          }
          bonus.next_occurrence = next;
        }
      }
    }
  });

  // Instance methods
  Bonus.prototype.isExpired = function() {
    return this.expires_at && new Date() > new Date(this.expires_at);
  };

  Bonus.prototype.isAvailable = function() {
    const now = new Date();
    return this.status === 'available' && 
           now >= new Date(this.available_from) && 
           !this.isExpired();
  };

  Bonus.prototype.canClaim = function() {
    return this.isAvailable() && this.status === 'available';
  };

  Bonus.prototype.canForward = function() {
    return this.can_forward && 
           this.forward_count < this.max_forwards && 
           this.isAvailable();
  };

  Bonus.prototype.getTimeRemaining = function() {
    if (!this.expires_at) return null;
    
    const now = new Date();
    const expiry = new Date(this.expires_at);
    const diffMs = expiry - now;
    
    if (diffMs <= 0) return null;
    
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) {
      return `${days} day${days > 1 ? 's' : ''}`;
    } else if (hours > 0) {
      return `${hours} hour${hours > 1 ? 's' : ''}`;
    } else {
      const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      return `${minutes} minute${minutes > 1 ? 's' : ''}`;
    }
  };

  Bonus.prototype.claim = async function(transaction = null) {
    if (!this.canClaim()) {
      throw new Error('Bonus cannot be claimed at this time');
    }

    this.status = 'claimed';
    this.claimed_at = new Date();

    const options = transaction ? { transaction } : {};
    await this.save(options);

    // Add funds to user's wallet
    const { Wallet } = require('./index');
    const wallet = await Wallet.findOne({ 
      where: { user_id: this.recipient_id },
      ...options
    });
    
    if (wallet) {
      await wallet.addFunds(this.amount, 'bonus');
    }

    return this;
  };

  Bonus.prototype.forward = async function(recipientId, message = null) {
    if (!this.canForward()) {
      throw new Error('Bonus cannot be forwarded');
    }

    // Create new bonus for recipient
    const forwardedBonus = await Bonus.create({
      recipient_id: recipientId,
      giver_id: this.recipient_id,
      type: this.type,
      title: this.title,
      description: this.description,
      amount: this.amount,
      currency: this.currency,
      icon: this.icon,
      color: this.color,
      message: message || this.message,
      giver_name: this.giver_name,
      can_forward: false, // Forwarded bonuses can't be forwarded again
      metadata: {
        ...this.metadata,
        forwarded_from: this.id,
        forwarded_at: new Date()
      }
    });

    // Update forward count
    this.forward_count += 1;
    await this.save();

    return forwardedBonus;
  };

  Bonus.prototype.expire = async function() {
    this.status = 'expired';
    await this.save();
    return this;
  };

  Bonus.prototype.cancel = async function() {
    if (this.status === 'claimed') {
      throw new Error('Cannot cancel claimed bonus');
    }
    
    this.status = 'cancelled';
    await this.save();
    return this;
  };

  // Class methods
  Bonus.createBirthdayBonus = async function(userId, amount = 50.00) {
    return await Bonus.create({
      recipient_id: userId,
      type: 'birthday',
      title: 'Birthday Bonus',
      description: 'Special birthday reward just for you!',
      amount,
      icon: '🎂',
      color: '#EC4899'
    });
  };

  Bonus.createDailyLoginBonus = async function(userId, streakCount = 1) {
    const baseAmount = 5.00;
    const bonusAmount = streakCount > 7 ? baseAmount * 1.5 : baseAmount;
    
    return await Bonus.create({
      recipient_id: userId,
      type: 'daily_login',
      title: 'Daily Login Bonus',
      description: `Keep your streak going! Day ${streakCount}`,
      amount: bonusAmount,
      icon: '🎁',
      color: '#10B981',
      streak_count: streakCount,
      is_recurring: true,
      recurring_frequency: 'daily'
    });
  };

  Bonus.createGiftOfLegacy = async function(recipientId, giverId, amount, message = null) {
    const { User } = require('./index');
    const giver = await User.findByPk(giverId);
    
    return await Bonus.create({
      recipient_id: recipientId,
      giver_id: giverId,
      type: 'gift_of_legacy',
      title: 'Gift of Legacy',
      description: 'A surprise gift from a community member',
      amount,
      icon: '⭐',
      color: '#F59E0B',
      message,
      giver_name: giver ? giver.getFullName() : null,
      can_forward: true,
      max_forwards: 1
    });
  };

  Bonus.getAvailableForUser = async function(userId) {
    const { Op } = require('sequelize');
    
    return await Bonus.findAll({
      where: {
        recipient_id: userId,
        status: 'available',
        available_from: { [Op.lte]: new Date() },
        [Op.or]: [
          { expires_at: null },
          { expires_at: { [Op.gt]: new Date() } }
        ]
      },
      order: [['created_at', 'DESC']]
    });
  };

  Bonus.processExpiredBonuses = async function() {
    const { Op } = require('sequelize');
    
    const expiredBonuses = await Bonus.findAll({
      where: {
        status: 'available',
        expires_at: { [Op.lt]: new Date() }
      }
    });

    const results = [];
    for (const bonus of expiredBonuses) {
      try {
        await bonus.expire();
        results.push({ success: true, bonus_id: bonus.id });
      } catch (error) {
        results.push({ success: false, bonus_id: bonus.id, error: error.message });
      }
    }

    return results;
  };

  Bonus.getUserStats = async function(userId) {
    const { Op } = require('sequelize');
    
    const stats = await Bonus.findAll({
      where: { recipient_id: userId },
      attributes: [
        'status',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
        [sequelize.fn('SUM', sequelize.col('amount')), 'total_amount']
      ],
      group: ['status']
    });

    return stats.reduce((acc, stat) => {
      acc[stat.status] = {
        count: parseInt(stat.getDataValue('count')),
        total_amount: parseFloat(stat.getDataValue('total_amount') || 0)
      };
      return acc;
    }, {});
  };

  return Bonus;
};