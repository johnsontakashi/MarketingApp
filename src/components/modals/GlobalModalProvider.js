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

  // Register this context with the modal registry
  useEffect(() => {
    modalRegistry.setModalContext({
      showModal,
      hideModal,
      showSimCardModal
    });

    // Cleanup on unmount
    return () => {
      modalRegistry.setModalContext(null);
    };
  }, []);

  return (
    <GlobalModalContext.Provider value={{ showModal, hideModal, showSimCardModal }}>
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
});

export default GlobalModalProvider;