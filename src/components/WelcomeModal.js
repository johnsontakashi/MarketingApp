import React, { useEffect, useRef } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

const WelcomeModal = ({ visible, onClose, userName, isAdmin = false }) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const sparkleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // Entrance animations
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
          tension: 50,
          friction: 7,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 700,
          useNativeDriver: true,
        }),
      ]).start();

      // Sparkle animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(sparkleAnim, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true,
          }),
          Animated.timing(sparkleAnim, {
            toValue: 0,
            duration: 1500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      // Reset animations
      scaleAnim.setValue(0);
      fadeAnim.setValue(0);
      slideAnim.setValue(50);
      sparkleAnim.setValue(0);
    }
  }, [visible]);

  const handleClose = () => {
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onClose();
    });
  };

  const sparkleOpacity = sparkleAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.3, 1, 0.3],
  });

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      statusBarTranslucent
      onRequestClose={handleClose}
    >
      <StatusBar backgroundColor="rgba(0,0,0,0.7)" barStyle="light-content" />
      
      {/* Background Overlay */}
      <Animated.View 
        style={[
          styles.overlay,
          {
            opacity: fadeAnim,
          }
        ]}
      >
        {/* Background Sparkles */}
        <Animated.View style={[styles.sparkle, styles.sparkle1, { opacity: sparkleOpacity }]}>
          <Ionicons name="star" size={12} color="#D4AF37" />
        </Animated.View>
        <Animated.View style={[styles.sparkle, styles.sparkle2, { opacity: sparkleOpacity }]}>
          <Ionicons name="diamond" size={10} color="#FFD700" />
        </Animated.View>
        <Animated.View style={[styles.sparkle, styles.sparkle3, { opacity: sparkleOpacity }]}>
          <Ionicons name="star" size={8} color="#B8860B" />
        </Animated.View>
        <Animated.View style={[styles.sparkle, styles.sparkle4, { opacity: sparkleOpacity }]}>
          <Ionicons name="diamond-outline" size={14} color="#DAA520" />
        </Animated.View>

        {/* Modal Content */}
        <Animated.View
          style={[
            styles.modalContainer,
            {
              transform: [
                { scale: scaleAnim },
                { translateY: slideAnim },
              ],
            },
          ]}
        >
          {/* Golden Border */}
          <View style={styles.goldenBorder}>
            {/* Header Section */}
            <View style={styles.header}>
              <View style={styles.iconContainer}>
                <View style={styles.iconBackground}>
                  <Ionicons 
                    name={isAdmin ? "shield-checkmark" : "diamond"} 
                    size={48} 
                    color="#FFFFFF" 
                  />
                </View>
                <View style={styles.iconShadow} />
              </View>
              
              <Text style={styles.title}>Welcome to</Text>
              <Text style={styles.brandName}>TLB Diamond</Text>
              
              {/* Crown decoration for admin */}
              {isAdmin && (
                <View style={styles.crownContainer}>
                  <Ionicons name="crown" size={24} color="#FFD700" />
                </View>
              )}
            </View>

            {/* Content Section */}
            <View style={styles.content}>
              <View style={styles.messageContainer}>
                <Text style={styles.successMessage}>
                  {isAdmin ? '👑 Admin Access Granted' : '🎉 Login Successful'}
                </Text>
                
                <Text style={styles.welcomeMessage}>
                  {isAdmin 
                    ? 'Admin successfully logged in to the App'
                    : `${userName} successfully logged in to this App`
                  }
                </Text>

                {/* Feature highlights */}
                <View style={styles.featuresContainer}>
                  <View style={styles.feature}>
                    <Ionicons name="checkmark-circle" size={16} color="#10B981" />
                    <Text style={styles.featureText}>
                      {isAdmin ? 'Full Administrative Access' : 'TLB Diamond Marketplace'}
                    </Text>
                  </View>
                  <View style={styles.feature}>
                    <Ionicons name="checkmark-circle" size={16} color="#10B981" />
                    <Text style={styles.featureText}>
                      {isAdmin ? 'User Management Tools' : 'Secure Digital Wallet'}
                    </Text>
                  </View>
                  <View style={styles.feature}>
                    <Ionicons name="checkmark-circle" size={16} color="#10B981" />
                    <Text style={styles.featureText}>
                      {isAdmin ? 'System Monitoring' : 'Community Features'}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Action Button */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.continueButton}
                onPress={handleClose}
                activeOpacity={0.8}
              >
                <Text style={styles.buttonText}>Continue to App</Text>
                <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  sparkle: {
    position: 'absolute',
  },
  sparkle1: {
    top: height * 0.15,
    left: width * 0.1,
  },
  sparkle2: {
    top: height * 0.25,
    right: width * 0.15,
  },
  sparkle3: {
    bottom: height * 0.3,
    left: width * 0.2,
  },
  sparkle4: {
    bottom: height * 0.2,
    right: width * 0.1,
  },
  modalContainer: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    overflow: 'hidden',
    elevation: 25,
    shadowColor: '#D4AF37',
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.4,
    shadowRadius: 25,
  },
  goldenBorder: {
    borderWidth: 3,
    borderColor: '#D4AF37',
    borderRadius: 21,
    backgroundColor: '#FFFFFF',
    margin: 3,
  },
  header: {
    alignItems: 'center',
    paddingTop: 30,
    paddingBottom: 20,
    backgroundColor: 'linear-gradient(135deg, #FFF8E7 0%, #F5E6A3 100%)',
    position: 'relative',
  },
  iconContainer: {
    marginBottom: 15,
    position: 'relative',
  },
  iconBackground: {
    width: 80,
    height: 80,
    backgroundColor: '#D4AF37',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#D4AF37',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  iconShadow: {
    position: 'absolute',
    top: 4,
    left: 4,
    width: 80,
    height: 80,
    backgroundColor: 'rgba(212, 175, 55, 0.3)',
    borderRadius: 40,
    zIndex: -1,
  },
  title: {
    fontSize: 18,
    color: '#8B4513',
    fontWeight: '500',
    marginBottom: 5,
  },
  brandName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#D4AF37',
    textShadowColor: 'rgba(212, 175, 55, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  crownContainer: {
    position: 'absolute',
    top: 10,
    right: 20,
  },
  content: {
    paddingHorizontal: 25,
    paddingVertical: 20,
  },
  messageContainer: {
    alignItems: 'center',
  },
  successMessage: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C1810',
    marginBottom: 10,
    textAlign: 'center',
  },
  welcomeMessage: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 20,
  },
  featuresContainer: {
    width: '100%',
    alignItems: 'flex-start',
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    paddingLeft: 10,
  },
  featureText: {
    fontSize: 14,
    color: '#4B5563',
    marginLeft: 8,
    fontWeight: '500',
  },
  buttonContainer: {
    paddingHorizontal: 25,
    paddingBottom: 25,
    paddingTop: 10,
  },
  continueButton: {
    backgroundColor: '#D4AF37',
    paddingVertical: 16,
    paddingHorizontal: 30,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#D4AF37',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginRight: 8,
  },
});

export default WelcomeModal;