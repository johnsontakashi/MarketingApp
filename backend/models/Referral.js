module.exports = (sequelize, DataTypes) => {
  const Referral = sequelize.define('Referral', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    referrer_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    referred_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    referral_code: {
      type: DataTypes.STRING,
      allowNull: false
    },
    level: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      validate: {
        min: 1,
        max: 10
      }
    },
    status: {
      type: DataTypes.ENUM('pending', 'active', 'completed', 'cancelled'),
      defaultValue: 'pending'
    },
    total_earnings: {
      type: DataTypes.DECIMAL(15, 2),
      defaultValue: 0.00
    },
    total_orders: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    total_spent: {
      type: DataTypes.DECIMAL(15, 2),
      defaultValue: 0.00
    },
    first_purchase_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    last_purchase_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    activated_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    expires_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    commission_rate: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false
    },
    location: {
      type: DataTypes.STRING,
      allowNull: true
    },
    device_info: {
      type: DataTypes.JSON,
      defaultValue: {}
    },
    source: {
      type: DataTypes.ENUM('direct', 'social', 'email', 'sms', 'web', 'mobile'),
      defaultValue: 'mobile'
    },
    conversion_data: {
      type: DataTypes.JSON,
      defaultValue: {}
    },
    metadata: {
      type: DataTypes.JSON,
      defaultValue: {}
    }
  }, {
    tableName: 'referrals',
    indexes: [
      {
        fields: ['referrer_id']
      },
      {
        fields: ['referred_id']
      },
      {
        fields: ['referral_code']
      },
      {
        fields: ['level']
      },
      {
        fields: ['status']
      },
      {
        fields: ['created_at']
      },
      {
        fields: ['activated_at']
      },
      {
        unique: true,
        fields: ['referrer_id', 'referred_id']
      }
    ],
    hooks: {
      beforeCreate: async (referral) => {
        // Set commission rate based on level
        const defaultRates = {
          1: 50.00,
          2: 25.00,
          3: 12.50,
          4: 6.25,
          5: 3.13
        };
        
        if (!referral.commission_rate) {
          referral.commission_rate = defaultRates[referral.level] || 1.00;
        }

        // Set expiration (1 year from creation)
        if (!referral.expires_at) {
          const expiry = new Date();
          expiry.setFullYear(expiry.getFullYear() + 1);
          referral.expires_at = expiry;
        }
      },
      beforeUpdate: (referral) => {
        // Activate referral on first purchase
        if (referral.changed('total_orders') && referral.total_orders === 1 && !referral.activated_at) {
          referral.status = 'active';
          referral.activated_at = new Date();
          referral.first_purchase_at = new Date();
        }

        // Update last purchase time
        if (referral.changed('total_orders') && referral.total_orders > 0) {
          referral.last_purchase_at = new Date();
        }
      }
    }
  });

  // Instance methods
  Referral.prototype.isActive = function() {
    return this.status === 'active' && 
           (!this.expires_at || new Date() < new Date(this.expires_at));
  };

  Referral.prototype.isExpired = function() {
    return this.expires_at && new Date() > new Date(this.expires_at);
  };

  Referral.prototype.getDaysActive = function() {
    if (!this.activated_at) return 0;
    const now = new Date();
    const activated = new Date(this.activated_at);
    return Math.floor((now - activated) / (1000 * 60 * 60 * 24));
  };

  Referral.prototype.getLifetimeValue = function() {
    return parseFloat(this.total_spent);
  };

  Referral.prototype.getAverageOrderValue = function() {
    return this.total_orders > 0 ? parseFloat(this.total_spent) / this.total_orders : 0;
  };

  Referral.prototype.addPurchase = async function(orderAmount) {
    this.total_orders += 1;
    this.total_spent = parseFloat(this.total_spent) + parseFloat(orderAmount);
    
    await this.save();
    return this;
  };

  Referral.prototype.addEarnings = async function(amount) {
    this.total_earnings = parseFloat(this.total_earnings) + parseFloat(amount);
    await this.save();
    return this;
  };

  // Class methods
  Referral.getNetworkTree = async function(userId, maxDepth = 3) {
    const { User } = require('./index');
    
    const buildTree = async (referrerId, currentDepth = 1) => {
      if (currentDepth > maxDepth) return [];
      
      const referrals = await Referral.findAll({
        where: { referrer_id: referrerId },
        include: [{
          model: User,
          as: 'referred',
          attributes: ['id', 'first_name', 'last_name', 'email', 'profile_picture', 'location', 'created_at']
        }],
        order: [['created_at', 'ASC']]
      });

      const tree = [];
      for (const referral of referrals) {
        const children = await buildTree(referral.referred_id, currentDepth + 1);
        tree.push({
          referral: referral.toJSON(),
          children,
          level: currentDepth,
          hasChildren: children.length > 0
        });
      }

      return tree;
    };

    return await buildTree(userId);
  };

  Referral.getNetworkStats = async function(userId) {
    const { Op } = require('sequelize');
    
    // Get all referrals in the network
    const networkReferrals = await Referral.findAll({
      where: { referrer_id: userId },
      include: [{
        model: sequelize.models.User,
        as: 'referred',
        attributes: ['id']
      }]
    });

    // Calculate stats by level
    const statsByLevel = {};
    let totalMembers = 0;
    let totalEarnings = 0;

    for (const referral of networkReferrals) {
      const level = referral.level;
      
      if (!statsByLevel[level]) {
        statsByLevel[level] = {
          level,
          count: 0,
          earnings: 0,
          total_spent: 0,
          commission_rate: referral.commission_rate
        };
      }

      statsByLevel[level].count += 1;
      statsByLevel[level].earnings += parseFloat(referral.total_earnings);
      statsByLevel[level].total_spent += parseFloat(referral.total_spent);
      
      totalMembers += 1;
      totalEarnings += parseFloat(referral.total_earnings);
    }

    return {
      total_members: totalMembers,
      total_earnings: totalEarnings,
      levels: Object.values(statsByLevel),
      network_depth: Math.max(...Object.keys(statsByLevel).map(Number), 0)
    };
  };

  Referral.getTopPerformers = async function(userId, limit = 10) {
    return await Referral.findAll({
      where: { referrer_id: userId },
      include: [{
        model: sequelize.models.User,
        as: 'referred',
        attributes: ['id', 'first_name', 'last_name', 'profile_picture', 'location']
      }],
      order: [['total_spent', 'DESC']],
      limit
    });
  };

  return Referral;
};