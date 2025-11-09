module.exports = (sequelize, DataTypes) => {
  const Review = sequelize.define('Review', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
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
    product_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Products',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    order_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'Orders',
        key: 'id'
      },
      onDelete: 'SET NULL'
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: { min: 1, max: 5 }
    },
    title: {
      type: DataTypes.STRING,
      allowNull: true
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    verified_purchase: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    helpful_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    status: {
      type: DataTypes.ENUM('pending', 'approved', 'rejected'),
      defaultValue: 'approved'
    }
  }, {
    tableName: 'reviews',
    indexes: [
      { fields: ['user_id'] },
      { fields: ['product_id'] },
      { fields: ['order_id'] },
      { fields: ['rating'] },
      { fields: ['status'] }
    ]
  });

  return Review;
};