module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    username: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true
    },
    password_hash: {
      type: DataTypes.STRING,
      allowNull: false
    },
    first_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true
    },
    gender: {
      type: DataTypes.ENUM('male', 'female', 'other'),
      allowNull: true
    },
    birthday: {
      type: DataTypes.DATE,
      allowNull: true
    },
    account_type: {
      type: DataTypes.ENUM('individual', 'business'),
      defaultValue: 'individual'
    },
    role: {
      type: DataTypes.ENUM('user', 'admin', 'moderator'),
      defaultValue: 'user'
    },
    status: {
      type: DataTypes.ENUM('active', 'suspended', 'banned', 'pending'),
      defaultValue: 'active'
    },
    email_verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    phone_verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    profile_picture: {
      type: DataTypes.STRING,
      allowNull: true
    },
    location: {
      type: DataTypes.STRING,
      allowNull: true
    },
    timezone: {
      type: DataTypes.STRING,
      defaultValue: 'UTC'
    },
    language: {
      type: DataTypes.STRING,
      defaultValue: 'en'
    },
    last_login: {
      type: DataTypes.DATE,
      allowNull: true
    },
    login_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    referral_code: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: true
    },
    referred_by: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'Users',
        key: 'id'
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
    total_referrals: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    commission_rate_level_1: {
      type: DataTypes.DECIMAL(5, 2),
      defaultValue: 50.00 // 50%
    },
    commission_rate_level_2: {
      type: DataTypes.DECIMAL(5, 2),
      defaultValue: 25.00 // 25%
    },
    commission_rate_level_3: {
      type: DataTypes.DECIMAL(5, 2),
      defaultValue: 12.50 // 12.5%
    },
    kyc_status: {
      type: DataTypes.ENUM('pending', 'verified', 'rejected'),
      defaultValue: 'pending'
    },
    kyc_documents: {
      type: DataTypes.JSON,
      defaultValue: {}
    },
    preferences: {
      type: DataTypes.JSON,
      defaultValue: {
        notifications: {
          email: true,
          push: true,
          sms: false
        },
        privacy: {
          show_profile: true,
          show_earnings: false
        }
      }
    },
    metadata: {
      type: DataTypes.JSON,
      defaultValue: {}
    }
  }, {
    tableName: 'users',
    indexes: [
      {
        fields: ['email']
      },
      {
        fields: ['username']
      },
      {
        fields: ['referral_code']
      },
      {
        fields: ['referred_by']
      },
      {
        fields: ['status']
      },
      {
        fields: ['role']
      }
    ],
    hooks: {
      beforeCreate: async (user) => {
        // Generate referral code if not provided
        if (!user.referral_code) {
          const randomCode = Math.random().toString(36).substr(2, 8).toUpperCase();
          user.referral_code = `${user.first_name.substr(0, 2).toUpperCase()}${randomCode}`;
        }
      }
    }
  });

  // Instance methods
  User.prototype.getFullName = function() {
    return `${this.first_name} ${this.last_name}`;
  };

  User.prototype.getPublicProfile = function() {
    return {
      id: this.id,
      username: this.username,
      first_name: this.first_name,
      last_name: this.last_name,
      profile_picture: this.profile_picture,
      location: this.location,
      total_referrals: this.total_referrals,
      created_at: this.created_at
    };
  };

  User.prototype.toJSON = function() {
    const values = { ...this.get() };
    delete values.password_hash;
    return values;
  };

  return User;
};