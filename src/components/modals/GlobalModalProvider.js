import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Dimensions,
  StatusBar
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import modalRegistry from '../../services/ModalRegistry';
import themeService from '../../services/themeService';

const { width } = Dimensions.get('window');

// Dynamic styles function based on theme colors
const getStyles = (colors) => StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  
  // SIM Card Modal Styles
  simCardModalContainer: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    width: width - 40,
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 15,
    elevation: 15,
    borderWidth: 2,
    borderColor: '#FF4444',
  },
  simCardHeader: {
    backgroundColor: colors.card,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    paddingVertical: 25,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: colors.primaryLight,
  },
  simCardIconContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 3,
    borderColor: '#FF4444',
  },
  simCardTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  simCardSubtitle: {
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    fontWeight: '500',
    letterSpacing: 0.2,
  },
  simCardContent: {
    padding: 25,
    paddingTop: 20,
    paddingBottom: 15,
  },
  simCardMessageContainer: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  simCardMessage: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 24,
    textAlign: 'center',
    fontWeight: '500',
    letterSpacing: 0.3,
  },
  securityFeaturesContainer: {
    marginBottom: 20,
  },
  securityFeaturesTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 12,
  },
  securityFeaturesList: {
    gap: 8,
  },
  securityFeatureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: colors.background,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#FF4444',
  },
  securityFeatureText: {
    marginLeft: 12,
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  warningNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 10,
    padding: 15,
    borderWidth: 1,
    borderColor: colors.warning,
  },
  warningText: {
    marginLeft: 10,
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '600',
    flex: 1,
  },
  simCardActions: {
    padding: 20,
    paddingTop: 0,
    gap: 12,
  },
  paymentButton: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: colors.primaryDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  paymentButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 8,
    letterSpacing: 0.5,
  },
  emergencyButton: {
    backgroundColor: colors.error,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
  },
  emergencyButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  acknowledgeButton: {
    backgroundColor: colors.border,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  acknowledgeButtonText: {
    color: colors.textSecondary,
    fontSize: 15,
    fontWeight: '600',
  },
  
  // Authentication Modal Styles
  authModalContainer: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    width: width - 40,
    maxWidth: 420,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 20,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  authHeader: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    paddingVertical: 30,
    paddingHorizontal: 25,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: colors.primaryLight,
  },
  authIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 3,
    borderColor: colors.primary,
  },
  authTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 10,
    letterSpacing: 0.8,
  },
  authSubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    fontWeight: '500',
    letterSpacing: 0.3,
  },
  authContent: {
    padding: 30,
    paddingTop: 25,
    paddingBottom: 20,
  },
  authMessageContainer: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 18,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  authMessage: {
    fontSize: 17,
    color: colors.text,
    lineHeight: 26,
    textAlign: 'center',
    marginBottom: 35,
    fontWeight: '500',
    letterSpacing: 0.4,
  },
  benefitsContainer: {
    marginBottom: 10,
  },
  benefitsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 12,
  },
  benefitsList: {
    gap: 10,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: colors.background,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
  },
  benefitText: {
    marginLeft: 12,
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
    flex: 1,
  },
  authActions: {
    padding: 20,
    paddingTop: 0,
    gap: 12,
  },
  signUpButton: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 16,
    marginBottom: 10,
    shadowColor: colors.primaryDark,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  signUpButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    marginLeft: 8,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  loginButton: {
    backgroundColor: colors.surface,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 16,
    marginBottom: 15,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  loginButtonText: {
    color: colors.primary,
    fontSize: 18,
    fontWeight: '700',
    marginLeft: 8,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  cancelButton: {
    backgroundColor: 'transparent',
    paddingVertical: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: colors.textLight,
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.4,
  },
});

const GlobalModalContext = createContext();

export const useGlobalModal = () => {
  const context = useContext(GlobalModalContext);
  if (!context) {
    throw new Error('useGlobalModal must be used within a GlobalModalProvider');
  }
  return context;
};

export const GlobalModalProvider = ({ children }) => {
  const [modalData, setModalData] = useState(null);
  const [currentTheme, setCurrentTheme] = useState(themeService.getCurrentTheme());

  // Listen for theme changes
  useEffect(() => {
    const checkTheme = () => {
      const newTheme = themeService.getCurrentTheme();
      if (newTheme.name !== currentTheme.name) {
        setCurrentTheme(newTheme);
        console.log(`GlobalModalProvider: Theme changed to ${newTheme.name}`);
      }
    };
    
    // Check for theme changes periodically (in case user data changes)
    const interval = setInterval(checkTheme, 1000);
    
    return () => clearInterval(interval);
  }, [currentTheme]);

  const showModal = (data) => {
    setModalData(data);
  };

  const hideModal = () => {
    setModalData(null);
  };

  const showSimCardModal = (options = {}) => {
    const {
      title = '⚠️ Different SIM Card Detected',
      message = 'A different SIM card has been inserted. Device remains locked for security.\n\nComplete payment to unlock device with any SIM card.',
      onPayment = () => console.log('Payment button pressed'),
      onClose = () => hideModal()
    } = options;

    showModal({
      type: 'sim_card',
      title,
      message,
      onPayment,
      onClose
    });
  };

  const showAuthModal = (options = {}) => {
    const {
      title = '🔐 Authentication Required',
      message = 'Please sign up or log in to continue.',
      action = 'perform this action',
      onSignUp = () => console.log('Sign up pressed'),
      onLogin = () => console.log('Login pressed'),
      onCancel = () => hideModal()
    } = options;

    showModal({
      type: 'auth_required',
      title,
      message,
      action,
      onSignUp,
      onLogin,
      onCancel
    });
  };

  // Register this context with the modal registry
  useEffect(() => {
    modalRegistry.setModalContext({
      showModal,
      hideModal,
      showSimCardModal,
      showAuthModal
    });

    // Cleanup on unmount
    return () => {
      modalRegistry.setModalContext(null);
    };
  }, []);

  const styles = getStyles(currentTheme.colors);

  return (
    <GlobalModalContext.Provider value={{ showModal, hideModal, showSimCardModal, showAuthModal }}>
      {children}
      
      {/* SIM Card Detection Modal */}
      {modalData?.type === 'sim_card' && (
        <Modal
          visible={true}
          transparent={true}
          animationType="fade"
          onRequestClose={modalData.onClose}
        >
          <StatusBar backgroundColor="rgba(0, 0, 0, 0.8)" barStyle="light-content" />
          <View style={styles.modalOverlay}>
            <View style={styles.simCardModalContainer}>
              
              {/* Header Section */}
              <View style={styles.simCardHeader}>
                <View style={styles.simCardIconContainer}>
                  <Ionicons name="warning" size={40} color="#FF4444" />
                </View>
                <Text style={styles.simCardTitle}>{modalData.title}</Text>
              </View>

              {/* Content Section */}
              <View style={styles.simCardContent}>
                <View style={styles.simCardMessageContainer}>
                  <Text style={styles.simCardMessage}>{modalData.message}</Text>
                </View>

                {/* Security Features List */}
                <View style={styles.securityFeaturesContainer}>
                  <Text style={styles.securityFeaturesTitle}>Security Measures Active:</Text>
                  
                  <View style={styles.securityFeaturesList}>
                    <View style={styles.securityFeatureItem}>
                      <Ionicons name="lock-closed" size={16} color="#FF4444" />
                      <Text style={styles.securityFeatureText}>Device immediately locked</Text>
                    </View>
                    
                    <View style={styles.securityFeatureItem}>
                      <Ionicons name="ban" size={16} color="#FF4444" />
                      <Text style={styles.securityFeatureText}>Network access blocked</Text>
                    </View>
                    
                    <View style={styles.securityFeatureItem}>
                      <Ionicons name="shield-checkmark" size={16} color="#FF4444" />
                      <Text style={styles.securityFeatureText}>All functions disabled</Text>
                    </View>
                    
                    <View style={styles.securityFeatureItem}>
                      <Ionicons name="document-text" size={16} color="#FF4444" />
                      <Text style={styles.securityFeatureText}>Violation logged</Text>
                    </View>
                  </View>
                </View>

                {/* Warning Notice */}
                <View style={styles.warningNotice}>
                  <Ionicons name="alert-circle" size={20} color="#F59E0B" />
                  <Text style={styles.warningText}>
                    Only payment completion can unlock device
                  </Text>
                </View>
              </View>

              {/* Action Buttons */}
              <View style={styles.simCardActions}>
                <TouchableOpacity 
                  style={styles.paymentButton}
                  onPress={() => {
                    modalData.onPayment();
                    hideModal();
                  }}
                >
                  <Ionicons name="card" size={20} color="#FFFFFF" />
                  <Text style={styles.paymentButtonText}>Pay Now</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.emergencyButton}
                  onPress={() => {
                    // Emergency support logic here
                    hideModal();
                  }}
                >
                  <Ionicons name="help-circle" size={20} color="#FFFFFF" />
                  <Text style={styles.emergencyButtonText}>Emergency Support</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.acknowledgeButton}
                  onPress={() => {
                    modalData.onClose();
                  }}
                >
                  <Text style={styles.acknowledgeButtonText}>Acknowledge</Text>
                </TouchableOpacity>
              </View>

            </View>
          </View>
        </Modal>
      )}

      {/* Authentication Required Modal */}
      {modalData?.type === 'auth_required' && (
        <Modal
          visible={true}
          transparent={true}
          animationType="slide"
          onRequestClose={modalData.onCancel}
        >
          <StatusBar backgroundColor="rgba(0, 0, 0, 0.8)" barStyle="light-content" />
          <View style={styles.modalOverlay}>
            <View style={styles.authModalContainer}>
              
              {/* Header Section */}
              <View style={styles.authHeader}>
                <View style={styles.authIconContainer}>
                  <Ionicons name="lock-closed" size={36} color={currentTheme.colors.primary} />
                </View>
                <Text style={styles.authTitle}>{modalData.title}</Text>
                <Text style={styles.authSubtitle}>
                  Please sign up or log in to {modalData.action}
                </Text>
              </View>

              {/* Content Section */}
              <View style={styles.authContent}>
                <View style={styles.authMessageContainer}>
                  <Text style={styles.authMessage}>
                    Join the TLB Diamond community to access premium features, secure transactions, and exclusive marketplace content.
                  </Text>
                </View>

                {/* Benefits List */}
                <View style={styles.benefitsContainer}>
                  <Text style={styles.benefitsTitle}>What you'll get:</Text>
                  
                  <View style={styles.benefitsList}>
                    <View style={styles.benefitItem}>
                      <Ionicons name="diamond" size={16} color={currentTheme.colors.primary} />
                      <Text style={styles.benefitText}>Access to TLB Diamond marketplace</Text>
                    </View>
                    
                    <View style={styles.benefitItem}>
                      <Ionicons name="wallet" size={16} color={currentTheme.colors.primary} />
                      <Text style={styles.benefitText}>Secure digital wallet</Text>
                    </View>
                    
                    <View style={styles.benefitItem}>
                      <Ionicons name="people" size={16} color={currentTheme.colors.primary} />
                      <Text style={styles.benefitText}>Community features & bonuses</Text>
                    </View>
                    
                    <View style={styles.benefitItem}>
                      <Ionicons name="shield-checkmark" size={16} color={currentTheme.colors.primary} />
                      <Text style={styles.benefitText}>Secure transactions</Text>
                    </View>
                  </View>
                </View>
              </View>

              {/* Action Buttons */}
              <View style={styles.authActions}>
                <TouchableOpacity 
                  style={styles.signUpButton}
                  onPress={() => {
                    modalData.onSignUp();
                    hideModal();
                  }}
                >
                  <Ionicons name="person-add" size={20} color="#FFFFFF" />
                  <Text style={styles.signUpButtonText}>Sign Up</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.loginButton}
                  onPress={() => {
                    modalData.onLogin();
                    hideModal();
                  }}
                >
                  <Ionicons name="log-in" size={20} color={currentTheme.colors.primary} />
                  <Text style={styles.loginButtonText}>Log In</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.cancelButton}
                  onPress={() => {
                    modalData.onCancel();
                  }}
                >
                  <Text style={styles.cancelButtonText}>Maybe Later</Text>
                </TouchableOpacity>
              </View>

            </View>
          </View>
        </Modal>
      )}
    </GlobalModalContext.Provider>
  );
};

export default GlobalModalProvider;