module.exports = (sequelize, DataTypes) => {
  const Payment = sequelize.define('Payment', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    order_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Orders',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    payer_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    payment_number: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    amount: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      validate: { min: 0 }
    },
    currency: {
      type: DataTypes.STRING,
      defaultValue: 'TLB'
    },
    payment_method: {
      type: DataTypes.ENUM('wallet', 'card', 'bank', 'crypto', 'gift', 'installment'),
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('pending', 'processing', 'completed', 'failed', 'cancelled', 'refunded'),
      defaultValue: 'pending'
    },
    installment_number: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    total_installments: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    external_id: {
      type: DataTypes.STRING,
      allowNull: true
    },
    gateway_response: {
      type: DataTypes.JSON,
      defaultValue: {}
    },
    processed_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    metadata: {
      type: DataTypes.JSON,
      defaultValue: {}
    }
  }, {
    tableName: 'payments',
    indexes: [
      { fields: ['order_id'] },
      { fields: ['payer_id'] },
      { fields: ['payment_number'] },
      { fields: ['status'] },
      { fields: ['payment_method'] },
      { fields: ['processed_at'] }
    ],
    hooks: {
      beforeCreate: async (payment) => {
        if (!payment.payment_number) {
          const timestamp = Date.now().toString().slice(-8);
          const random = Math.random().toString(36).substr(2, 4).toUpperCase();
          payment.payment_number = `PAY-${timestamp}-${random}`;
        }
      },
      beforeUpdate: (payment) => {
        if (payment.changed('status') && payment.status === 'completed' && !payment.processed_at) {
          payment.processed_at = new Date();
        }
      }
    }
  });

  return Payment;
};