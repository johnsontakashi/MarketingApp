module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define('Product', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
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
    category_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Categories',
        key: 'id'
      }
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    short_description: {
      type: DataTypes.STRING,
      allowNull: true
    },
    price: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      validate: {
        min: 0
      }
    },
    original_price: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true
    },
    currency: {
      type: DataTypes.STRING,
      defaultValue: 'TLB'
    },
    stock_quantity: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate: {
        min: 0
      }
    },
    sku: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive', 'out_of_stock', 'discontinued'),
      defaultValue: 'active'
    },
    condition: {
      type: DataTypes.ENUM('new', 'used', 'refurbished'),
      defaultValue: 'new'
    },
    brand: {
      type: DataTypes.STRING,
      allowNull: true
    },
    model: {
      type: DataTypes.STRING,
      allowNull: true
    },
    weight: {
      type: DataTypes.DECIMAL(8, 2),
      allowNull: true
    },
    dimensions: {
      type: DataTypes.JSON,
      defaultValue: {}
    },
    images: {
      type: DataTypes.JSON,
      defaultValue: []
    },
    main_image: {
      type: DataTypes.STRING,
      allowNull: true
    },
    features: {
      type: DataTypes.JSON,
      defaultValue: []
    },
    specifications: {
      type: DataTypes.JSON,
      defaultValue: {}
    },
    rating_average: {
      type: DataTypes.DECIMAL(3, 2),
      defaultValue: 0.00,
      validate: {
        min: 0,
        max: 5
      }
    },
    rating_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    review_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    total_sales: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    total_revenue: {
      type: DataTypes.DECIMAL(15, 2),
      defaultValue: 0.00
    },
    views_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    favorites_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    tags: {
      type: DataTypes.JSON,
      defaultValue: []
    },
    support_bonus_enabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    support_bonus_percentage: {
      type: DataTypes.DECIMAL(5, 2),
      defaultValue: 0.00
    },
    installment_enabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    max_installments: {
      type: DataTypes.INTEGER,
      defaultValue: 1
    },
    min_down_payment: {
      type: DataTypes.DECIMAL(5, 2),
      defaultValue: 0.00
    },
    shipping_required: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    shipping_weight: {
      type: DataTypes.DECIMAL(8, 2),
      allowNull: true
    },
    shipping_cost: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.00
    },
    handling_time_days: {
      type: DataTypes.INTEGER,
      defaultValue: 1
    },
    return_policy_days: {
      type: DataTypes.INTEGER,
      defaultValue: 30
    },
    warranty_months: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    is_digital: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    digital_delivery: {
      type: DataTypes.JSON,
      defaultValue: {}
    },
    seo_title: {
      type: DataTypes.STRING,
      allowNull: true
    },
    seo_description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    seo_keywords: {
      type: DataTypes.STRING,
      allowNull: true
    },
    published_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    featured_until: {
      type: DataTypes.DATE,
      allowNull: true
    },
    sale_starts_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    sale_ends_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    metadata: {
      type: DataTypes.JSON,
      defaultValue: {}
    }
  }, {
    tableName: 'products',
    indexes: [
      {
        fields: ['seller_id']
      },
      {
        fields: ['category_id']
      },
      {
        fields: ['status']
      },
      {
        fields: ['condition']
      },
      {
        fields: ['price']
      },
      {
        fields: ['rating_average']
      },
      {
        fields: ['total_sales']
      },
      {
        fields: ['created_at']
      },
      {
        fields: ['published_at']
      },
      {
        fields: ['support_bonus_enabled']
      },
      {
        fields: ['installment_enabled']
      },
      {
        name: 'product_search_idx',
        fields: ['name', 'description'],
        type: 'FULLTEXT'
      }
    ],
    hooks: {
      beforeCreate: async (product) => {
        // Generate SKU if not provided
        if (!product.sku) {
          const timestamp = Date.now().toString().slice(-6);
          const random = Math.random().toString(36).substr(2, 4).toUpperCase();
          product.sku = `SKU-${timestamp}-${random}`;
        }

        // Set published_at if status is active
        if (product.status === 'active' && !product.published_at) {
          product.published_at = new Date();
        }
      },
      beforeUpdate: (product) => {
        // Update published_at when status changes to active
        if (product.changed('status') && product.status === 'active' && !product.published_at) {
          product.published_at = new Date();
        }
      }
    }
  });

  // Instance methods
  Product.prototype.isOnSale = function() {
    const now = new Date();
    return this.sale_starts_at && this.sale_ends_at && 
           now >= this.sale_starts_at && now <= this.sale_ends_at;
  };

  Product.prototype.getCurrentPrice = function() {
    return this.isOnSale() && this.original_price ? this.price : this.price;
  };

  Product.prototype.getDiscountPercentage = function() {
    if (!this.isOnSale() || !this.original_price) return 0;
    return Math.round(((this.original_price - this.price) / this.original_price) * 100);
  };

  Product.prototype.isInStock = function() {
    return this.stock_quantity > 0 || this.is_digital;
  };

  Product.prototype.canPurchase = function() {
    return this.status === 'active' && this.isInStock();
  };

  Product.prototype.addView = async function() {
    this.views_count = parseInt(this.views_count) + 1;
    await this.save(['views_count']);
    return this;
  };

  Product.prototype.updateRating = async function(newRating) {
    const currentTotal = this.rating_average * this.rating_count;
    const newTotal = currentTotal + newRating;
    this.rating_count += 1;
    this.rating_average = (newTotal / this.rating_count).toFixed(2);
    await this.save(['rating_average', 'rating_count']);
    return this;
  };

  Product.prototype.addSale = async function(quantity = 1, amount = null) {
    this.total_sales += quantity;
    this.stock_quantity = Math.max(0, this.stock_quantity - quantity);
    
    if (amount) {
      this.total_revenue = parseFloat(this.total_revenue) + parseFloat(amount);
    }
    
    await this.save(['total_sales', 'stock_quantity', 'total_revenue']);
    return this;
  };

  Product.prototype.getInstallmentOptions = function() {
    if (!this.installment_enabled) return null;
    
    const options = [];
    const basePrice = parseFloat(this.price);
    const minDownPayment = (basePrice * parseFloat(this.min_down_payment)) / 100;
    
    for (let installments = 2; installments <= this.max_installments; installments++) {
      const monthlyPayment = (basePrice - minDownPayment) / (installments - 1);
      options.push({
        installments,
        down_payment: minDownPayment,
        monthly_payment: monthlyPayment,
        total_amount: basePrice
      });
    }
    
    return options;
  };

  return Product;
};