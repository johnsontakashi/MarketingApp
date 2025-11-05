class ModalRegistry {
  constructor() {
    this.modalContext = null;
  }

  setModalContext(context) {
    this.modalContext = context;
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
}

// Create singleton instance
const modalRegistry = new ModalRegistry();

export default modalRegistry;