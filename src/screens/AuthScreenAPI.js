import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput,
  TouchableOpacity, 
  ScrollView,
  StyleSheet, 
  Alert,
  Dimensions,
  Modal,
  Platform,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';
import apiClient, { ApiError } from '../services/api';

const { width } = Dimensions.get('window');

export default function AuthScreen({ navigation, route, onAuthSuccess }) {
  // Get onAuthSuccess from props (preferred) or route params (fallback)
  const authSuccessCallback = onAuthSuccess || (route?.params?.onAuthSuccess);
  const [isLogin, setIsLogin] = useState(true);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: '',
    gender: '',
    accountType: 'individual',
    referralCode: ''
  });
  const [selectedDate, setSelectedDate] = useState({
    day: '',
    month: '',
    year: '',
    date: null
  });

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    const { email, password, confirmPassword, firstName, lastName } = formData;
    
    if (!email) {
      Alert.alert('Validation Error', 'Email is required');
      return false;
    }

    if (!validateEmail(email)) {
      Alert.alert('Validation Error', 'Please enter a valid email address');
      return false;
    }

    if (!password) {
      Alert.alert('Validation Error', 'Password is required');
      return false;
    }

    if (password.length < 6) {
      Alert.alert('Validation Error', 'Password must be at least 6 characters long');
      return false;
    }

    if (!isLogin) {
      if (!firstName) {
        Alert.alert('Validation Error', 'First name is required');
        return false;
      }
      
      if (!lastName) {
        Alert.alert('Validation Error', 'Last name is required');
        return false;
      }

      if (!confirmPassword) {
        Alert.alert('Validation Error', 'Please confirm your password');
        return false;
      }

      if (password !== confirmPassword) {
        Alert.alert('Validation Error', 'Passwords do not match');
        return false;
      }
    }

    return true;
  };

  const handleAuth = async () => {
    console.log('handleAuth called', { isLogin, email: formData.email, passwordLength: formData.password.length });
    
    if (!validateForm()) {
      console.log('Form validation failed');
      return;
    }

    setIsLoading(true);

    try {
      const { email, password, confirmPassword, ...profileData } = formData;
      console.log('Starting authentication process', { isLogin, email });

      if (isLogin) {
        // Login with API
        console.log('Attempting API login');
        const response = await apiClient.login(email, password);
        
        console.log('Login successful:', response.user);
        
        // Store user data
        await SecureStore.setItemAsync('currentUser', JSON.stringify({
          ...response.user,
          isVerified: true,
          canSell: response.user.role === 'admin',
          canBuy: true,
          isAdmin: response.user.role === 'admin'
        }));
        
        if (authSuccessCallback) {
          authSuccessCallback();
        }
      } else {
        // Registration with API
        console.log('Attempting API registration');
        
        const registrationData = {
          email,
          password,
          firstName: profileData.firstName,
          lastName: profileData.lastName,
          phone: profileData.phone,
          gender: profileData.gender,
          birthday: selectedDate.date ? selectedDate.date.toISOString() : null,
          accountType: profileData.accountType,
          referralCode: profileData.referralCode
        };

        const response = await apiClient.register(registrationData);
        
        console.log('Registration successful:', response.user);
        
        // Store user data
        await SecureStore.setItemAsync('currentUser', JSON.stringify({
          ...response.user,
          isVerified: true,
          canSell: response.user.role === 'admin',
          canBuy: true,
          isAdmin: response.user.role === 'admin'
        }));
        
        if (authSuccessCallback) {
          authSuccessCallback();
        }
      }
    } catch (error) {
      console.error('Auth error:', error);
      
      let errorMessage = 'Authentication failed';
      
      if (error instanceof ApiError) {
        if (error.isNetworkError()) {
          errorMessage = 'Network error. Please check your connection and try again.';
        } else if (error.isValidationError()) {
          errorMessage = error.message;
        } else if (error.status === 409) {
          errorMessage = 'An account with this email already exists.';
        } else if (error.status === 401) {
          errorMessage = 'Invalid email or password.';
        } else {
          errorMessage = error.message;
        }
      } else {
        errorMessage = error.message || 'An unexpected error occurred.';
      }
      
      Alert.alert('Authentication Failed', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDateSelection = (day, month, year) => {
    if (day && month && year && day !== '' && month !== '' && year !== '') {
      const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      setSelectedDate({ day, month, year, date });
      setShowDatePicker(false);
    }
  };

  const formatDate = () => {
    if (selectedDate.day && selectedDate.month && selectedDate.year) {
      return `${selectedDate.month}/${selectedDate.day}/${selectedDate.year}`;
    }
    return '';
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Text style={styles.logoText}>💎 TLB DIAMOND</Text>
          </View>
          <Text style={styles.subtitle}>
            {isLogin ? 'Welcome back! Sign in to your account' : 'Create your TLB Diamond account'}
          </Text>
        </View>

        {/* Auth Toggle */}
        <View style={styles.toggleContainer}>
          <TouchableOpacity 
            style={[styles.toggleButton, isLogin && styles.activeToggle]}
            onPress={() => setIsLogin(true)}
          >
            <Text style={[styles.toggleText, isLogin && styles.activeToggleText]}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.toggleButton, !isLogin && styles.activeToggle]}
            onPress={() => setIsLogin(false)}
          >
            <Text style={[styles.toggleText, !isLogin && styles.activeToggleText]}>Register</Text>
          </TouchableOpacity>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Email Address</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              placeholderTextColor="#8B4513"
              value={formData.email}
              onChangeText={(text) => setFormData({...formData, email: text})}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your password"
              placeholderTextColor="#8B4513"
              value={formData.password}
              onChangeText={(text) => setFormData({...formData, password: text})}
              secureTextEntry={true}
            />
          </View>

          {!isLogin && (
            <>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Confirm Password</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Confirm your password"
                  placeholderTextColor="#8B4513"
                  value={formData.confirmPassword}
                  onChangeText={(text) => setFormData({...formData, confirmPassword: text})}
                  secureTextEntry={true}
                />
              </View>

              <View style={styles.row}>
                <View style={styles.halfInputGroup}>
                  <Text style={styles.inputLabel}>First Name</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="First name"
                    placeholderTextColor="#8B4513"
                    value={formData.firstName}
                    onChangeText={(text) => setFormData({...formData, firstName: text})}
                  />
                </View>
                <View style={styles.halfInputGroup}>
                  <Text style={styles.inputLabel}>Last Name</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Last name"
                    placeholderTextColor="#8B4513"
                    value={formData.lastName}
                    onChangeText={(text) => setFormData({...formData, lastName: text})}
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Phone (Optional)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your phone number"
                  placeholderTextColor="#8B4513"
                  value={formData.phone}
                  onChangeText={(text) => setFormData({...formData, phone: text})}
                  keyboardType="phone-pad"
                />
              </View>

              <View style={styles.row}>
                <View style={styles.halfInputGroup}>
                  <Text style={styles.inputLabel}>Gender (Optional)</Text>
                  <View style={styles.genderContainer}>
                    {['male', 'female', 'other'].map((gender) => (
                      <TouchableOpacity
                        key={gender}
                        style={[
                          styles.genderOption,
                          formData.gender === gender && styles.selectedGender
                        ]}
                        onPress={() => setFormData({...formData, gender})}
                      >
                        <Text style={[
                          styles.genderText,
                          formData.gender === gender && styles.selectedGenderText
                        ]}>
                          {gender.charAt(0).toUpperCase() + gender.slice(1)}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                <View style={styles.halfInputGroup}>
                  <Text style={styles.inputLabel}>Birthday (Optional)</Text>
                  <TouchableOpacity
                    style={styles.dateButton}
                    onPress={() => setShowDatePicker(true)}
                  >
                    <Text style={styles.dateText}>
                      {formatDate() || 'Select birthday'}
                    </Text>
                    <Ionicons name="calendar" size={20} color="#8B4513" />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Referral Code (Optional)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter referral code"
                  placeholderTextColor="#8B4513"
                  value={formData.referralCode}
                  onChangeText={(text) => setFormData({...formData, referralCode: text.toUpperCase()})}
                  autoCapitalize="characters"
                />
              </View>
            </>
          )}
        </View>

        {/* Auth Button */}
        <TouchableOpacity 
          style={[styles.authButton, isLoading && styles.authButtonDisabled]}
          onPress={handleAuth}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.authButtonText}>
              {isLogin ? 'Login' : 'Create Account'}
            </Text>
          )}
        </TouchableOpacity>

        {/* Test Login Button (Development) */}
        {__DEV__ && (
          <TouchableOpacity 
            style={styles.testButton}
            onPress={() => {
              setFormData({
                ...formData,
                email: 'admin@tlbdiamond.com',
                password: 'TLBAdmin2024!'
              });
              setTimeout(() => {
                handleAuth();
              }, 100);
            }}
          >
            <Text style={styles.testButtonText}>
              Quick Admin Login (Test)
            </Text>
          </TouchableOpacity>
        )}

        {/* Date Picker Modal */}
        <Modal
          visible={showDatePicker}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowDatePicker(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.datePickerModal}>
              <Text style={styles.datePickerTitle}>Select Birthday</Text>
              
              <View style={styles.dateInputs}>
                <TextInput
                  style={styles.dateInput}
                  placeholder="MM"
                  value={selectedDate.month}
                  onChangeText={(text) => setSelectedDate({...selectedDate, month: text})}
                  keyboardType="numeric"
                  maxLength={2}
                />
                <Text style={styles.dateSeparator}>/</Text>
                <TextInput
                  style={styles.dateInput}
                  placeholder="DD"
                  value={selectedDate.day}
                  onChangeText={(text) => setSelectedDate({...selectedDate, day: text})}
                  keyboardType="numeric"
                  maxLength={2}
                />
                <Text style={styles.dateSeparator}>/</Text>
                <TextInput
                  style={[styles.dateInput, styles.yearInput]}
                  placeholder="YYYY"
                  value={selectedDate.year}
                  onChangeText={(text) => setSelectedDate({...selectedDate, year: text})}
                  keyboardType="numeric"
                  maxLength={4}
                />
              </View>

              <View style={styles.datePickerButtons}>
                <TouchableOpacity
                  style={styles.datePickerCancel}
                  onPress={() => setShowDatePicker(false)}
                >
                  <Text style={styles.datePickerCancelText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.datePickerConfirm}
                  onPress={() => {
                    handleDateSelection(selectedDate.day, selectedDate.month, selectedDate.year);
                  }}
                >
                  <Text style={styles.datePickerConfirmText}>Confirm</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </View>
  );
}

// Styles remain the same as the original
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8E7',
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  logoContainer: {
    marginBottom: 20,
  },
  logoText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2C1810',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#8B4513',
    textAlign: 'center',
    lineHeight: 22,
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#F5E6A3',
    borderRadius: 12,
    margin: 20,
    padding: 4,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeToggle: {
    backgroundColor: '#D4AF37',
  },
  toggleText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8B4513',
  },
  activeToggleText: {
    color: '#FFFFFF',
  },
  form: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  inputGroup: {
    marginBottom: 20,
  },
  halfInputGroup: {
    flex: 1,
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 15,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C1810',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#D4AF37',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#2C1810',
  },
  genderContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  genderOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#D4AF37',
    backgroundColor: '#FFFFFF',
  },
  selectedGender: {
    backgroundColor: '#D4AF37',
  },
  genderText: {
    fontSize: 14,
    color: '#8B4513',
    fontWeight: '500',
  },
  selectedGenderText: {
    color: '#FFFFFF',
  },
  dateButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#D4AF37',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 16,
    color: '#2C1810',
  },
  authButton: {
    backgroundColor: '#D4AF37',
    borderRadius: 12,
    paddingVertical: 16,
    marginHorizontal: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  authButtonDisabled: {
    opacity: 0.7,
  },
  authButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  testButton: {
    backgroundColor: '#8B4513',
    borderRadius: 12,
    paddingVertical: 12,
    marginHorizontal: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  testButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  datePickerModal: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 300,
    borderWidth: 2,
    borderColor: '#D4AF37',
  },
  datePickerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C1810',
    textAlign: 'center',
    marginBottom: 20,
  },
  dateInputs: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  dateInput: {
    borderWidth: 1,
    borderColor: '#D4AF37',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    textAlign: 'center',
    backgroundColor: '#FFF8E7',
    color: '#2C1810',
    width: 50,
  },
  yearInput: {
    width: 70,
  },
  dateSeparator: {
    fontSize: 18,
    color: '#8B4513',
    marginHorizontal: 8,
    fontWeight: 'bold',
  },
  datePickerButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  datePickerCancel: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginRight: 8,
  },
  datePickerCancelText: {
    color: '#6B7280',
    fontSize: 16,
    fontWeight: '600',
  },
  datePickerConfirm: {
    flex: 1,
    backgroundColor: '#D4AF37',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginLeft: 8,
  },
  datePickerConfirmText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});