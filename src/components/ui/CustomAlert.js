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
    borderRadius: 20,
    padding: 24,
    width: width * 0.85,
    maxWidth: 400,
    shadowColor: 'rgba(0, 0, 0, 0.3)',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 12,
  },
  alertHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  alertTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    textAlign: 'center',
    lineHeight: 28,
  },
  alertContent: {
    marginBottom: 24,
  },
  alertMessage: {
    fontSize: 16,
    color: '#4B5563',
    textAlign: 'center',
    lineHeight: 24,
  },
  alertActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  alertButton: {
    flex: 1,
    backgroundColor: '#D4AF37',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  singleButton: {
    backgroundColor: '#D4AF37',
  },
  cancelButton: {
    backgroundColor: '#F3F4F6',
  },
  destructiveButton: {
    backgroundColor: '#EF4444',
  },
  alertButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  cancelButtonText: {
    color: '#6B7280',
  },
  destructiveButtonText: {
    color: '#FFFFFF',
  },
});

export default CustomAlert;