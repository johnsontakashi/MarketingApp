import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
  BackHandler
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

export default function PaymentRequiredModal({ 
  visible, 
  onClose, 
  onPayNow, 
  onEmergencySupport,
  title = 'Payment Required',
  message = 'Complete your payment to continue using the device.',
  amount = null,
  dueDate = null,
  type = 'standard', // 'standard', 'warning', 'urgent', 'emergency'
  countdown = null,
  showCancel = true
}) {
  const [scaleAnim] = useState(new Animated.Value(0));
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    if (visible) {
      // Prevent hardware back button
      const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
        return true; // Prevent default behavior
      });

      // Animate in
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
      ]).start();

      return () => backHandler.remove();
    } else {
      // Animate out
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const getThemeColors = () => {
    switch (type) {
      case 'warning':
        return {
          primary: '#F59E0B',
          background: '#FFFBEB',
          border: '#F59E0B',
          icon: 'warning',
          iconColor: '#F59E0B'
        };
      case 'urgent':
        return {
          primary: '#EF4444',
          background: '#FEF2F2',
          border: '#EF4444',
          icon: 'time',
          iconColor: '#EF4444'
        };
      case 'emergency':
        return {
          primary: '#DC2626',
          background: '#FECACA',
          border: '#DC2626',
          icon: 'alert-circle',
          iconColor: '#DC2626'
        };
      default: // standard
        return {
          primary: '#D4AF37',
          background: '#FFF8E7',
          border: '#D4AF37',
          icon: 'card',
          iconColor: '#D4AF37'
        };
    }
  };

  const theme = getThemeColors();

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="none"
      onRequestClose={() => {
        if (showCancel) {
          onClose?.();
        }
        return true;
      }}
    >
      <Animated.View 
        style={[
          styles.overlay,
          {
            opacity: fadeAnim,
          }
        ]}
      >
        <Animated.View
          style={[
            styles.modalContainer,
            {
              backgroundColor: theme.background,
              borderColor: theme.border,
              transform: [{ scale: scaleAnim }],
            }
          ]}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={[styles.iconContainer, { backgroundColor: `${theme.primary}20` }]}>
              <Ionicons 
                name={theme.icon} 
                size={50} 
                color={theme.iconColor} 
              />
            </View>
            
            <Text style={[styles.title, { color: theme.primary }]}>
              {title}
            </Text>
            
            {showCancel && (
              <TouchableOpacity
                style={styles.closeButton}
                onPress={onClose}
                hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
              >
                <Ionicons name="close" size={28} color="#8B4513" />
              </TouchableOpacity>
            )}
          </View>

          {/* Content */}
          <View style={styles.content}>
            <Text style={styles.message}>{message}</Text>

            {/* Payment Amount */}
            {amount && (
              <View style={[styles.amountContainer, { borderColor: theme.primary }]}>
                <Text style={styles.amountLabel}>Amount Due:</Text>
                <Text style={[styles.amount, { color: theme.primary }]}>
                  💎 {amount} TLB
                </Text>
                {dueDate && (
                  <Text style={styles.dueDate}>Due: {dueDate}</Text>
                )}
              </View>
            )}

            {/* Countdown Timer */}
            {countdown && (
              <View style={[styles.countdownContainer, { backgroundColor: `${theme.primary}10` }]}>
                <Text style={styles.countdownLabel}>Time Remaining:</Text>
                <Text style={[styles.countdown, { color: theme.primary }]}>
                  {countdown}
                </Text>
              </View>
            )}

            {/* Warning Message for Emergency Types */}
            {(type === 'urgent' || type === 'emergency') && (
              <View style={styles.warningContainer}>
                <Ionicons name="warning" size={20} color="#EF4444" />
                <Text style={styles.warningText}>
                  {type === 'emergency' 
                    ? 'Device will be fully locked if payment is not made immediately.'
                    : 'Device restrictions will escalate if payment is not made soon.'
                  }
                </Text>
              </View>
            )}
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            {/* Primary Pay Button */}
            <TouchableOpacity
              style={[styles.payButton, { backgroundColor: theme.primary }]}
              onPress={onPayNow}
              activeOpacity={0.8}
            >
              <Ionicons name="card" size={24} color="#FFFFFF" />
              <Text style={styles.payButtonText}>Pay Now</Text>
            </TouchableOpacity>

            {/* Secondary Actions */}
            <View style={styles.secondaryButtons}>
              {onEmergencySupport && (
                <TouchableOpacity
                  style={styles.emergencyButton}
                  onPress={onEmergencySupport}
                  activeOpacity={0.8}
                >
                  <Ionicons name="medical" size={20} color="#EF4444" />
                  <Text style={styles.emergencyButtonText}>Emergency Support</Text>
                </TouchableOpacity>
              )}

              {showCancel && (
                <TouchableOpacity
                  style={[styles.laterButton, { borderColor: theme.primary }]}
                  onPress={onClose}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.laterButtonText, { color: theme.primary }]}>
                    Remind Later
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Footer Info */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              For assistance: 📞 1-800-TLB-HELP • 📧 support@tlbdiamond.com
            </Text>
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    width: Math.min(width - 40, 420),
    maxHeight: height - 100,
    borderRadius: 24,
    borderWidth: 3,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 20,
  },
  header: {
    padding: 30,
    paddingBottom: 20,
    alignItems: 'center',
    position: 'relative',
  },
  iconContainer: {
    width: 90,
    height: 90,
    borderRadius: 45,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 32,
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(139, 69, 19, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    paddingHorizontal: 30,
    paddingBottom: 20,
  },
  message: {
    fontSize: 18,
    color: '#8B4513',
    textAlign: 'center',
    lineHeight: 26,
    marginBottom: 25,
  },
  amountContainer: {
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 2,
  },
  amountLabel: {
    fontSize: 16,
    color: '#8B4513',
    fontWeight: '600',
    marginBottom: 8,
  },
  amount: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  dueDate: {
    fontSize: 14,
    color: '#B8860B',
    fontWeight: '500',
  },
  countdownContainer: {
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 20,
  },
  countdownLabel: {
    fontSize: 14,
    color: '#8B4513',
    fontWeight: '600',
    marginBottom: 8,
  },
  countdown: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  warningContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#FCA5A5',
    marginBottom: 20,
  },
  warningText: {
    flex: 1,
    fontSize: 14,
    color: '#991B1B',
    fontWeight: '500',
    marginLeft: 10,
    lineHeight: 20,
  },
  buttonContainer: {
    paddingHorizontal: 30,
    paddingBottom: 30,
    gap: 15,
  },
  payButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    borderRadius: 16,
    shadowColor: '#D4AF37',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  payButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 12,
  },
  secondaryButtons: {
    gap: 12,
  },
  emergencyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: '#FEF2F2',
    borderWidth: 2,
    borderColor: '#FCA5A5',
  },
  emergencyButtonText: {
    color: '#EF4444',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  laterButton: {
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  laterButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    paddingHorizontal: 30,
    paddingBottom: 25,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(139, 69, 19, 0.15)',
  },
  footerText: {
    fontSize: 12,
    color: '#B8860B',
    textAlign: 'center',
    lineHeight: 16,
  },
});