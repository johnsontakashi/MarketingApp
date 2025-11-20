class ModalRegistry {
  constructor() {
    this.modalContext = null;
  }

  setModalContext(context) {
    this.modalContext = context;
  }

  getModalContext() {
    return this.modalContext;
  }

  showSimCardModal(options = {}) {
    if (this.modalContext && this.modalContext.showSimCardModal) {
      this.modalContext.showSimCardModal(options);
    } else {
      console.warn('⚠️ Modal context not available, falling back to Alert');
      // Fallback to Alert if modal context is not available
      const { Alert } = require('react-native');
      Alert.alert(
        options.title || '⚠️ Different SIM Card Detected',
        options.message || 'A different SIM card has been inserted. Device remains locked for security.',
        [
          { text: 'Pay Now', onPress: options.onPayment || (() => {}) },
          { text: 'OK', onPress: options.onClose || (() => {}) }
        ]
      );
    }
  }

  showModal(data) {
    if (this.modalContext && this.modalContext.showModal) {
      this.modalContext.showModal(data);
    } else {
      console.warn('⚠️ Modal context not available');
    }
  }

  hideModal() {
    if (this.modalContext && this.modalContext.hideModal) {
      this.modalContext.hideModal();
    }
  }

  showAuthModal(options = {}) {
    if (this.modalContext && this.modalContext.showAuthModal) {
      this.modalContext.showAuthModal(options);
    } else {
      console.warn('⚠️ Auth modal context not available, falling back to Alert');
      // Fallback to Alert if modal context is not available
      const { Alert } = require('react-native');
      Alert.alert(
        options.title || '🔐 Authentication Required',
        `Please sign up or log in to ${options.action || 'continue'}.`,
        [
          { text: 'Cancel', style: 'cancel', onPress: options.onCancel || (() => {}) },
          { text: 'Sign Up', onPress: options.onSignUp || (() => {}) },
          { text: 'Log In', onPress: options.onLogin || (() => {}) }
        ]
      );
    }
  }
}

// Create singleton instance
const modalRegistry = new ModalRegistry();

export default modalRegistry;