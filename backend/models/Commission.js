module.exports = (sequelize, DataTypes) => {
  const Commission = sequelize.define('Commission', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    affiliate_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      },
      onDelete: 'CASCADE'
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
    buyer_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    seller_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    level: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 10
      }
    },
    commission_type: {
      type: DataTypes.ENUM('referral', 'sale', 'bonus', 'override'),
      defaultValue: 'referral'
    },
    base_amount: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false
    },
    commission_rate: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false
    },
    commission_amount: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false
    },
    currency: {
      type: DataTypes.STRING,
      defaultValue: 'TLB'
    },
    status: {
      type: DataTypes.ENUM('pending', 'approved', 'paid', 'cancelled', 'disputed'),
      defaultValue: 'pending'
    },
    payment_status: {
      type: DataTypes.ENUM('unpaid', 'pending_payment', 'paid', 'failed'),
      defaultValue: 'unpaid'
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true
    },
    payment_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    approved_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    approved_by: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    paid_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    payment_reference: {
      type: DataTypes.STRING,
      allowNull: true
    },
    payment_method: {
      type: DataTypes.ENUM('wallet', 'bank', 'check', 'crypto'),
      defaultValue: 'wallet'
    },
    tax_amount: {
      type: DataTypes.DECIMAL(15, 2),
      defaultValue: 0.00
    },
    fee_amount: {
      type: DataTypes.DECIMAL(15, 2),
      defaultValue: 0.00
    },
    net_amount: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false
    },
    period_start: {
      type: DataTypes.DATE,
      allowNull: true
    },
    period_end: {
      type: DataTypes.DATE,
      allowNull: true
    },
    is_recurring: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    recurring_frequency: {
      type: DataTypes.ENUM('monthly', 'quarterly', 'annually'),
      allowNull: true
    },
    expires_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    admin_notes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    dispute_reason: {
      type: DataTypes.STRING,
      allowNull: true
    },
    dispute_resolved_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    metadata: {
      type: DataTypes.JSON,
      defaultValue: {}
    }
  }, {
    tableName: 'commissions',
    indexes: [
      {
        fields: ['affiliate_id']
      },
      {
        fields: ['order_id']
      },
      {
        fields: ['buyer_id']
      },
      {
        fields: ['seller_id']
      },
      {
        fields: ['level']
      },
      {
        fields: ['commission_type']
      },
      {
        fields: ['status']
      },
      {
        fields: ['payment_status']
      },
      {
        fields: ['created_at']
      },
      {
        fields: ['approved_at']
      },
      {
        fields: ['paid_at']
      },
      {
        fields: ['period_start', 'period_end']
      }
    ],
    hooks: {
      beforeCreate: async (commission) => {
        // Calculate commission amount if not provided
        if (!commission.commission_amount) {
          commission.commission_amount = (parseFloat(commission.base_amount) * parseFloat(commission.commission_rate)) / 100;
        }

        // Calculate net amount
        commission.net_amount = parseFloat(commission.commission_amount) - 
                               parseFloat(commission.tax_amount) - 
                               parseFloat(commission.fee_amount);

        // Set expiration date (90 days from creation if not specified)
        if (!commission.expires_at) {
          const expiry = new Date();
          expiry.setDate(expiry.getDate() + 90);
          commission.expires_at = expiry;
        }

        // Generate description if not provided
        if (!commission.description) {
          commission.description = `Level ${commission.level} ${commission.commission_type} commission`;
        }
      },
      beforeUpdate: (commission) => {
        // Set approval timestamp
        if (commission.changed('status') && commission.status === 'approved' && !commission.approved_at) {
          commission.approved_at = new Date();
        }

        // Set payment timestamp
        if (commission.changed('payment_status') && commission.payment_status === 'paid' && !commission.paid_at) {
          commission.paid_at = new Date();
          commission.payment_date = new Date();
        }

        // Auto-approve small commissions (under $10)
        if (commission.changed('status') && commission.status === 'pending' && 
            parseFloat(commission.commission_amount) < 10.00) {
          commission.status = 'approved';
          commission.approved_at = new Date();
        }
      }
    }
  });

  // Instance methods
  Commission.prototype.isExpired = function() {
    return this.expires_at && new Date() > new Date(this.expires_at);
  };

  Commission.prototype.canBePaid = function() {
    return this.status === 'approved' && 
           this.payment_status === 'unpaid' && 
           !this.isExpired();
  };

  Commission.prototype.approve = async function(approvedBy = null) {
    if (this.status !== 'pending') {
      throw new Error('Commission can only be approved from pending status');
    }

    this.status = 'approved';
    this.approved_at = new Date();
    this.approved_by = approvedBy;

    await this.save();
    return this;
  };

  Commission.prototype.markAsPaid = async function(paymentReference = null, paymentMethod = 'wallet') {
    if (!this.canBePaid()) {
      throw new Error('Commission cannot be paid in current status');
    }

    this.payment_status = 'paid';
    this.paid_at = new Date();
    this.payment_date = new Date();
    this.payment_reference = paymentReference;
    this.payment_method = paymentMethod;

    await this.save();
    return this;
  };

  Commission.prototype.cancel = async function(reason = null) {
    if (this.payment_status === 'paid') {
      throw new Error('Cannot cancel paid commission');
    }

    this.status = 'cancelled';
    this.notes = reason || this.notes;

    await this.save();
    return this;
  };

  Commission.prototype.dispute = async function(reason) {
    this.status = 'disputed';
    this.dispute_reason = reason;

    await this.save();
    return this;
  };

  Commission.prototype.resolveDispute = async function() {
    if (this.status !== 'disputed') {
      throw new Error('Commission is not in disputed status');
    }

    this.status = 'approved';
    this.dispute_resolved_at = new Date();

    await this.save();
    return this;
  };

  Commission.prototype.getAge = function() {
    const now = new Date();
    const created = new Date(this.created_at);
    return Math.floor((now - created) / (1000 * 60 * 60 * 24));
  };

  // Class methods
  Commission.getTotalEarnings = async function(affiliateId, startDate = null, endDate = null) {
    const { Op } = require('sequelize');
    const where = { 
      affiliate_id: affiliateId,
      status: 'approved'
    };

    if (startDate && endDate) {
      where.created_at = {
        [Op.between]: [startDate, endDate]
      };
    }

    const result = await Commission.findOne({
      where,
      attributes: [
        [sequelize.fn('SUM', sequelize.col('commission_amount')), 'total_earned'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'total_commissions']
      ]
    });

    return {
      total_earned: parseFloat(result.getDataValue('total_earned') || 0),
      total_commissions: parseInt(result.getDataValue('total_commissions') || 0)
    };
  };

  Commission.getEarningsByLevel = async function(affiliateId) {
    const results = await Commission.findAll({
      where: { 
        affiliate_id: affiliateId,
        status: 'approved'
      },
      attributes: [
        'level',
        [sequelize.fn('SUM', sequelize.col('commission_amount')), 'total_earned'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'total_commissions'],
        [sequelize.fn('AVG', sequelize.col('commission_rate')), 'avg_rate']
      ],
      group: ['level'],
      order: [['level', 'ASC']]
    });

    return results.map(result => ({
      level: result.level,
      total_earned: parseFloat(result.getDataValue('total_earned')),
      total_commissions: parseInt(result.getDataValue('total_commissions')),
      avg_rate: parseFloat(result.getDataValue('avg_rate'))
    }));
  };

  Commission.getPendingPayments = async function(affiliateId = null) {
    const where = {
      status: 'approved',
      payment_status: 'unpaid'
    };

    if (affiliateId) {
      where.affiliate_id = affiliateId;
    }

    return await Commission.findAll({
      where,
      include: [{
        model: sequelize.models.User,
        as: 'affiliate',
        attributes: ['id', 'first_name', 'last_name', 'email']
      }, {
        model: sequelize.models.Order,
        as: 'order',
        attributes: ['id', 'order_number', 'total_amount']
      }],
      order: [['created_at', 'ASC']]
    });
  };

  Commission.processPayments = async function(paymentMethod = 'wallet') {
    const pendingCommissions = await Commission.getPendingPayments();
    const results = [];

    for (const commission of pendingCommissions) {
      try {
        await commission.markAsPaid(null, paymentMethod);
        results.push({ success: true, commission_id: commission.id });
      } catch (error) {
        results.push({ success: false, commission_id: commission.id, error: error.message });
      }
    }

    return results;
  };

  return Commission;
};