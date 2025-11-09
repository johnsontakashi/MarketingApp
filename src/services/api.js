import * as SecureStore from 'expo-secure-store';
import * as Device from 'expo-device';
import Constants from 'expo-constants';

// API Configuration
const API_BASE_URL = __DEV__ 
  ? 'http://localhost:3000/api/v1'  // Development
  : 'https://your-production-api.com/api/v1'; // Production

// Device info for MDM
let deviceId = null;
let deviceInfo = null;

// Initialize device info
const initializeDevice = async () => {
  try {
    if (!deviceId) {
      // Try to get stored device ID, or generate new one
      deviceId = await SecureStore.getItemAsync('device_id');
      if (!deviceId) {
        deviceId = `${Device.brand}-${Device.modelName}-${Constants.sessionId}`.replace(/\s+/g, '-');
        await SecureStore.setItemAsync('device_id', deviceId);
      }
    }

    if (!deviceInfo) {
      deviceInfo = {
        id: deviceId,
        name: Device.deviceName || Device.modelName || 'Unknown Device',
        type: Device.osName?.toLowerCase() || 'android',
        brand: Device.brand,
        model: Device.modelName,
        manufacturer: Device.manufacturer,
        osVersion: Device.osVersion,
        appVersion: Constants.expoConfig?.version || '1.0.0'
      };
    }

    return { deviceId, deviceInfo };
  } catch (error) {
    console.error('Device initialization error:', error);
    return { deviceId: 'fallback-device', deviceInfo: {} };
  }
};

// HTTP client class
class ApiClient {
  constructor() {
    this.token = null;
    this.isInitialized = false;
  }

  async initialize() {
    if (this.isInitialized) return;
    
    try {
      // Get stored token
      this.token = await SecureStore.getItemAsync('auth_token');
      
      // Initialize device info
      await initializeDevice();
      
      this.isInitialized = true;
    } catch (error) {
      console.error('API initialization error:', error);
      this.isInitialized = true; // Continue even if initialization fails
    }
  }

  async getHeaders(includeAuth = true) {
    if (!this.isInitialized) {
      await this.initialize();
    }

    const headers = {
      'Content-Type': 'application/json',
      'X-Device-ID': deviceId,
      'X-Device-Name': deviceInfo?.name,
      'X-Device-Type': deviceInfo?.type,
      'X-App-Version': deviceInfo?.appVersion,
    };

    if (includeAuth && this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    return headers;
  }

  async request(method, endpoint, data = null, requireAuth = true) {
    try {
      const url = `${API_BASE_URL}${endpoint}`;
      const headers = await this.getHeaders(requireAuth);

      const config = {
        method,
        headers,
      };

      if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
        config.body = JSON.stringify(data);
      }

      console.log(`API Request: ${method} ${url}`);
      
      const response = await fetch(url, config);
      const responseText = await response.text();
      
      let responseData = {};
      try {
        responseData = responseText ? JSON.parse(responseText) : {};
      } catch (parseError) {
        console.error('Response parsing error:', parseError);
        responseData = { message: responseText };
      }

      if (!response.ok) {
        console.error(`API Error [${response.status}]:`, responseData);
        throw new ApiError(
          responseData.message || responseData.error || 'Request failed',
          response.status,
          responseData
        );
      }

      console.log(`API Success: ${method} ${url}`, responseData);
      return responseData;

    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }

      console.error('API Request failed:', error);
      
      if (error.message.includes('Network request failed') || error.message.includes('fetch')) {
        throw new ApiError('Network error. Please check your connection.', 0);
      }
      
      throw new ApiError(error.message || 'Request failed', 0);
    }
  }

  // Authentication methods
  async login(email, password) {
    const response = await this.request('POST', '/auth/login', { email, password }, false);
    
    if (response.token) {
      this.token = response.token;
      await SecureStore.setItemAsync('auth_token', response.token);
      await SecureStore.setItemAsync('user_data', JSON.stringify(response.user));
    }

    return response;
  }

  async register(userData) {
    const response = await this.request('POST', '/auth/register', userData, false);
    
    if (response.token) {
      this.token = response.token;
      await SecureStore.setItemAsync('auth_token', response.token);
      await SecureStore.setItemAsync('user_data', JSON.stringify(response.user));
    }

    return response;
  }

  async logout() {
    try {
      await this.request('POST', '/auth/logout');
    } catch (error) {
      console.warn('Logout API call failed:', error.message);
    } finally {
      this.token = null;
      await SecureStore.deleteItemAsync('auth_token');
      await SecureStore.deleteItemAsync('user_data');
    }
  }

  async getProfile() {
    return await this.request('GET', '/auth/me');
  }

  async updateProfile(userData) {
    return await this.request('PUT', '/auth/profile', userData);
  }

  // Wallet methods
  async getWallet() {
    return await this.request('GET', '/wallet');
  }

  async sendTLB(recipient, amount, message = null) {
    return await this.request('POST', '/wallet/send', { recipient, amount, message });
  }

  async requestTLB(requester, amount, message = null) {
    return await this.request('POST', '/wallet/request', { requester, amount, message });
  }

  async topUpWallet(method, amount, paymentDetails = {}) {
    return await this.request('POST', '/wallet/topup', { method, amount, paymentDetails });
  }

  async getTransactions(limit = 20, offset = 0, type = null, status = null) {
    const params = new URLSearchParams({ limit, offset });
    if (type) params.append('type', type);
    if (status) params.append('status', status);
    
    return await this.request('GET', `/wallet/transactions?${params}`);
  }

  async getTransaction(transactionId) {
    return await this.request('GET', `/wallet/transactions/${transactionId}`);
  }

  // Products methods
  async getProducts(limit = 20, offset = 0, category = null, search = null) {
    const params = new URLSearchParams({ limit, offset });
    if (category) params.append('category', category);
    if (search) params.append('search', search);
    
    return await this.request('GET', `/products?${params}`, null, false);
  }

  async getProduct(productId) {
    return await this.request('GET', `/products/${productId}`, null, false);
  }

  async getCategories() {
    return await this.request('GET', '/products/categories', null, false);
  }

  // Orders methods
  async createOrder(orderData) {
    return await this.request('POST', '/orders', orderData);
  }

  async getOrders(limit = 20, offset = 0, status = null) {
    const params = new URLSearchParams({ limit, offset });
    if (status) params.append('status', status);
    
    return await this.request('GET', `/orders?${params}`);
  }

  async getOrder(orderId) {
    return await this.request('GET', `/orders/${orderId}`);
  }

  async makePayment(orderId, amount) {
    return await this.request('POST', `/orders/${orderId}/payments`, { amount });
  }

  // Community methods
  async getReferralTree() {
    return await this.request('GET', '/community/referrals/tree');
  }

  async getReferralStats() {
    return await this.request('GET', '/community/referrals/stats');
  }

  async getAvailableBonuses() {
    return await this.request('GET', '/community/bonuses');
  }

  async claimBonus(bonusId) {
    return await this.request('POST', `/community/bonuses/${bonusId}/claim`);
  }

  async forwardBonus(bonusId, recipientId, message = null) {
    return await this.request('POST', `/community/bonuses/${bonusId}/forward`, { recipientId, message });
  }

  async getCommissions() {
    return await this.request('GET', '/community/commissions');
  }

  // MDM methods
  async getDeviceStatus() {
    return await this.request('GET', '/mdm/status');
  }

  async unlockDevice(unlockCode) {
    return await this.request('POST', '/mdm/unlock', { unlockCode });
  }

  async reportKioskViolation(violationType, details = {}) {
    return await this.request('POST', '/mdm/violations', { violationType, details });
  }

  async updateDeviceHeartbeat(location = null, batteryLevel = null) {
    return await this.request('POST', '/mdm/heartbeat', { location, batteryLevel });
  }

  // Utility methods
  isAuthenticated() {
    return !!this.token;
  }

  getDeviceId() {
    return deviceId;
  }

  getDeviceInfo() {
    return deviceInfo;
  }
}

// Custom error class
class ApiError extends Error {
  constructor(message, status = 0, data = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }

  isNetworkError() {
    return this.status === 0;
  }

  isAuthError() {
    return this.status === 401 || this.status === 403;
  }

  isValidationError() {
    return this.status === 400;
  }

  isServerError() {
    return this.status >= 500;
  }
}

// Create and export singleton instance
const apiClient = new ApiClient();

// Export both the instance and the class for flexibility
export default apiClient;
export { ApiClient, ApiError };