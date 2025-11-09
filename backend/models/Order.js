module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define('Order', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    order_number: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    buyer_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    seller_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    product_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Products',
        key: 'id'
      }
    },
    quantity: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
      validate: {
        min: 1
      }
    },
    unit_price: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false
    },
    total_amount: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false
    },
    discount_amount: {
      type: DataTypes.DECIMAL(15, 2),
      defaultValue: 0.00
    },
    tax_amount: {
      type: DataTypes.DECIMAL(15, 2),
      defaultValue: 0.00
    },
    shipping_amount: {
      type: DataTypes.DECIMAL(15, 2),
      defaultValue: 0.00
    },
    final_amount: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false
    },
    currency: {
      type: DataTypes.STRING,
      defaultValue: 'TLB'
    },
    status: {
      type: DataTypes.ENUM(
        'pending', 'confirmed', 'processing', 'shipped', 'delivered', 
        'completed', 'cancelled', 'refunded', 'disputed'
      ),
      defaultValue: 'pending'
    },
    payment_status: {
      type: DataTypes.ENUM('pending', 'partial', 'paid', 'failed', 'refunded'),
      defaultValue: 'pending'
    },
    payment_method: {
      type: DataTypes.ENUM('wallet', 'installment', 'support_bonus'),
      defaultValue: 'wallet'
    },
    is_installment: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    installment_plan: {
      type: DataTypes.JSON,
      defaultValue: {}
    },
    installments_paid: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    total_installments: {
      type: DataTypes.INTEGER,
      defaultValue: 1
    },
    next_payment_due: {
      type: DataTypes.DATE,
      allowNull: true
    },
    next_payment_amount: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true
    },
    support_bonus_enabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    support_bonus_percentage: {
      type: DataTypes.DECIMAL(5, 2),
      defaultValue: 0.00
    },
    support_bonus_amount: {
      type: DataTypes.DECIMAL(15, 2),
      defaultValue: 0.00
    },
    commission_rate: {
      type: DataTypes.DECIMAL(5, 2),
      defaultValue: 5.00
    },
    commission_amount: {
      type: DataTypes.DECIMAL(15, 2),
      defaultValue: 0.00
    },
    tracking_number: {
      type: DataTypes.STRING,
      allowNull: true
    },
    shipping_carrier: {
      type: DataTypes.STRING,
      allowNull: true
    },
    estimated_delivery: {
      type: DataTypes.DATE,
      allowNull: true
    },
    delivered_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    shipping_address: {
      type: DataTypes.JSON,
      defaultValue: {}
    },
    billing_address: {
      type: DataTypes.JSON,
      defaultValue: {}
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    buyer_notes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    seller_notes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    admin_notes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    return_requested: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    return_reason: {
      type: DataTypes.STRING,
      allowNull: true
    },
    return_status: {
      type: DataTypes.ENUM('none', 'requested', 'approved', 'denied', 'completed'),
      defaultValue: 'none'
    },
    warranty_start: {
      type: DataTypes.DATE,
      allowNull: true
    },
    warranty_end: {
      type: DataTypes.DATE,
      allowNull: true
    },
    is_gift: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    gift_message: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    gift_recipient: {
      type: DataTypes.JSON,
      defaultValue: {}
    },
    priority: {
      type: DataTypes.ENUM('low', 'normal', 'high', 'urgent'),
      defaultValue: 'normal'
    },
    source: {
      type: DataTypes.ENUM('web', 'mobile', 'api'),
      defaultValue: 'mobile'
    },
    device_info: {
      type: DataTypes.JSON,
      defaultValue: {}
    },
    ip_address: {
      type: DataTypes.STRING,
      allowNull: true
    },
    user_agent: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    confirmed_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    shipped_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    completed_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    cancelled_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    cancellation_reason: {
      type: DataTypes.STRING,
      allowNull: true
    },
    metadata: {
      type: DataTypes.JSON,
      defaultValue: {}
    }
  }, {
    tableName: 'orders',
    indexes: [
      {
        fields: ['order_number']
      },
      {
        fields: ['buyer_id']
      },
      {
        fields: ['seller_id']
      },
      {
        fields: ['product_id']
      },
      {
        fields: ['status']
      },
      {
        fields: ['payment_status']
      },
      {
        fields: ['payment_method']
      },
      {
        fields: ['is_installment']
      },
      {
        fields: ['support_bonus_enabled']
      },
      {
        fields: ['next_payment_due']
      },
      {
        fields: ['created_at']
      },
      {
        fields: ['confirmed_at']
      },
      {
        fields: ['completed_at']
      }
    ],
    hooks: {
      beforeCreate: async (order) => {
        // Generate order number
        if (!order.order_number) {
          const date = new Date();
          const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
          const timestamp = Date.now().toString().slice(-6);
          order.order_number = `TLB${dateStr}${timestamp}`;
        }

        // Calculate final amount
        order.final_amount = parseFloat(order.total_amount) + 
                           parseFloat(order.tax_amount) + 
                           parseFloat(order.shipping_amount) - 
                           parseFloat(order.discount_amount);

        // Calculate commission
        order.commission_amount = (parseFloat(order.total_amount) * parseFloat(order.commission_rate)) / 100;

        // Set up installment plan if needed
        if (order.is_installment && order.installment_plan && Object.keys(order.installment_plan).length > 0) {
          const plan = order.installment_plan;
          order.total_installments = plan.installments || 1;
          order.next_payment_amount = plan.monthly_payment || order.final_amount;
          
          // Set next payment due date (30 days from now for first payment)
          const nextDue = new Date();
          nextDue.setDate(nextDue.getDate() + 30);
          order.next_payment_due = nextDue;
        }

        // Calculate support bonus
        if (order.support_bonus_enabled && order.support_bonus_percentage > 0) {
          order.support_bonus_amount = (parseFloat(order.total_amount) * parseFloat(order.support_bonus_percentage)) / 100;
        }
      },
      beforeUpdate: (order) => {
        // Set timestamps based on status changes
        if (order.changed('status')) {
          const now = new Date();
          
          switch (order.status) {
            case 'confirmed':
              if (!order.confirmed_at) order.confirmed_at = now;
              break;
            case 'shipped':
              if (!order.shipped_at) order.shipped_at = now;
              break;
            case 'completed':
              if (!order.completed_at) order.completed_at = now;
              break;
            case 'cancelled':
              if (!order.cancelled_at) order.cancelled_at = now;
              break;
          }
        }

        // Set delivery timestamp
        if (order.changed('status') && order.status === 'delivered' && !order.delivered_at) {
          order.delivered_at = new Date();
        }

        // Set warranty dates when delivered
        if (order.changed('status') && order.status === 'delivered') {
          order.warranty_start = new Date();
          // Warranty end is set based on product warranty months (would need product data)
        }
      }
    }
  });

  // Instance methods
  Order.prototype.isOverdue = function() {
    if (!this.is_installment || !this.next_payment_due) return false;
    return new Date() > new Date(this.next_payment_due);
  };

  Order.prototype.getDaysOverdue = function() {
    if (!this.isOverdue()) return 0;
    const now = new Date();
    const due = new Date(this.next_payment_due);
    return Math.floor((now - due) / (1000 * 60 * 60 * 24));
  };

  Order.prototype.getRemainingBalance = function() {
    const paid = this.installments_paid * parseFloat(this.next_payment_amount || 0);
    return parseFloat(this.final_amount) - paid;
  };

  Order.prototype.getNextPaymentInfo = function() {
    if (!this.is_installment) return null;
    
    return {
      amount: this.next_payment_amount,
      due_date: this.next_payment_due,
      installment_number: this.installments_paid + 1,
      total_installments: this.total_installments,
      remaining_balance: this.getRemainingBalance(),
      is_overdue: this.isOverdue(),
      days_overdue: this.getDaysOverdue()
    };
  };

  Order.prototype.makePayment = async function(amount) {
    if (!this.is_installment) {
      throw new Error('This order is not set up for installment payments');
    }

    const paymentAmount = parseFloat(amount);
    const expectedAmount = parseFloat(this.next_payment_amount);

    if (paymentAmount < expectedAmount) {
      throw new Error('Payment amount is less than required installment amount');
    }

    this.installments_paid += 1;
    
    // Check if this was the final payment
    if (this.installments_paid >= this.total_installments) {
      this.payment_status = 'paid';
      this.next_payment_due = null;
      this.next_payment_amount = null;
      
      // If order is not yet completed, mark as completed
      if (this.status === 'pending' || this.status === 'processing') {
        this.status = 'completed';
        this.completed_at = new Date();
      }
    } else {
      // Set next payment due date (30 days from now)
      const nextDue = new Date();
      nextDue.setDate(nextDue.getDate() + 30);
      this.next_payment_due = nextDue;
      this.payment_status = 'partial';
    }

    await this.save();
    return this;
  };

  Order.prototype.canCancel = function() {
    const cancellableStatuses = ['pending', 'confirmed'];
    return cancellableStatuses.includes(this.status);
  };

  Order.prototype.canReturn = function() {
    const returnableStatuses = ['delivered', 'completed'];
    if (!returnableStatuses.includes(this.status)) return false;
    
    // Check if within return window (30 days by default)
    if (this.delivered_at) {
      const daysSinceDelivery = Math.floor((new Date() - new Date(this.delivered_at)) / (1000 * 60 * 60 * 24));
      return daysSinceDelivery <= 30; // This could be configurable per product
    }
    
    return false;
  };

  Order.prototype.getTrackingInfo = function() {
    if (!this.tracking_number) return null;
    
    return {
      tracking_number: this.tracking_number,
      carrier: this.shipping_carrier,
      estimated_delivery: this.estimated_delivery,
      shipped_at: this.shipped_at,
      delivered_at: this.delivered_at,
      status: this.status
    };
  };

  return Order;
};