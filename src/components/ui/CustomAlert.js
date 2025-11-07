import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const CustomAlert = ({ 
  visible, 
  onClose, 
  title, 
  message, 
  buttons = [], 
  type = 'default', // 'success', 'error', 'warning', 'info', 'default'
  icon 
}) => {
  const getIconAndColor = () => {
    switch (type) {
      case 'success':
        return { icon: icon || 'checkmark-circle', color: '#10B981' };
      case 'error':
        return { icon: icon || 'close-circle', color: '#EF4444' };
      case 'warning':
        return { icon: icon || 'warning', color: '#F59E0B' };
      case 'info':
        return { icon: icon || 'information-circle', color: '#3B82F6' };
      default:
        return { icon: icon || 'help-circle', color: '#8B4513' };
    }
  };

  const { icon: alertIcon, color: iconColor } = getIconAndColor();

  const handleButtonPress = (button) => {
    if (button.onPress) {
      button.onPress();
    }
    onClose();
  };

  const defaultButtons = buttons.length > 0 ? buttons : [
    { text: 'OK', style: 'default' }
  ];

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.alertContainer}>
          <View style={styles.alertHeader}>
            <View style={[styles.iconContainer, { backgroundColor: `${iconColor}20` }]}>
              <Ionicons name={alertIcon} size={40} color={iconColor} />
            </View>
            <Text style={styles.alertTitle}>{title}</Text>
          </View>

          <View style={styles.alertContent}>
            <Text style={styles.alertMessage}>{message}</Text>
          </View>

          <View style={styles.alertActions}>
            {defaultButtons.map((button, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.alertButton,
                  button.style === 'cancel' && styles.cancelButton,
                  button.style === 'destructive' && styles.destructiveButton,
                  defaultButtons.length === 1 && styles.singleButton
                ]}
                onPress={() => handleButtonPress(button)}
              >
                <Text style={[
                  styles.alertButtonText,
                  button.style === 'cancel' && styles.cancelButtonText,
                  button.style === 'destructive' && styles.destructiveButtonText
                ]}>
                  {button.text}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  alertContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 28,
    width: width * 0.88,
    maxWidth: 420,
    shadowColor: 'rgba(0, 0, 0, 0.25)',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 20,
    borderWidth: 2,
    borderColor: '#D4AF37',
  },
  alertHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  iconContainer: {
    width: 88,
    height: 88,
    borderRadius: 44,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  alertTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1F2937',
    textAlign: 'center',
    lineHeight: 30,
    letterSpacing: 0.5,
  },
  alertContent: {
    marginBottom: 28,
  },
  alertMessage: {
    fontSize: 16,
    color: '#4B5563',
    textAlign: 'center',
    lineHeight: 26,
    letterSpacing: 0.2,
  },
  alertActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  alertButton: {
    flex: 1,
    backgroundColor: '#D4AF37',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 14,
    alignItems: 'center',
    marginHorizontal: 6,
    shadowColor: 'rgba(212, 175, 55, 0.4)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  singleButton: {
    backgroundColor: '#D4AF37',
    marginHorizontal: 0,
  },
  cancelButton: {
    backgroundColor: '#F3F4F6',
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  destructiveButton: {
    backgroundColor: '#EF4444',
    shadowColor: 'rgba(239, 68, 68, 0.4)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  alertButtonText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  cancelButtonText: {
    color: '#6B7280',
    fontWeight: '600',
  },
  destructiveButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});

export default CustomAlert;