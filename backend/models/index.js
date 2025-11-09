const { sequelize } = require('../config/database');
const { DataTypes } = require('sequelize');

// Import all models
const User = require('./User')(sequelize, DataTypes);
const Device = require('./Device')(sequelize, DataTypes);
const Product = require('./Product')(sequelize, DataTypes);
const Category = require('./Category')(sequelize, DataTypes);
const Order = require('./Order')(sequelize, DataTypes);
const Payment = require('./Payment')(sequelize, DataTypes);
const Wallet = require('./Wallet')(sequelize, DataTypes);
const Transaction = require('./Transaction')(sequelize, DataTypes);
const Commission = require('./Commission')(sequelize, DataTypes);
const Bonus = require('./Bonus')(sequelize, DataTypes);
const Referral = require('./Referral')(sequelize, DataTypes);
const Review = require('./Review')(sequelize, DataTypes);
const MDMEvent = require('./MDMEvent')(sequelize, DataTypes);
const Notification = require('./Notification')(sequelize, DataTypes);

// Define associations
const setupAssociations = () => {
  // User associations
  User.hasOne(Wallet, { foreignKey: 'user_id', as: 'wallet' });
  User.hasMany(Device, { foreignKey: 'user_id', as: 'devices' });
  User.hasMany(Product, { foreignKey: 'seller_id', as: 'products' });
  User.hasMany(Order, { foreignKey: 'buyer_id', as: 'purchases' });
  User.hasMany(Order, { foreignKey: 'seller_id', as: 'sales' });
  User.hasMany(Transaction, { foreignKey: 'user_id', as: 'transactions' });
  User.hasMany(Commission, { foreignKey: 'affiliate_id', as: 'commissions' });
  User.hasMany(Bonus, { foreignKey: 'recipient_id', as: 'bonuses' });
  User.hasMany(Referral, { foreignKey: 'referrer_id', as: 'referrals' });
  User.hasMany(Review, { foreignKey: 'user_id', as: 'reviews' });
  User.hasMany(Notification, { foreignKey: 'user_id', as: 'notifications' });

  // Wallet associations
  Wallet.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
  Wallet.hasMany(Transaction, { foreignKey: 'wallet_id', as: 'transactions' });

  // Device associations
  Device.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
  Device.hasMany(MDMEvent, { foreignKey: 'device_id', as: 'mdmEvents' });

  // Category associations
  Category.hasMany(Product, { foreignKey: 'category_id', as: 'products' });

  // Product associations
  Product.belongsTo(User, { foreignKey: 'seller_id', as: 'seller' });
  Product.belongsTo(Category, { foreignKey: 'category_id', as: 'category' });
  Product.hasMany(Order, { foreignKey: 'product_id', as: 'orders' });
  Product.hasMany(Review, { foreignKey: 'product_id', as: 'reviews' });

  // Order associations
  Order.belongsTo(User, { foreignKey: 'buyer_id', as: 'buyer' });
  Order.belongsTo(User, { foreignKey: 'seller_id', as: 'seller' });
  Order.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });
  Order.hasMany(Payment, { foreignKey: 'order_id', as: 'payments' });
  Order.hasMany(Commission, { foreignKey: 'order_id', as: 'commissions' });

  // Payment associations
  Payment.belongsTo(Order, { foreignKey: 'order_id', as: 'order' });
  Payment.belongsTo(User, { foreignKey: 'payer_id', as: 'payer' });

  // Transaction associations
  Transaction.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
  Transaction.belongsTo(Wallet, { foreignKey: 'wallet_id', as: 'wallet' });

  // Commission associations
  Commission.belongsTo(User, { foreignKey: 'affiliate_id', as: 'affiliate' });
  Commission.belongsTo(Order, { foreignKey: 'order_id', as: 'order' });

  // Bonus associations
  Bonus.belongsTo(User, { foreignKey: 'recipient_id', as: 'recipient' });
  Bonus.belongsTo(User, { foreignKey: 'giver_id', as: 'giver', allowNull: true });
  Bonus.belongsTo(Order, { foreignKey: 'source_order_id', as: 'sourceOrder', allowNull: true });

  // Referral associations
  Referral.belongsTo(User, { foreignKey: 'referrer_id', as: 'referrer' });
  Referral.belongsTo(User, { foreignKey: 'referred_id', as: 'referred' });

  // Review associations
  Review.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
  Review.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });
  Review.belongsTo(Order, { foreignKey: 'order_id', as: 'order' });

  // MDM Event associations
  MDMEvent.belongsTo(Device, { foreignKey: 'device_id', as: 'device' });

  // Notification associations
  Notification.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

  // Self-referencing for User referral hierarchy
  User.belongsTo(User, { foreignKey: 'referred_by', as: 'referrer', allowNull: true });
  User.hasMany(User, { foreignKey: 'referred_by', as: 'referredUsers' });
};

setupAssociations();

// Sync models in correct order
const syncModels = async (force = false) => {
  try {
    await sequelize.sync({ force });
    console.log('✅ All models synchronized successfully');
  } catch (error) {
    console.error('❌ Error synchronizing models:', error);
    throw error;
  }
};

module.exports = {
  sequelize,
  User,
  Device,
  Product,
  Category,
  Order,
  Payment,
  Wallet,
  Transaction,
  Commission,
  Bonus,
  Referral,
  Review,
  MDMEvent,
  Notification,
  syncModels
};