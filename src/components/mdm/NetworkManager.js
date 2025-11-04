import { Alert } from 'react-native';

class NetworkManager {
  constructor() {
    this.isBlocked = false;
    this.allowedDomains = [
      'tlbdiamond.com',
      'api.tlbdiamond.com',
      'payment.tlbdiamond.com',
      'emergency.gov',
      '911.gov'
    ];
    this.blockedDomains = [];
    this.networkState = 'open'; // 'open', 'restricted', 'blocked'
  }

  // Set network restriction level
  setNetworkRestriction(level) {
    this.networkState = level;
    
    switch (level) {
      case 'restricted':
        this.enableRestrictedMode();
        break;
      case 'blocked':
        this.enableBlockedMode();
        break;
      default:
        this.enableOpenMode();
        break;
    }
  }

  // Enable restricted network mode (only essential services)
  enableRestrictedMode() {
    this.isBlocked = true;
    
    // In a real implementation, this would configure device networking
    // For now, we'll simulate by intercepting requests
    console.log('Network restricted to essential services only');
    
    Alert.alert(
      '🌐 Network Restricted',
      'Internet access is now limited to:\n\n• TLB Diamond payment services\n• Emergency services\n• Essential communications\n\nAll other websites and services are blocked.',
      [{ text: 'OK' }]
    );
  }

  // Enable full network blocking
  enableBlockedMode() {
    this.isBlocked = true;
    
    console.log('Network fully blocked except emergency services');
    
    Alert.alert(
      '🚫 Network Blocked',
      'All internet access has been blocked except:\n\n• Emergency services (911)\n• TLB Diamond payment portal\n\nMake your payment to restore network access.',
      [{ text: 'OK' }]
    );
  }

  // Restore full network access
  enableOpenMode() {
    this.isBlocked = false;
    this.networkState = 'open';
    
    console.log('Network access fully restored');
  }

  // Check if a URL/domain should be blocked
  shouldBlockRequest(url) {
    if (!this.isBlocked) return false;
    
    const domain = this.extractDomain(url);
    
    // Always allow essential services
    if (this.allowedDomains.some(allowed => domain.includes(allowed))) {
      return false;
    }
    
    // Block everything else when in restricted/blocked mode
    return true;
  }

  // Extract domain from URL
  extractDomain(url) {
    try {
      return new URL(url).hostname.toLowerCase();
    } catch {
      return url.toLowerCase();
    }
  }

  // Intercept and handle network requests
  interceptRequest(url) {
    if (this.shouldBlockRequest(url)) {
      Alert.alert(
        '🚫 Access Blocked',
        `Access to ${this.extractDomain(url)} is currently restricted due to overdue payment.\n\nMake your payment to restore full internet access.`,
        [
          { text: 'Pay Now', onPress: () => this.redirectToPayment() },
          { text: 'OK', style: 'cancel' }
        ]
      );
      return false;
    }
    return true;
  }

  // Redirect to payment portal
  redirectToPayment() {
    // This would navigate to the payment screen
    console.log('Redirecting to payment portal...');
  }

  // Get current network status
  getNetworkStatus() {
    return {
      state: this.networkState,
      isBlocked: this.isBlocked,
      allowedDomains: this.allowedDomains,
      blockedCount: this.isBlocked ? 'Most sites' : 0
    };
  }

  // Add domain to allowed list (for emergency situations)
  addAllowedDomain(domain) {
    if (!this.allowedDomains.includes(domain)) {
      this.allowedDomains.push(domain);
    }
  }

  // Remove domain from allowed list
  removeAllowedDomain(domain) {
    this.allowedDomains = this.allowedDomains.filter(d => d !== domain);
  }
}

// Create singleton instance
const networkManager = new NetworkManager();

export default networkManager;