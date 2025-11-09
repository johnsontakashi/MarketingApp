module.exports = (sequelize, DataTypes) => {
  const Wallet = sequelize.define('Wallet', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true,
      references: {
        model: 'Users',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    available_balance: {
      type: DataTypes.DECIMAL(15, 2),
      defaultValue: 0.00,
      validate: {
        min: 0
      }
    },
    locked_balance: {
      type: DataTypes.DECIMAL(15, 2),
      defaultValue: 0.00,
      validate: {
        min: 0
      }
    },
    pending_balance: {
      type: DataTypes.DECIMAL(15, 2),
      defaultValue: 0.00,
      validate: {
        min: 0
      }
    },
    total_earned: {
      type: DataTypes.DECIMAL(15, 2),
      defaultValue: 0.00
    },
    total_spent: {
      type: DataTypes.DECIMAL(15, 2),
      defaultValue: 0.00
    },
    monthly_earned: {
      type: DataTypes.DECIMAL(15, 2),
      defaultValue: 0.00
    },
    monthly_spent: {
      type: DataTypes.DECIMAL(15, 2),
      defaultValue: 0.00
    },
    monthly_bonuses: {
      type: DataTypes.DECIMAL(15, 2),
      defaultValue: 0.00
    },
    last_monthly_reset: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    currency: {
      type: DataTypes.STRING,
      defaultValue: 'TLB'
    },
    pin_hash: {
      type: DataTypes.STRING,
      allowNull: true
    },
    pin_attempts: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    pin_locked_until: {
      type: DataTypes.DATE,
      allowNull: true
    },
    daily_limit: {
      type: DataTypes.DECIMAL(15, 2),
      defaultValue: 1000.00
    },
    daily_spent: {
      type: DataTypes.DECIMAL(15, 2),
      defaultValue: 0.00
    },
    last_daily_reset: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    auto_lock_enabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    auto_lock_threshold: {
      type: DataTypes.DECIMAL(15, 2),
      defaultValue: 100.00
    },
    notification_preferences: {
      type: DataTypes.JSON,
      defaultValue: {
        low_balance: true,
        transaction_alerts: true,
        weekly_summary: true
      }
    },
    metadata: {
      type: DataTypes.JSON,
      defaultValue: {}
    }
  }, {
    tableName: 'wallets',
    indexes: [
      {
        fields: ['user_id']
      },
      {
        fields: ['available_balance']
      },
      {
        fields: ['currency']
      }
    ],
    hooks: {
      beforeUpdate: (wallet) => {
        // Reset monthly stats if needed
        const now = new Date();
        const lastReset = new Date(wallet.last_monthly_reset);
        if (now.getMonth() !== lastReset.getMonth() || now.getFullYear() !== lastReset.getFullYear()) {
          wallet.monthly_earned = 0;
          wallet.monthly_spent = 0;
          wallet.monthly_bonuses = 0;
          wallet.last_monthly_reset = now;
        }

        // Reset daily stats if needed
        const lastDailyReset = new Date(wallet.last_daily_reset);
        if (now.toDateString() !== lastDailyReset.toDateString()) {
          wallet.daily_spent = 0;
          wallet.last_daily_reset = now;
        }
      }
    }
  });

  // Instance methods
  Wallet.prototype.getTotalBalance = function() {
    return parseFloat(this.available_balance) + parseFloat(this.locked_balance) + parseFloat(this.pending_balance);
  };

  Wallet.prototype.canSpend = function(amount) {
    return parseFloat(this.available_balance) >= parseFloat(amount) && 
           (parseFloat(this.daily_spent) + parseFloat(amount)) <= parseFloat(this.daily_limit);
  };

  Wallet.prototype.addFunds = async function(amount, type = 'earned') {
    const numAmount = parseFloat(amount);
    this.available_balance = parseFloat(this.available_balance) + numAmount;
    
    if (type === 'earned') {
      this.total_earned = parseFloat(this.total_earned) + numAmount;
      this.monthly_earned = parseFloat(this.monthly_earned) + numAmount;
    } else if (type === 'bonus') {
      this.monthly_bonuses = parseFloat(this.monthly_bonuses) + numAmount;
    }
    
    await this.save();
    return this;
  };

  Wallet.prototype.deductFunds = async function(amount) {
    const numAmount = parseFloat(amount);
    if (!this.canSpend(numAmount)) {
      throw new Error('Insufficient funds or daily limit exceeded');
    }
    
    this.available_balance = parseFloat(this.available_balance) - numAmount;
    this.total_spent = parseFloat(this.total_spent) + numAmount;
    this.monthly_spent = parseFloat(this.monthly_spent) + numAmount;
    this.daily_spent = parseFloat(this.daily_spent) + numAmount;
    
    await this.save();
    return this;
  };

  Wallet.prototype.lockFunds = async function(amount) {
    const numAmount = parseFloat(amount);
    if (parseFloat(this.available_balance) < numAmount) {
      throw new Error('Insufficient available balance to lock');
    }
    
    this.available_balance = parseFloat(this.available_balance) - numAmount;
    this.locked_balance = parseFloat(this.locked_balance) + numAmount;
    
    await this.save();
    return this;
  };

  Wallet.prototype.unlockFunds = async function(amount) {
    const numAmount = parseFloat(amount);
    if (parseFloat(this.locked_balance) < numAmount) {
      throw new Error('Insufficient locked balance to unlock');
    }
    
    this.locked_balance = parseFloat(this.locked_balance) - numAmount;
    this.available_balance = parseFloat(this.available_balance) + numAmount;
    
    await this.save();
    return this;
  };

  Wallet.prototype.moveToPending = async function(amount, fromType = 'available') {
    const numAmount = parseFloat(amount);
    
    if (fromType === 'available') {
      if (parseFloat(this.available_balance) < numAmount) {
        throw new Error('Insufficient available balance');
      }
      this.available_balance = parseFloat(this.available_balance) - numAmount;
    } else if (fromType === 'locked') {
      if (parseFloat(this.locked_balance) < numAmount) {
        throw new Error('Insufficient locked balance');
      }
      this.locked_balance = parseFloat(this.locked_balance) - numAmount;
    }
    
    this.pending_balance = parseFloat(this.pending_balance) + numAmount;
    await this.save();
    return this;
  };

  Wallet.prototype.resolveFromPending = async function(amount, toType = 'available') {
    const numAmount = parseFloat(amount);
    if (parseFloat(this.pending_balance) < numAmount) {
      throw new Error('Insufficient pending balance');
    }
    
    this.pending_balance = parseFloat(this.pending_balance) - numAmount;
    
    if (toType === 'available') {
      this.available_balance = parseFloat(this.available_balance) + numAmount;
    } else if (toType === 'locked') {
      this.locked_balance = parseFloat(this.locked_balance) + numAmount;
    }
    // If toType is 'deduct', we just remove from pending without adding anywhere
    
    await this.save();
    return this;
  };

  return Wallet;
};