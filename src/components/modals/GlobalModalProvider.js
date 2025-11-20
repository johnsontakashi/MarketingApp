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

const { width } = Dimensions.get('window');

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
                  <Ionicons name="lock-closed" size={36} color="#D4AF37" />
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
                      <Ionicons name="diamond" size={16} color="#D4AF37" />
                      <Text style={styles.benefitText}>Access to TLB Diamond marketplace</Text>
                    </View>
                    
                    <View style={styles.benefitItem}>
                      <Ionicons name="wallet" size={16} color="#D4AF37" />
                      <Text style={styles.benefitText}>Secure digital wallet</Text>
                    </View>
                    
                    <View style={styles.benefitItem}>
                      <Ionicons name="people" size={16} color="#D4AF37" />
                      <Text style={styles.benefitText}>Community features & bonuses</Text>
                    </View>
                    
                    <View style={styles.benefitItem}>
                      <Ionicons name="shield-checkmark" size={16} color="#D4AF37" />
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
                  <Ionicons name="log-in" size={20} color="#D4AF37" />
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

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  simCardModalContainer: {
    backgroundColor: '#FFFFFF',
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
    backgroundColor: '#FFF5F5',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    paddingVertical: 25,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: '#FFE5E5',
  },
  simCardIconContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#FFE5E5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 3,
    borderColor: '#FF4444',
  },
  simCardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C1810',
    textAlign: 'center',
    lineHeight: 24,
  },
  simCardContent: {
    padding: 25,
  },
  simCardMessageContainer: {
    backgroundColor: '#FFF8E7',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#D4AF37',
  },
  simCardMessage: {
    fontSize: 16,
    color: '#2C1810',
    lineHeight: 22,
    textAlign: 'center',
  },
  securityFeaturesContainer: {
    marginBottom: 20,
  },
  securityFeaturesTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C1810',
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
    backgroundColor: '#FFF5F5',
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#FF4444',
  },
  securityFeatureText: {
    marginLeft: 12,
    fontSize: 14,
    color: '#8B4513',
    fontWeight: '500',
  },
  warningNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3CD',
    borderRadius: 10,
    padding: 15,
    borderWidth: 1,
    borderColor: '#F59E0B',
  },
  warningText: {
    marginLeft: 10,
    fontSize: 14,
    color: '#92400E',
    fontWeight: '600',
    flex: 1,
  },
  simCardActions: {
    padding: 20,
    paddingTop: 0,
    gap: 12,
  },
  paymentButton: {
    backgroundColor: '#D4AF37',
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
    borderWidth: 1,
    borderColor: '#B8860B',
  },
  paymentButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  emergencyButton: {
    backgroundColor: '#EF4444',
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
    borderWidth: 1,
    borderColor: '#DC2626',
  },
  emergencyButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  acknowledgeButton: {
    backgroundColor: '#6B7280',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#4B5563',
  },
  acknowledgeButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  // Authentication Modal Styles
  authModalContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    width: width - 40,
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 15,
    elevation: 15,
    borderWidth: 2,
    borderColor: '#D4AF37',
  },
  authHeader: {
    backgroundColor: '#FFF8E7',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    paddingVertical: 25,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: '#F5E6A3',
  },
  authIconContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#F5E6A3',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 3,
    borderColor: '#D4AF37',
  },
  authTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C1810',
    textAlign: 'center',
    marginBottom: 8,
  },
  authSubtitle: {
    fontSize: 16,
    color: '#8B4513',
    textAlign: 'center',
    lineHeight: 20,
  },
  authContent: {
    padding: 25,
  },
  authMessageContainer: {
    backgroundColor: '#FFF8E7',
    borderRadius: 12,
    padding: 18,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#D4AF37',
  },
  authMessage: {
    fontSize: 15,
    color: '#2C1810',
    lineHeight: 20,
    textAlign: 'center',
  },
  benefitsContainer: {
    marginBottom: 10,
  },
  benefitsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C1810',
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
    backgroundColor: '#FFF8E7',
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#D4AF37',
  },
  benefitText: {
    marginLeft: 12,
    fontSize: 14,
    color: '#8B4513',
    fontWeight: '500',
    flex: 1,
  },
  authActions: {
    padding: 20,
    paddingTop: 0,
    gap: 12,
  },
  signUpButton: {
    backgroundColor: '#D4AF37',
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
    borderWidth: 1,
    borderColor: '#B8860B',
  },
  signUpButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  loginButton: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#D4AF37',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  loginButtonText: {
    color: '#D4AF37',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  cancelButton: {
    backgroundColor: 'transparent',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#8B4513',
    fontSize: 15,
    fontWeight: '500',
  },
});

export default GlobalModalProvider;