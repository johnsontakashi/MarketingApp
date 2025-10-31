-- TLB Diamond Marketplace Database Schema
-- PostgreSQL implementation with comprehensive indexing and constraints

-- =====================================================
-- ENUMS AND CUSTOM TYPES
-- =====================================================

CREATE TYPE user_type AS ENUM ('buyer', 'seller', 'affiliate', 'admin');
CREATE TYPE kyc_status AS ENUM ('pending', 'verified', 'rejected', 'expired');
CREATE TYPE order_status AS ENUM ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'dispute');
CREATE TYPE payment_status AS ENUM ('pending', 'partial', 'completed', 'failed', 'refunded', 'defaulted');
CREATE TYPE payment_type AS ENUM ('upfront', 'installment', 'support_bonus', 'commission', 'bonus', 'refund');
CREATE TYPE bonus_type AS ENUM ('daily', 'birthday', 'referral', 'gift_of_legacy', 'support', 'milestone', 'promotional');
CREATE TYPE commission_status AS ENUM ('pending', 'approved', 'paid', 'cancelled');
CREATE TYPE device_status AS ENUM ('active', 'locked', 'grace_period', 'violated', 'retired');
CREATE TYPE violation_type AS ENUM ('root_detected', 'uninstall_attempt', 'factory_reset', 'debugging', 'tamper_detected');

-- =====================================================
-- CORE USER MANAGEMENT
-- =====================================================

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    phone VARCHAR(20) UNIQUE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    birth_date DATE,
    is_minor BOOLEAN DEFAULT false,
    user_type user_type DEFAULT 'buyer',
    kyc_status kyc_status DEFAULT 'pending',
    kyc_documents JSONB,
    referral_code VARCHAR(10) UNIQUE,
    referred_by UUID REFERENCES users(id),
    profile_image_url VARCHAR(500),
    bio TEXT,
    location_country VARCHAR(3), -- ISO country code
    location_city VARCHAR(100),
    is_active BOOLEAN DEFAULT true,
    email_verified_at TIMESTAMP,
    phone_verified_at TIMESTAMP,
    last_login_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User settings and preferences
CREATE TABLE user_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    notifications_enabled BOOLEAN DEFAULT true,
    email_notifications BOOLEAN DEFAULT true,
    sms_notifications BOOLEAN DEFAULT false,
    marketing_emails BOOLEAN DEFAULT false,
    two_factor_enabled BOOLEAN DEFAULT false,
    preferred_language VARCHAR(5) DEFAULT 'en',
    preferred_currency VARCHAR(3) DEFAULT 'TLB',
    privacy_level INTEGER DEFAULT 1, -- 1=public, 2=friends, 3=private
    auto_lock_consent BOOLEAN DEFAULT false,
    grace_period_preferences JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- DEVICE MANAGEMENT & MDM
-- =====================================================

CREATE TABLE devices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    device_fingerprint VARCHAR(255) UNIQUE NOT NULL,
    device_name VARCHAR(100),
    model VARCHAR(100),
    manufacturer VARCHAR(50),
    os_type VARCHAR(20) NOT NULL, -- 'android', 'ios'
    os_version VARCHAR(20),
    app_version VARCHAR(20),
    device_status device_status DEFAULT 'active',
    is_rooted BOOLEAN DEFAULT false,
    is_emulator BOOLEAN DEFAULT false,
    
    -- MDM Lock Management
    is_locked BOOLEAN DEFAULT false,
    lock_reason TEXT,
    locked_at TIMESTAMP,
    unlock_requested_at TIMESTAMP,
    grace_period_start TIMESTAMP,
    grace_period_end TIMESTAMP,
    grace_period_hours INTEGER DEFAULT 100,
    unlock_attempts INTEGER DEFAULT 0,
    max_unlock_attempts INTEGER DEFAULT 3,
    
    -- Device Health & Security
    last_heartbeat TIMESTAMP,
    security_patch_level VARCHAR(20),
    certificate_fingerprint VARCHAR(255),
    tamper_detection_enabled BOOLEAN DEFAULT true,
    remote_wipe_enabled BOOLEAN DEFAULT false,
    
    -- Geolocation (for compliance)
    last_known_latitude DECIMAL(10, 8),
    last_known_longitude DECIMAL(11, 8),
    last_location_update TIMESTAMP,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Device violation logs
CREATE TABLE device_violations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    device_id UUID REFERENCES devices(id) ON DELETE CASCADE,
    violation_type violation_type NOT NULL,
    severity_level INTEGER DEFAULT 1, -- 1=low, 2=medium, 3=high, 4=critical
    description TEXT,
    evidence_data JSONB, -- Screenshots, logs, etc.
    auto_detected BOOLEAN DEFAULT true,
    resolved BOOLEAN DEFAULT false,
    resolved_by UUID REFERENCES users(id),
    resolved_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- MARKETPLACE SYSTEM
-- =====================================================

CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    parent_id UUID REFERENCES categories(id),
    image_url VARCHAR(500),
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    seller_id UUID REFERENCES users(id) ON DELETE CASCADE,
    category_id UUID REFERENCES categories(id),
    title VARCHAR(200) NOT NULL,
    description TEXT,
    short_description VARCHAR(500),
    price_tlb DECIMAL(15,2) NOT NULL CHECK (price_tlb > 0),
    original_price_tlb DECIMAL(15,2), -- For discounts
    cost_price_tlb DECIMAL(15,2), -- For seller tracking
    
    -- Inventory Management
    sku VARCHAR(100) UNIQUE,
    stock_quantity INTEGER DEFAULT 0,
    min_stock_alert INTEGER DEFAULT 5,
    max_order_quantity INTEGER DEFAULT 10,
    
    -- Support Bonus Eligibility
    is_support_bonus_eligible BOOLEAN DEFAULT true,
    support_bonus_percentage DECIMAL(5,2) DEFAULT 50.00, -- 50% default
    installment_options JSONB, -- {periods: [2,3,4], min_amount: 10}
    
    -- Product Attributes
    weight_kg DECIMAL(8,3),
    dimensions JSONB, -- {length, width, height}
    digital_product BOOLEAN DEFAULT false,
    shipping_required BOOLEAN DEFAULT true,
    
    -- Status and Visibility
    status VARCHAR(20) DEFAULT 'draft', -- draft, active, sold, inactive, banned
    featured BOOLEAN DEFAULT false,
    total_sales INTEGER DEFAULT 0,
    rating_average DECIMAL(3,2) DEFAULT 0,
    rating_count INTEGER DEFAULT 0,
    
    -- SEO and Media
    meta_title VARCHAR(200),
    meta_description VARCHAR(500),
    tags TEXT[], -- Array of tags
    images JSONB, -- Array of image URLs
    videos JSONB, -- Array of video URLs
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- ORDER MANAGEMENT SYSTEM
-- =====================================================

CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number VARCHAR(20) UNIQUE NOT NULL, -- Human-readable order ID
    buyer_id UUID REFERENCES users(id) ON DELETE RESTRICT,
    seller_id UUID REFERENCES users(id) ON DELETE RESTRICT,
    
    -- Order Totals
    subtotal_tlb DECIMAL(15,2) NOT NULL,
    shipping_tlb DECIMAL(15,2) DEFAULT 0,
    tax_tlb DECIMAL(15,2) DEFAULT 0,
    discount_tlb DECIMAL(15,2) DEFAULT 0,
    total_amount_tlb DECIMAL(15,2) NOT NULL,
    
    -- Payment Plan Details
    upfront_amount_tlb DECIMAL(15,2) NOT NULL,
    support_bonus_amount_tlb DECIMAL(15,2) DEFAULT 0,
    remaining_amount_tlb DECIMAL(15,2) DEFAULT 0,
    installment_plan JSONB, -- {periods: 4, amount_per_period: 25.00, frequency: 'biweekly'}
    
    -- Status Tracking
    order_status order_status DEFAULT 'pending',
    payment_status payment_status DEFAULT 'pending',
    fulfillment_status VARCHAR(20) DEFAULT 'pending', -- pending, processing, shipped, delivered
    
    -- Shipping Information
    shipping_address JSONB, -- Full address object
    billing_address JSONB,
    shipping_method VARCHAR(50),
    tracking_number VARCHAR(100),
    shipped_at TIMESTAMP,
    delivered_at TIMESTAMP,
    
    -- Support Bonus Tracking
    support_bonus_activated BOOLEAN DEFAULT false,
    support_bonus_activated_at TIMESTAMP,
    device_locked_for_order BOOLEAN DEFAULT false,
    
    -- Order Metadata
    notes TEXT,
    internal_notes TEXT, -- Admin only
    cancellation_reason TEXT,
    refund_reason TEXT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Order line items (for multiple products per order)
CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE RESTRICT,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_price_tlb DECIMAL(15,2) NOT NULL,
    total_price_tlb DECIMAL(15,2) NOT NULL,
    product_snapshot JSONB, -- Store product details at time of order
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- PAYMENT & WALLET SYSTEM
-- =====================================================

CREATE TABLE wallets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
    wallet_address VARCHAR(255) UNIQUE, -- Blockchain address if applicable
    
    -- Balance Management
    balance_available DECIMAL(15,2) DEFAULT 0 CHECK (balance_available >= 0),
    balance_locked DECIMAL(15,2) DEFAULT 0 CHECK (balance_locked >= 0),
    balance_pending DECIMAL(15,2) DEFAULT 0 CHECK (balance_pending >= 0),
    
    -- Lifetime Statistics
    lifetime_earned DECIMAL(15,2) DEFAULT 0,
    lifetime_spent DECIMAL(15,2) DEFAULT 0,
    lifetime_withdrawn DECIMAL(15,2) DEFAULT 0,
    
    -- Security
    pin_hash VARCHAR(255), -- For wallet PIN
    two_factor_required BOOLEAN DEFAULT false,
    daily_limit_tlb DECIMAL(15,2) DEFAULT 1000,
    monthly_limit_tlb DECIMAL(15,2) DEFAULT 10000,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    transaction_hash VARCHAR(255) UNIQUE, -- Blockchain hash if applicable
    from_wallet_id UUID REFERENCES wallets(id),
    to_wallet_id UUID REFERENCES wallets(id),
    
    -- Transaction Details
    amount_tlb DECIMAL(15,2) NOT NULL CHECK (amount_tlb > 0),
    fee_tlb DECIMAL(15,2) DEFAULT 0,
    transaction_type payment_type NOT NULL,
    
    -- References
    order_id UUID REFERENCES orders(id),
    payment_id UUID, -- Reference to external payment processor
    bonus_id UUID, -- Will reference bonuses table
    commission_id UUID, -- Will reference commissions table
    
    -- Status and Processing
    status VARCHAR(20) DEFAULT 'pending', -- pending, confirmed, failed, cancelled
    confirmation_count INTEGER DEFAULT 0,
    requires_confirmations INTEGER DEFAULT 1,
    
    -- Metadata
    description TEXT,
    metadata JSONB, -- Additional transaction data
    processed_by VARCHAR(50), -- system, admin, auto
    
    -- Blockchain Integration (if applicable)
    block_number BIGINT,
    block_hash VARCHAR(255),
    gas_used BIGINT,
    gas_price DECIMAL(20,8),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    confirmed_at TIMESTAMP
);

-- Payment schedules for installments
CREATE TABLE payment_schedules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    buyer_id UUID REFERENCES users(id) ON DELETE RESTRICT,
    installment_number INTEGER NOT NULL,
    amount_tlb DECIMAL(15,2) NOT NULL,
    due_date DATE NOT NULL,
    paid_amount_tlb DECIMAL(15,2) DEFAULT 0,
    status VARCHAR(20) DEFAULT 'pending', -- pending, paid, overdue, cancelled
    paid_at TIMESTAMP,
    grace_period_end TIMESTAMP,
    reminder_sent_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- COMMUNITY & AFFILIATE SYSTEM
-- =====================================================

CREATE TABLE affiliate_networks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    root_user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    network_name VARCHAR(100),
    max_generations INTEGER DEFAULT 10,
    total_members INTEGER DEFAULT 1,
    total_volume_tlb DECIMAL(15,2) DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE affiliate_relationships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    network_id UUID REFERENCES affiliate_networks(id),
    parent_id UUID REFERENCES users(id),
    child_id UUID REFERENCES users(id),
    generation_level INTEGER NOT NULL CHECK (generation_level > 0),
    relationship_type VARCHAR(20) DEFAULT 'direct', -- direct, indirect
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(parent_id, child_id)
);

CREATE TABLE commissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    affiliate_id UUID REFERENCES users(id) ON DELETE CASCADE,
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    transaction_id UUID REFERENCES transactions(id),
    
    -- Commission Details
    generation_level INTEGER NOT NULL CHECK (generation_level > 0),
    commission_rate DECIMAL(5,4) NOT NULL, -- e.g., 0.0001 for $0.01 per $100
    base_amount_tlb DECIMAL(15,2) NOT NULL,
    commission_amount_tlb DECIMAL(15,2) NOT NULL,
    
    -- Processing Status
    status commission_status DEFAULT 'pending',
    approved_by UUID REFERENCES users(id),
    approved_at TIMESTAMP,
    paid_at TIMESTAMP,
    
    -- Metadata
    commission_type VARCHAR(20) DEFAULT 'transaction', -- transaction, signup, milestone
    notes TEXT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE bonuses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recipient_id UUID REFERENCES users(id) ON DELETE CASCADE,
    giver_id UUID REFERENCES users(id), -- NULL for system bonuses
    bonus_type bonus_type NOT NULL,
    
    -- Bonus Details
    amount_tlb DECIMAL(15,2) NOT NULL CHECK (amount_tlb > 0),
    title VARCHAR(200),
    description TEXT,
    
    -- Eligibility and Conditions
    conditions JSONB, -- Rules for bonus eligibility
    min_activity_score INTEGER,
    requires_device_lock BOOLEAN DEFAULT false,
    
    -- References
    source_order_id UUID REFERENCES orders(id),
    source_transaction_id UUID REFERENCES transactions(id),
    
    -- Status and Timing
    status VARCHAR(20) DEFAULT 'pending', -- pending, available, claimed, expired, cancelled
    available_at TIMESTAMP,
    expires_at TIMESTAMP,
    claimed_at TIMESTAMP,
    
    -- Special Bonus Features
    is_transferable BOOLEAN DEFAULT true,
    is_one_time BOOLEAN DEFAULT true,
    max_claims INTEGER DEFAULT 1,
    current_claims INTEGER DEFAULT 0,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Gift of Legacy system
CREATE TABLE legacy_gifts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    giver_id UUID REFERENCES users(id) ON DELETE CASCADE,
    receiver_id UUID REFERENCES users(id),
    amount_tlb DECIMAL(15,2) NOT NULL,
    probability_weight DECIMAL(5,4) DEFAULT 1.0000, -- For random selection
    message TEXT,
    conditions JSONB, -- Conditions for receiving the gift
    status VARCHAR(20) DEFAULT 'active', -- active, claimed, expired, cancelled
    claimed_at TIMESTAMP,
    expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- ANALYTICS AND REPORTING
-- =====================================================

CREATE TABLE user_activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    device_id UUID REFERENCES devices(id),
    activity_type VARCHAR(50) NOT NULL,
    activity_data JSONB,
    ip_address INET,
    user_agent TEXT,
    session_id VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE system_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    metric_name VARCHAR(100) NOT NULL,
    metric_value DECIMAL(15,4),
    metric_type VARCHAR(20) DEFAULT 'counter', -- counter, gauge, histogram
    tags JSONB, -- Additional metadata
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- NOTIFICATIONS AND MESSAGING
-- =====================================================

CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    notification_type VARCHAR(50) NOT NULL, -- payment, order, bonus, security, marketing
    priority INTEGER DEFAULT 1, -- 1=low, 2=normal, 3=high, 4=urgent
    
    -- Delivery Channels
    push_notification BOOLEAN DEFAULT true,
    email_notification BOOLEAN DEFAULT false,
    sms_notification BOOLEAN DEFAULT false,
    in_app_notification BOOLEAN DEFAULT true,
    
    -- Status
    is_read BOOLEAN DEFAULT false,
    read_at TIMESTAMP,
    sent_at TIMESTAMP,
    delivery_status JSONB, -- Track delivery across channels
    
    -- References
    reference_id UUID, -- Generic reference to orders, payments, etc.
    reference_type VARCHAR(50), -- order, payment, bonus, etc.
    
    -- Action Buttons
    action_buttons JSONB, -- {buttons: [{text: "View Order", action: "view_order", url: "/orders/123"}]}
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- User indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_referral_code ON users(referral_code);
CREATE INDEX idx_users_type_status ON users(user_type, kyc_status);
CREATE INDEX idx_users_referred_by ON users(referred_by);

-- Device indexes
CREATE INDEX idx_devices_user_id ON devices(user_id);
CREATE INDEX idx_devices_status ON devices(device_status);
CREATE INDEX idx_devices_fingerprint ON devices(device_fingerprint);
CREATE INDEX idx_devices_locked ON devices(is_locked, locked_at);

-- Product indexes
CREATE INDEX idx_products_seller ON products(seller_id);
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_products_price ON products(price_tlb);
CREATE INDEX idx_products_featured ON products(featured);

-- Order indexes
CREATE INDEX idx_orders_buyer ON orders(buyer_id);
CREATE INDEX idx_orders_seller ON orders(seller_id);
CREATE INDEX idx_orders_status ON orders(order_status);
CREATE INDEX idx_orders_payment_status ON orders(payment_status);
CREATE INDEX idx_orders_created ON orders(created_at);

-- Transaction indexes
CREATE INDEX idx_transactions_from_wallet ON transactions(from_wallet_id);
CREATE INDEX idx_transactions_to_wallet ON transactions(to_wallet_id);
CREATE INDEX idx_transactions_type ON transactions(transaction_type);
CREATE INDEX idx_transactions_status ON transactions(status);
CREATE INDEX idx_transactions_order ON transactions(order_id);

-- Commission indexes
CREATE INDEX idx_commissions_affiliate ON commissions(affiliate_id);
CREATE INDEX idx_commissions_order ON commissions(order_id);
CREATE INDEX idx_commissions_status ON commissions(status);

-- Bonus indexes
CREATE INDEX idx_bonuses_recipient ON bonuses(recipient_id);
CREATE INDEX idx_bonuses_type ON bonuses(bonus_type);
CREATE INDEX idx_bonuses_status ON bonuses(status);
CREATE INDEX idx_bonuses_expires ON bonuses(expires_at);

-- Activity indexes
CREATE INDEX idx_activities_user ON user_activities(user_id);
CREATE INDEX idx_activities_type ON user_activities(activity_type);
CREATE INDEX idx_activities_created ON user_activities(created_at);

-- =====================================================
-- TRIGGERS AND FUNCTIONS
-- =====================================================

-- Update timestamp trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply update triggers to tables with updated_at columns
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_devices_updated_at BEFORE UPDATE ON devices 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_wallets_updated_at BEFORE UPDATE ON wallets 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Generate order number function
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TRIGGER AS $$
BEGIN
    NEW.order_number = 'TLB' || TO_CHAR(NEW.created_at, 'YYYYMMDD') || LPAD(nextval('order_number_seq')::text, 6, '0');
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create sequence for order numbers
CREATE SEQUENCE order_number_seq START 1;

-- Apply order number trigger
CREATE TRIGGER generate_order_number_trigger BEFORE INSERT ON orders 
    FOR EACH ROW EXECUTE FUNCTION generate_order_number();

-- =====================================================
-- INITIAL DATA SEEDS
-- =====================================================

-- Default categories
INSERT INTO categories (name, slug, description) VALUES
('Electronics', 'electronics', 'Electronic devices and accessories'),
('Fashion', 'fashion', 'Clothing, shoes, and accessories'),
('Home & Garden', 'home-garden', 'Home improvement and garden supplies'),
('Sports & Outdoors', 'sports-outdoors', 'Sports equipment and outdoor gear'),
('Books & Media', 'books-media', 'Books, music, movies, and games'),
('Digital Products', 'digital-products', 'Software, courses, and digital downloads');

-- System admin user (password should be changed immediately)
INSERT INTO users (email, password_hash, first_name, last_name, user_type, kyc_status, referral_code) VALUES
('admin@tlbdiamond.com', '$2b$12$placeholder_hash', 'System', 'Administrator', 'admin', 'verified', 'ADMIN001');

-- Create admin wallet
INSERT INTO wallets (user_id, balance_available) 
SELECT id, 1000000.00 FROM users WHERE email = 'admin@tlbdiamond.com';