import * as SecureStore from 'expo-secure-store';

class SharedDataService {
  constructor() {
    this.products = null;
    this.users = null;
    this.walletData = null;
  }

  // ============ PRODUCTS ============
  async getProducts() {
    try {
      // Try to load products from local storage first
      const storedProducts = await SecureStore.getItemAsync('products');
      if (storedProducts) {
        this.products = JSON.parse(storedProducts);
        return this.products;
      }
      
      // If no stored products, return shared mock products
      this.products = this.getSharedMockProducts();
      await this.saveProducts(this.products);
      return this.products;
    } catch (error) {
      console.error('Error loading products:', error);
      // Return mock products as fallback
      return this.getSharedMockProducts();
    }
  }

  async saveProducts(products) {
    try {
      this.products = products;
      await SecureStore.setItemAsync('products', JSON.stringify(products));
      console.log('Products saved to local storage');
    } catch (error) {
      console.error('Error saving products:', error);
    }
  }

  async addProduct(product) {
    try {
      const products = await this.getProducts();
      const newProduct = {
        id: Date.now().toString(),
        ...product,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        status: 'active',
        sales_count: 0
      };
      products.unshift(newProduct);
      await this.saveProducts(products);
      return newProduct;
    } catch (error) {
      console.error('Error adding product:', error);
      throw error;
    }
  }

  async updateProduct(productId, updates) {
    try {
      const products = await this.getProducts();
      const updatedProducts = products.map(product =>
        product.id === productId 
          ? { ...product, ...updates, updated_at: new Date().toISOString() }
          : product
      );
      await this.saveProducts(updatedProducts);
      return updatedProducts.find(p => p.id === productId);
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  }

  async deleteProduct(productId) {
    try {
      const products = await this.getProducts();
      const filteredProducts = products.filter(product => product.id !== productId);
      await this.saveProducts(filteredProducts);
      return true;
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  }

  getSharedMockProducts() {
    return [
      {
        id: '1',
        name: 'Premium Diamond Ring',
        description: 'Exquisite 2-carat diamond ring with platinum band. Perfect for special occasions.',
        price: 15000.00,
        category: 'diamond',
        stock_quantity: 5,
        image_url: 'https://via.placeholder.com/150x150/D4AF37/FFFFFF?text=Diamond',
        created_at: '2024-11-01T10:00:00.000Z',
        updated_at: '2024-11-10T08:30:00.000Z',
        status: 'active',
        sales_count: 23
      },
      {
        id: '2',
        name: 'Gold Necklace Set',
        description: '24k gold necklace with matching earrings. Traditional design with modern craftsmanship.',
        price: 2500.00,
        category: 'gold',
        stock_quantity: 12,
        image_url: 'https://via.placeholder.com/150x150/FFD700/FFFFFF?text=Gold',
        created_at: '2024-11-03T14:20:00.000Z',
        updated_at: '2024-11-09T16:45:00.000Z',
        status: 'active',
        sales_count: 45
      },
      {
        id: '3',
        name: 'Emerald Earrings',
        description: 'Stunning emerald earrings with diamond accents. Elegant and timeless design.',
        price: 4200.00,
        category: 'jewelry',
        stock_quantity: 0,
        image_url: 'https://via.placeholder.com/150x150/50C878/FFFFFF?text=Emerald',
        created_at: '2024-11-05T09:15:00.000Z',
        updated_at: '2024-11-08T12:20:00.000Z',
        status: 'out_of_stock',
        sales_count: 12
      },
      {
        id: '4',
        name: 'Luxury Watch',
        description: 'Swiss-made luxury watch with diamond markers. Water-resistant and precision crafted.',
        price: 8500.00,
        category: 'accessories',
        stock_quantity: 3,
        image_url: 'https://via.placeholder.com/150x150/C0C0C0/000000?text=Watch',
        created_at: '2024-11-07T16:30:00.000Z',
        updated_at: '2024-11-10T07:15:00.000Z',
        status: 'active',
        sales_count: 8
      },
      {
        id: '5',
        name: 'Ruby Pendant',
        description: 'Beautiful ruby pendant with gold chain. Perfect gift for loved ones.',
        price: 1800.00,
        category: 'jewelry',
        stock_quantity: 15,
        image_url: 'https://via.placeholder.com/150x150/E0115F/FFFFFF?text=Ruby',
        created_at: '2024-10-20T11:45:00.000Z',
        updated_at: '2024-11-05T14:30:00.000Z',
        status: 'active',
        sales_count: 34
      },
      {
        id: '6',
        name: 'Limited Edition Diamond Set',
        description: 'Exclusive limited edition diamond jewelry set. Only 10 pieces available worldwide.',
        price: 45000.00,
        category: 'special',
        stock_quantity: 2,
        image_url: 'https://via.placeholder.com/150x150/B19CD9/FFFFFF?text=Special',
        created_at: '2024-11-09T20:00:00.000Z',
        updated_at: '2024-11-10T09:00:00.000Z',
        status: 'active',
        sales_count: 1
      },
      {
        id: '7',
        name: 'Pearl Bracelet',
        description: 'Elegant freshwater pearl bracelet with sterling silver clasp.',
        price: 850.00,
        category: 'jewelry',
        stock_quantity: 8,
        image_url: 'https://via.placeholder.com/150x150/F8F8FF/000000?text=Pearl',
        created_at: '2024-10-15T12:00:00.000Z',
        updated_at: '2024-11-08T15:30:00.000Z',
        status: 'active',
        sales_count: 18
      },
      {
        id: '8',
        name: 'Sapphire Ring',
        description: 'Blue sapphire ring with white gold setting. Stunning centerpiece stone.',
        price: 3200.00,
        category: 'diamond',
        stock_quantity: 4,
        image_url: 'https://via.placeholder.com/150x150/0F52BA/FFFFFF?text=Sapphire',
        created_at: '2024-10-25T09:30:00.000Z',
        updated_at: '2024-11-07T11:20:00.000Z',
        status: 'active',
        sales_count: 9
      }
    ];
  }

  // ============ USERS ============
  async getRegisteredUsers() {
    try {
      const userRegistry = await SecureStore.getItemAsync('userRegistry');
      if (!userRegistry) {
        return [];
      }
      
      const registry = JSON.parse(userRegistry);
      return Object.keys(registry).map((email, index) => {
        const user = registry[email];
        return {
          id: user.id || (index + 1).toString(),
          email: user.email || email,
          firstName: user.first_name || user.firstName || 'Unknown',
          lastName: user.last_name || user.lastName || 'User',
          userType: user.user_type || user.userType || 'buyer',
          registeredAt: user.created_at || user.registeredAt || new Date().toISOString(),
          isVerified: user.is_verified !== undefined ? user.is_verified : true,
          phoneNumber: user.phone_number || user.phoneNumber || null,
          dateOfBirth: user.date_of_birth || user.dateOfBirth || null
        };
      });
    } catch (error) {
      console.error('Error loading users:', error);
      return [];
    }
  }

  // ============ WALLET DATA ============
  async getWalletData() {
    try {
      const storedWallet = await SecureStore.getItemAsync('walletData');
      if (storedWallet) {
        return JSON.parse(storedWallet);
      }
      
      // Return shared mock wallet data
      const mockWallet = {
        available: 1245.67,
        locked: 150.00,
        pending: 25.50,
        lifetimeEarned: 3420.89,
        lifetimeSpent: 2150.72,
        monthlyEarned: 245.30,
        monthlySpent: 89.75,
        monthlyBonuses: 67.50
      };
      
      await SecureStore.setItemAsync('walletData', JSON.stringify(mockWallet));
      return mockWallet;
    } catch (error) {
      console.error('Error loading wallet data:', error);
      // Return mock data as fallback
      return {
        available: 1245.67,
        locked: 150.00,
        pending: 25.50,
        lifetimeEarned: 3420.89,
        lifetimeSpent: 2150.72,
        monthlyEarned: 245.30,
        monthlySpent: 89.75,
        monthlyBonuses: 67.50
      };
    }
  }

  async updateWalletData(updates) {
    try {
      const currentWallet = await this.getWalletData();
      const updatedWallet = { ...currentWallet, ...updates };
      await SecureStore.setItemAsync('walletData', JSON.stringify(updatedWallet));
      return updatedWallet;
    } catch (error) {
      console.error('Error updating wallet data:', error);
      throw error;
    }
  }

  // ============ DASHBOARD STATISTICS ============
  async getDashboardStats() {
    try {
      const [users, products, wallet] = await Promise.all([
        this.getRegisteredUsers(),
        this.getProducts(),
        this.getWalletData()
      ]);

      const activeUsers = users.filter(u => u.isVerified).length;
      const totalProducts = products.length;
      const lowStockProducts = products.filter(p => p.stock_quantity < 5).length;
      const totalSales = products.reduce((sum, p) => sum + (p.sales_count || 0), 0);
      const totalRevenue = products.reduce((sum, p) => sum + ((p.sales_count || 0) * p.price), 0);
      
      return {
        totalUsers: users.length,
        activeUsers: activeUsers,
        totalOrders: totalSales,
        pendingOrders: Math.floor(totalSales * 0.1), // Estimate 10% pending
        totalRevenue: totalRevenue,
        monthlyRevenue: totalRevenue * 0.15, // Estimate 15% this month
        totalProducts: totalProducts,
        lowStockProducts: lowStockProducts,
        totalDevices: users.length, // Assume 1 device per user
        onlineDevices: Math.floor(users.length * 0.8), // Estimate 80% online
        supportTickets: Math.floor(users.length * 0.05), // Estimate 5% have tickets
        systemAlerts: lowStockProducts + (users.length > 0 ? 1 : 0) // Stock alerts + general alerts
      };
    } catch (error) {
      console.error('Error calculating dashboard stats:', error);
      // Return default stats
      return {
        totalUsers: 0,
        activeUsers: 0,
        totalOrders: 0,
        pendingOrders: 0,
        totalRevenue: 0,
        monthlyRevenue: 0,
        totalProducts: 0,
        lowStockProducts: 0,
        totalDevices: 0,
        onlineDevices: 0,
        supportTickets: 0,
        systemAlerts: 0
      };
    }
  }
}

// Export singleton instance
export const sharedDataService = new SharedDataService();
export default sharedDataService;