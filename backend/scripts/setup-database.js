const { sequelize, testConnection, syncModels } = require('../config/database');
const { 
  User, Wallet, Category, Product, Bonus, Device, Transaction,
  Commission, Referral, Order, Payment, Review, Notification, MDMEvent
} = require('../models');
const bcrypt = require('bcryptjs');

async function setupDatabase() {
  console.log('🚀 Setting up TLB Diamond database...\n');

  try {
    // Test database connection
    console.log('📡 Testing database connection...');
    await testConnection();
    
    // Sync all models (create tables)
    console.log('📝 Creating database tables...');
    await syncModels(true); // Force recreate for fresh setup
    
    console.log('✅ Database tables created successfully\n');

    // Create admin user
    console.log('👤 Creating admin user...');
    const adminPasswordHash = await bcrypt.hash('TLBAdmin2024!', 12);
    
    const adminUser = await User.create({
      email: 'admin@tlbdiamond.com',
      password_hash: adminPasswordHash,
      first_name: 'TLB',
      last_name: 'Admin',
      role: 'admin',
      status: 'active',
      email_verified: true,
      phone_verified: true,
      account_type: 'business',
      referral_code: 'TLBADMIN2024',
      preferences: {
        notifications: { email: true, push: true, sms: true },
        privacy: { show_profile: false, show_earnings: false }
      }
    });

    // Create admin wallet
    await Wallet.create({
      user_id: adminUser.id,
      available_balance: 1000000.00, // 1M TLB for admin
      currency: 'TLB',
      daily_limit: 100000.00
    });

    console.log('✅ Admin user created successfully');
    console.log(`   Email: admin@tlbdiamond.com`);
    console.log(`   Password: TLBAdmin2024!`);
    console.log(`   Role: admin\n`);

    // Create sample categories
    console.log('📦 Creating product categories...');
    const categories = [
      {
        name: 'Electronics',
        slug: 'electronics',
        description: 'Smartphones, laptops, tablets, and accessories',
        icon: 'phone-portrait',
        color: '#3B82F6',
        is_featured: true,
        sort_order: 1
      },
      {
        name: 'Fashion',
        slug: 'fashion',
        description: 'Clothing, shoes, and fashion accessories',
        icon: 'shirt',
        color: '#EC4899',
        is_featured: true,
        sort_order: 2
      },
      {
        name: 'Home & Garden',
        slug: 'home-garden',
        description: 'Furniture, decor, and garden supplies',
        icon: 'home',
        color: '#10B981',
        is_featured: true,
        sort_order: 3
      },
      {
        name: 'Sports & Fitness',
        slug: 'sports-fitness',
        description: 'Exercise equipment and sporting goods',
        icon: 'fitness',
        color: '#F59E0B',
        is_featured: false,
        sort_order: 4
      },
      {
        name: 'Books & Media',
        slug: 'books-media',
        description: 'Books, movies, music, and digital content',
        icon: 'library',
        color: '#8B5CF6',
        is_featured: false,
        sort_order: 5
      }
    ];

    const createdCategories = await Category.bulkCreate(categories);
    console.log(`✅ Created ${createdCategories.length} product categories\n`);

    // Create sample user
    console.log('👤 Creating sample user...');
    const userPasswordHash = await bcrypt.hash('password123', 12);
    
    const sampleUser = await User.create({
      email: 'john.doe@example.com',
      password_hash: userPasswordHash,
      first_name: 'John',
      last_name: 'Doe',
      phone: '+1234567890',
      gender: 'male',
      birthday: new Date('1990-05-15'),
      account_type: 'individual',
      status: 'active',
      email_verified: true,
      location: 'New York, USA',
      referral_code: 'JOHN2024'
    });

    // Create sample user wallet with some balance
    const sampleWallet = await Wallet.create({
      user_id: sampleUser.id,
      available_balance: 1250.00,
      locked_balance: 50.00,
      pending_balance: 0.00,
      total_earned: 5000.00,
      total_spent: 3750.00,
      monthly_earned: 150.00,
      monthly_spent: 300.00,
      monthly_bonuses: 75.00,
      currency: 'TLB'
    });

    console.log('✅ Sample user created successfully');
    console.log(`   Email: john.doe@example.com`);
    console.log(`   Password: password123\n`);

    // Create sample products
    console.log('🛍️ Creating sample products...');
    const products = [
      {
        seller_id: adminUser.id,
        category_id: createdCategories[0].id, // Electronics
        name: 'Premium Wireless Headphones',
        description: 'High-quality noise-cancelling wireless headphones with premium sound quality',
        price: 299.99,
        original_price: 349.99,
        stock_quantity: 50,
        condition: 'new',
        brand: 'AudioTech',
        rating_average: 4.5,
        rating_count: 128,
        total_sales: 15,
        support_bonus_enabled: true,
        support_bonus_percentage: 15.00,
        installment_enabled: true,
        max_installments: 4,
        min_down_payment: 25.00,
        status: 'active'
      },
      {
        seller_id: adminUser.id,
        category_id: createdCategories[0].id, // Electronics
        name: 'Gaming Mouse Pro',
        description: 'Professional gaming mouse with RGB lighting and customizable buttons',
        price: 79.99,
        stock_quantity: 100,
        condition: 'new',
        brand: 'GameGear',
        rating_average: 4.2,
        rating_count: 89,
        total_sales: 32,
        support_bonus_enabled: true,
        support_bonus_percentage: 10.00,
        installment_enabled: true,
        max_installments: 3,
        min_down_payment: 30.00,
        status: 'active'
      },
      {
        seller_id: adminUser.id,
        category_id: createdCategories[0].id, // Electronics
        name: 'Smart Fitness Watch',
        description: 'Track your health and fitness with this advanced smartwatch',
        price: 199.99,
        stock_quantity: 75,
        condition: 'new',
        brand: 'FitTech',
        rating_average: 4.0,
        rating_count: 156,
        total_sales: 28,
        support_bonus_enabled: false,
        installment_enabled: true,
        max_installments: 3,
        status: 'active'
      }
    ];

    const createdProducts = await Product.bulkCreate(products);
    console.log(`✅ Created ${createdProducts.length} sample products\n`);

    // Create sample transactions
    console.log('💰 Creating sample transactions...');
    const sampleTransactions = [
      {
        wallet_id: sampleWallet.id,
        user_id: sampleUser.id,
        type: 'received',
        amount: 5.00,
        currency: 'TLB',
        status: 'completed',
        title: 'Referral Bonus',
        description: 'From: Sarah M.',
        icon: 'people',
        color: '#10B981',
        processed_at: new Date()
      },
      {
        wallet_id: sampleWallet.id,
        user_id: sampleUser.id,
        type: 'sent',
        amount: 25.00,
        currency: 'TLB',
        status: 'completed',
        title: 'Order Payment',
        description: 'Installment #2',
        icon: 'card',
        color: '#EF4444',
        processed_at: new Date(Date.now() - 24 * 60 * 60 * 1000) // Yesterday
      },
      {
        wallet_id: sampleWallet.id,
        user_id: sampleUser.id,
        type: 'received',
        amount: 50.00,
        currency: 'TLB',
        status: 'completed',
        title: 'Birthday Bonus',
        description: 'Special reward',
        icon: 'gift',
        color: '#10B981',
        processed_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
      }
    ];

    await Transaction.bulkCreate(sampleTransactions);
    console.log(`✅ Created ${sampleTransactions.length} sample transactions\n`);

    // Create sample bonuses
    console.log('🎁 Creating sample bonuses...');
    const bonuses = [
      {
        recipient_id: sampleUser.id,
        type: 'birthday',
        title: 'Birthday Bonus',
        description: 'Special birthday reward just for you!',
        amount: 50.00,
        icon: '🎂',
        color: '#EC4899',
        status: 'available',
        expires_at: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000) // Expires in 2 days
      },
      {
        recipient_id: sampleUser.id,
        giver_id: adminUser.id,
        type: 'gift_of_legacy',
        title: 'Gift of Legacy',
        description: 'A surprise gift from a community member',
        amount: 25.00,
        icon: '⭐',
        color: '#F59E0B',
        status: 'available',
        message: 'Good luck! 🍀',
        giver_name: 'TLB Admin',
        can_forward: true,
        max_forwards: 1,
        expires_at: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000) // Expires in 5 days
      },
      {
        recipient_id: sampleUser.id,
        type: 'daily_login',
        title: 'Daily Login Bonus',
        description: 'Keep your streak going!',
        amount: 5.00,
        icon: '🎁',
        color: '#10B981',
        status: 'available',
        expires_at: new Date(Date.now() + 18 * 60 * 60 * 1000) // Expires in 18 hours
      }
    ];

    await Bonus.bulkCreate(bonuses);
    console.log(`✅ Created ${bonuses.length} sample bonuses\n`);

    console.log('🎉 Database setup completed successfully!\n');
    
    console.log('📋 Summary:');
    console.log(`   ✅ Admin User: admin@tlbdiamond.com / TLBAdmin2024!`);
    console.log(`   ✅ Sample User: john.doe@example.com / password123`);
    console.log(`   ✅ Categories: ${createdCategories.length}`);
    console.log(`   ✅ Products: ${createdProducts.length}`);
    console.log(`   ✅ Transactions: ${sampleTransactions.length}`);
    console.log(`   ✅ Bonuses: ${bonuses.length}`);
    console.log(`   ✅ Database ready for use!\n`);

  } catch (error) {
    console.error('❌ Database setup failed:', error);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

// Run setup if called directly
if (require.main === module) {
  setupDatabase();
}

module.exports = { setupDatabase };