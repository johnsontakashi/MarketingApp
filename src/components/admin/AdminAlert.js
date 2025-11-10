import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function AdminAlert({ 
  visible, 
  type = 'info', // 'info', 'success', 'warning', 'error', 'confirm'
  title, 
  message, 
  buttons = [], 
  onClose,
  icon
}) {
  const getIconName = () => {
    if (icon) return icon;
    switch (type) {
      case 'success': return 'checkmark-circle';
      case 'warning': return 'warning';
      case 'error': return 'alert-circle';
      case 'confirm': return 'help-circle';
      default: return 'information-circle';
    }
  };

  const getIconColor = () => {
    switch (type) {
      case 'success': return '#10B981';
      case 'warning': return '#F59E0B';
      case 'error': return '#EF4444';
      case 'confirm': return '#D4AF37';
      default: return '#3B82F6';
    }
  };

  const getHeaderColor = () => {
    switch (type) {
      case 'success': return '#10B981';
      case 'warning': return '#F59E0B';
      case 'error': return '#EF4444';
      case 'confirm': return '#D4AF37';
      default: return '#D4AF37';
    }
  };

  const handleButtonPress = (button) => {
    if (button.onPress) {
      button.onPress();
    }
    if (onClose) {
      onClose();
    }
  };

  const renderButtons = () => {
    if (buttons.length === 0) {
      return (
        <TouchableOpacity
          style={[styles.button, styles.primaryButton]}
          onPress={onClose}
          activeOpacity={0.8}
        >
          <Text style={styles.primaryButtonText}>OK</Text>
        </TouchableOpacity>
      );
    }

    return buttons.map((button, index) => {
      const isDestructive = button.style === 'destructive';
      const isCancel = button.style === 'cancel';
      const isPrimary = !isDestructive && !isCancel;

      return (
        <TouchableOpacity
          key={index}
          style={[
            styles.button,
            isPrimary && styles.primaryButton,
            isDestructive && styles.destructiveButton,
            isCancel && styles.cancelButton,
            buttons.length > 1 && index < buttons.length - 1 && styles.buttonMargin
          ]}
          onPress={() => handleButtonPress(button)}
          activeOpacity={0.8}
        >
          <Text style={[
            isPrimary && styles.primaryButtonText,
            isDestructive && styles.destructiveButtonText,
            isCancel && styles.cancelButtonText
          ]}>
            {button.text}
          </Text>
        </TouchableOpacity>
      );
    });
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.alertContainer}>
          {/* Header with Icon */}
          <View style={[styles.header, { backgroundColor: getHeaderColor() + '15' }]}>
            <View style={[styles.iconContainer, { backgroundColor: getIconColor() }]}>
              <Ionicons name={getIconName()} size={32} color="#FFFFFF" />
            </View>
          </View>

          {/* Content */}
          <View style={styles.content}>
            {title && <Text style={styles.title}>{title}</Text>}
            {message && <Text style={styles.message}>{message}</Text>}
          </View>

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            {renderButtons()}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  alertContainer: {
    backgroundColor: '#2d2d2d',
    borderRadius: 16,
    width: width * 0.85,
    maxWidth: 400,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  header: {
    alignItems: 'center',
    paddingTop: 24,
    paddingBottom: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  content: {
    padding: 24,
    paddingTop: 16,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
  },
  message: {
    color: '#D1D5DB',
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    padding: 16,
    paddingTop: 0,
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  buttonMargin: {
    marginRight: 0,
  },
  primaryButton: {
    backgroundColor: '#D4AF37',
  },
  destructiveButton: {
    backgroundColor: '#EF4444',
  },
  cancelButton: {
    backgroundColor: '#6B7280',
    borderWidth: 1.5,
    borderColor: '#9CA3AF',
  },
  primaryButtonText: {
    color: '#1a1a1a',
    fontSize: 16,
    fontWeight: '600',
  },
  destructiveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
});