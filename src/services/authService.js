// Authentication service for handling protected actions
import modalRegistry from './ModalRegistry';

class AuthService {
  constructor() {
    this.isAuthenticated = false;
    this.userRole = null;
    this.authCallbacks = [];
    this.navigation = null;
  }

  // Initialize with navigation reference
  init(navigation) {
    if (navigation) {
      this.navigation = navigation;
      console.log('AuthService.init called with navigation: true');
    } else {
      console.log('AuthService.init called with navigation: false');
    }
  }

  // Update authentication status
  setAuthStatus(isAuthenticated, userRole = null) {
    this.isAuthenticated = isAuthenticated;
    this.userRole = userRole;
  }

  // Add callback to be executed after successful authentication
  addAuthCallback(callback) {
    this.authCallbacks.push(callback);
  }

  // Clear callbacks
  clearAuthCallbacks() {
    this.authCallbacks = [];
  }

  // Execute callbacks after authentication
  executeAuthCallbacks() {
    this.authCallbacks.forEach(callback => {
      try {
        callback();
      } catch (error) {
        console.error('Error executing auth callback:', error);
      }
    });
    this.clearAuthCallbacks();
  }

  // Check if user is authenticated and prompt login if not
  requireAuth(action = 'perform this action', onSuccess = null) {
    if (this.isAuthenticated) {
      // User is authenticated, execute the action
      if (onSuccess) {
        onSuccess();
      }
      return true;
    } else {
      // User is not authenticated, show prompt
      this.promptLogin(action, onSuccess);
      return false;
    }
  }

  // Navigate to authentication screen
  navigateToAuth(mode = 'login', onSuccess = null) {
    console.log('navigateToAuth called with mode:', mode, 'navigation:', !!this.navigation);
    
    // Add callback if provided
    if (onSuccess) {
      this.addAuthCallback(onSuccess);
    }
    
    // Navigate to auth screen
    if (this.navigation) {
      console.log('Navigating to Auth screen with mode:', mode);
      this.navigation.navigate('Auth', { mode });
    } else {
      console.error('Navigation not initialized in AuthService');
    }
  }

  // Show authentication prompt
  promptLogin(action = 'perform this action', onSuccess = null) {
    const modalContext = modalRegistry.getModalContext();
    
    if (modalContext && modalContext.showAuthModal) {
      modalContext.showAuthModal({
        title: '🔐 Authentication Required',
        message: 'Join TLB Diamond to access premium features',
        action: action,
        onSignUp: () => {
          console.log('User chose to sign up');
          this.navigateToAuth('signup', onSuccess);
        },
        onLogin: () => {
          console.log('User chose to log in');
          this.navigateToAuth('login', onSuccess);
        },
        onCancel: () => {
          console.log('Authentication cancelled by user');
        }
      });
    } else {
      console.error('Modal context not available, falling back to simple navigation');
      this.navigateToAuth('login', onSuccess);
    }
  }

  // Specific prompt for purchasing
  requirePurchaseAuth(productName, onSuccess = null) {
    return this.requireAuth(
      `purchase ${productName}`,
      onSuccess
    );
  }

  // Specific prompt for wallet actions
  requireWalletAuth(action = 'access your wallet', onSuccess = null) {
    return this.requireAuth(
      action,
      onSuccess
    );
  }

  // Specific prompt for community actions
  requireCommunityAuth(action = 'access community features', onSuccess = null) {
    return this.requireAuth(
      action,
      onSuccess
    );
  }

  // Specific prompt for profile actions
  requireProfileAuth(action = 'access your profile', onSuccess = null) {
    return this.requireAuth(
      action,
      onSuccess
    );
  }

  // Check if user has specific role
  hasRole(role) {
    return this.isAuthenticated && this.userRole === role;
  }

  // Require specific role
  requireRole(role, action = 'perform this action', onUnauthorized = null) {
    if (!this.isAuthenticated) {
      this.promptLogin(action);
      return false;
    }

    if (this.userRole !== role) {
      const modalContext = modalRegistry.getModalContext();
      
      if (modalContext && modalContext.showModal) {
        modalContext.showModal({
          type: 'error',
          title: '❌ Access Denied',
          message: `You don't have permission to ${action}. This feature is restricted to ${role} users.`,
          onClose: onUnauthorized || (() => {})
        });
      } else {
        // Fallback to console log
        console.warn(`Access denied: ${action} requires ${role} role`);
        if (onUnauthorized) onUnauthorized();
      }
      return false;
    }

    return true;
  }
}

// Export singleton instance
const authService = new AuthService();
export default authService;