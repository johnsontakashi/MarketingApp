module.exports = (sequelize, DataTypes) => {
  const Transaction = sequelize.define('Transaction', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    wallet_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Wallets',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    transaction_id: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    type: {
      type: DataTypes.ENUM(
        'received', 'sent', 'purchase', 'sale', 'commission', 'bonus', 
        'referral', 'topup', 'withdrawal', 'refund', 'fee', 'penalty'
      ),
      allowNull: false
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
      type: DataTypes.ENUM('pending', 'completed', 'failed', 'cancelled', 'refunded'),
      defaultValue: 'pending'
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    icon: {
      type: DataTypes.STRING,
      defaultValue: 'swap'
    },
    color: {
      type: DataTypes.STRING,
      defaultValue: '#10B981'
    },
    related_user_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    related_order_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'Orders',
        key: 'id'
      }
    },
    related_transaction_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'Transactions',
        key: 'id'
      }
    },
    payment_method: {
      type: DataTypes.ENUM('wallet', 'card', 'bank', 'crypto', 'gift'),
      allowNull: true
    },
    external_reference: {
      type: DataTypes.STRING,
      allowNull: true
    },
    fee_amount: {
      type: DataTypes.DECIMAL(15, 2),
      defaultValue: 0.00
    },
    net_amount: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false
    },
    exchange_rate: {
      type: DataTypes.DECIMAL(10, 6),
      defaultValue: 1.000000
    },
    balance_before: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true
    },
    balance_after: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true
    },
    processed_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    expires_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    location: {
      type: DataTypes.STRING,
      allowNull: true
    },
    device_info: {
      type: DataTypes.JSON,
      defaultValue: {}
    },
    metadata: {
      type: DataTypes.JSON,
      defaultValue: {}
    }
  }, {
    tableName: 'transactions',
    indexes: [
      {
        fields: ['wallet_id']
      },
      {
        fields: ['user_id']
      },
      {
        fields: ['transaction_id']
      },
      {
        fields: ['type']
      },
      {
        fields: ['status']
      },
      {
        fields: ['created_at']
      },
      {
        fields: ['processed_at']
      },
      {
        fields: ['related_user_id']
      },
      {
        fields: ['related_order_id']
      }
    ],
    hooks: {
      beforeCreate: async (transaction) => {
        // Generate unique transaction ID
        if (!transaction.transaction_id) {
          const timestamp = Date.now();
          const random = Math.random().toString(36).substr(2, 6).toUpperCase();
          transaction.transaction_id = `TXN-${timestamp}-${random}`;
        }

        // Calculate net amount
        transaction.net_amount = parseFloat(transaction.amount) - parseFloat(transaction.fee_amount || 0);

        // Set color based on type
        if (!transaction.color) {
          const typeColors = {
            received: '#10B981',
            sent: '#EF4444',
            purchase: '#EF4444',
            sale: '#10B981',
            commission: '#F59E0B',
            bonus: '#10B981',
            referral: '#10B981',
            topup: '#10B981',
            withdrawal: '#EF4444',
            refund: '#10B981',
            fee: '#EF4444',
            penalty: '#EF4444'
          };
          transaction.color = typeColors[transaction.type] || '#6B7280';
        }

        // Set default icon based on type
        if (!transaction.icon) {
          const typeIcons = {
            received: 'arrow-down',
            sent: 'arrow-up',
            purchase: 'storefront',
            sale: 'storefront',
            commission: 'trending-up',
            bonus: 'gift',
            referral: 'people',
            topup: 'card',
            withdrawal: 'bank',
            refund: 'return-up-back',
            fee: 'card',
            penalty: 'warning'
          };
          transaction.icon = typeIcons[transaction.type] || 'swap';
        }
      },
      beforeUpdate: (transaction) => {
        if (transaction.changed('status') && transaction.status === 'completed' && !transaction.processed_at) {
          transaction.processed_at = new Date();
        }
      }
    }
  });

  // Instance methods
  Transaction.prototype.isDebit = function() {
    return ['sent', 'purchase', 'withdrawal', 'fee', 'penalty'].includes(this.type);
  };

  Transaction.prototype.isCredit = function() {
    return ['received', 'sale', 'commission', 'bonus', 'referral', 'topup', 'refund'].includes(this.type);
  };

  Transaction.prototype.getDisplayAmount = function() {
    const prefix = this.isCredit() ? '+' : '-';
    return `${prefix}💎 ${parseFloat(this.amount).toFixed(2)}`;
  };

  Transaction.prototype.getTimeAgo = function() {
    const now = new Date();
    const created = new Date(this.created_at);
    const diffMs = now - created;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffMs / (1000 * 60));

    if (diffDays > 0) {
      return diffDays === 1 ? '1 day ago' : `${diffDays} days ago`;
    } else if (diffHours > 0) {
      return diffHours === 1 ? '1 hour ago' : `${diffHours} hours ago`;
    } else if (diffMinutes > 0) {
      return diffMinutes === 1 ? '1 minute ago' : `${diffMinutes} minutes ago`;
    } else {
      return 'Just now';
    }
  };

  return Transaction;
};