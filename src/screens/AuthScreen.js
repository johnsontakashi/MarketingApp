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
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';

const { width } = Dimensions.get('window');

export default function AuthScreen({ navigation, route, onAuthSuccess }) {
  // Get onAuthSuccess from props (preferred) or route params (fallback)
  const authSuccessCallback = onAuthSuccess || (route?.params?.onAuthSuccess);
  const [isLogin, setIsLogin] = useState(true);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    sex: '',
    birthday: '',
    userType: 'buyer'
  });
  const [selectedDate, setSelectedDate] = useState({
    day: '',
    month: '',
    year: ''
  });

  const userTypes = [
    { 
      key: 'buyer', 
      label: 'Buyer', 
      description: 'Shop and purchase products\n(Can also sell products later)',
      icon: 'bag',
      color: '#3B82F6'
    },
    { 
      key: 'seller', 
      label: 'Seller', 
      description: 'Sell products on the marketplace\n(Can also buy products)',
      icon: 'storefront',
      color: '#10B981'
    }
  ];

  // Pre-defined admin credentials (only one admin allowed)
  const ADMIN_CREDENTIALS = {
    email: 'admin@tlbdiamond.com',
    password: 'TLBAdmin2024!',
    firstName: 'System',
    lastName: 'Administrator',
    phoneNumber: '+1-800-TLB-ADMIN',
    sex: 'other',
    birthday: '01/01/1990',
    userType: 'admin'
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const getCurrentYear = () => new Date().getFullYear();
  const getYears = () => {
    const currentYear = getCurrentYear();
    const years = [];
    for (let i = currentYear; i >= currentYear - 100; i--) {
      years.push(i.toString());
    }
    return years;
  };

  const getDaysInMonth = (month, year) => {
    if (!month || !year) return 31;
    return new Date(parseInt(year), parseInt(month), 0).getDate();
  };

  const handleDateSelection = () => {
    if (selectedDate.day && selectedDate.month && selectedDate.year) {
      const formattedDate = `${selectedDate.month.padStart(2, '0')}/${selectedDate.day.padStart(2, '0')}/${selectedDate.year}`;
      setFormData(prev => ({
        ...prev,
        birthday: formattedDate
      }));
      setShowDatePicker(false);
    }
  };

  const validateForm = () => {
    const { email, password, confirmPassword, firstName, lastName, phoneNumber, sex } = formData;

    if (!email.trim()) {
      Alert.alert('Validation Error', 'Email is required');
      return false;
    }

    if (!email.includes('@') || !email.includes('.')) {
      Alert.alert('Validation Error', 'Please enter a valid email address');
      return false;
    }

    if (password.length < 6) {
      Alert.alert('Validation Error', 'Password must be at least 6 characters');
      return false;
    }

    if (!isLogin) {
      if (password !== confirmPassword) {
        Alert.alert('Validation Error', 'Passwords do not match');
        return false;
      }

      if (!firstName.trim() || !lastName.trim()) {
        Alert.alert('Validation Error', 'First name and last name are required');
        return false;
      }

      if (!phoneNumber.trim()) {
        Alert.alert('Validation Error', 'Phone number is required');
        return false;
      }

      if (!sex) {
        Alert.alert('Validation Error', 'Please select your gender');
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

    try {
      const { email, password, ...profileData } = formData;
      console.log('Starting authentication process', { isLogin, email });

      if (isLogin) {
        // Check if trying to login as admin
        console.log('Checking admin credentials', { 
          email, 
          adminEmail: ADMIN_CREDENTIALS.email, 
          emailMatch: email === ADMIN_CREDENTIALS.email,
          passwordMatch: password === ADMIN_CREDENTIALS.password 
        });
        
        if (email === ADMIN_CREDENTIALS.email) {
          if (password === ADMIN_CREDENTIALS.password) {
            // Store admin session
            await SecureStore.setItemAsync('currentUser', JSON.stringify({
              ...ADMIN_CREDENTIALS,
              registeredAt: new Date().toISOString(),
              isVerified: true,
              canSell: true,
              canBuy: true,
              isAdmin: true
            }));
            
            // Success - trigger callback immediately without alert for now
            console.log('Admin login successful, triggering callback...');
            if (authSuccessCallback) {
              authSuccessCallback();
            } else {
              console.error('No auth success callback provided');
            }
            return;
          } else {
            Alert.alert('Login Failed', 'Invalid admin password');
            return;
          }
        }

        // Regular user login logic
        const storedUser = await SecureStore.getItemAsync(`user_${email}`);
        
        if (!storedUser) {
          Alert.alert('Login Failed', 'User not found. Please register first.');
          return;
        }

        const userData = JSON.parse(storedUser);
        
        if (userData.password !== password) {
          Alert.alert('Login Failed', 'Incorrect password');
          return;
        }

        // Store current session
        await SecureStore.setItemAsync('currentUser', JSON.stringify(userData));
        
        // Success - trigger callback immediately
        console.log('Regular user login successful, triggering callback...');
        if (authSuccessCallback) {
          authSuccessCallback();
        } else {
          console.error('No auth success callback provided');
        }

      } else {
        // Registration logic - prevent using admin email
        if (email === ADMIN_CREDENTIALS.email) {
          Alert.alert('Registration Failed', 'This email is reserved for system administration.');
          return;
        }

        const existingUser = await SecureStore.getItemAsync(`user_${email}`);
        
        if (existingUser) {
          Alert.alert('Registration Failed', 'User already exists. Please login instead.');
          return;
        }

        const newUser = {
          email,
          password,
          firstName: profileData.firstName,
          lastName: profileData.lastName,
          phoneNumber: profileData.phoneNumber,
          sex: profileData.sex,
          birthday: profileData.birthday,
          userType: profileData.userType,
          registeredAt: new Date().toISOString(),
          isVerified: profileData.userType !== 'admin',
          canSell: true, // All users can potentially sell
          canBuy: true   // All users can buy
        };

        // Store user data
        await SecureStore.setItemAsync(`user_${email}`, JSON.stringify(newUser));
        await SecureStore.setItemAsync('currentUser', JSON.stringify(newUser));

        // Success - trigger callback immediately
        console.log('Registration successful, triggering callback...');
        if (authSuccessCallback) {
          authSuccessCallback();
        } else {
          console.error('No auth success callback provided');
        }
      }

    } catch (error) {
      console.error('Auth error:', error);
      Alert.alert('Error', 'An error occurred. Please try again.');
    }
  };

  const renderUserTypeSelector = () => (
    <View style={styles.userTypeContainer}>
      <Text style={styles.label}>Account Type</Text>
      <View style={styles.userTypeGrid}>
        {userTypes.map(type => (
          <TouchableOpacity
            key={type.key}
            style={[
              styles.userTypeCard,
              { borderColor: type.color },
              formData.userType === type.key && { backgroundColor: `${type.color}15`, borderWidth: 2 }
            ]}
            onPress={() => handleInputChange('userType', type.key)}
          >
            <Ionicons name={type.icon} size={32} color={type.color} />
            <Text style={[styles.userTypeLabel, { color: type.color }]}>{type.label}</Text>
            <Text style={styles.userTypeDescription}>{type.description}</Text>
            {formData.userType === type.key && (
              <View style={[styles.selectedIndicator, { backgroundColor: type.color }]}>
                <Ionicons name="checkmark" size={16} color="#FFFFFF" />
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>TLB Diamond</Text>
        <Text style={styles.subtitle}>
          {isLogin ? 'Welcome Back' : 'Create Your Account'}
        </Text>
      </View>

      {/* Auth Toggle */}
      <View style={styles.toggleContainer}>
        <TouchableOpacity
          style={[styles.toggleButton, isLogin && styles.toggleButtonActive]}
          onPress={() => setIsLogin(true)}
        >
          <Text style={[styles.toggleText, isLogin && styles.toggleTextActive]}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleButton, !isLogin && styles.toggleButtonActive]}
          onPress={() => setIsLogin(false)}
        >
          <Text style={[styles.toggleText, !isLogin && styles.toggleTextActive]}>Register</Text>
        </TouchableOpacity>
      </View>

      {/* Form */}
      <View style={styles.formContainer}>
        {/* Email */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email Address *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            value={formData.email}
            onChangeText={(value) => handleInputChange('email', value)}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        {/* Password */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Password *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your password"
            value={formData.password}
            onChangeText={(value) => handleInputChange('password', value)}
            secureTextEntry
          />
        </View>

        {/* Registration Fields */}
        {!isLogin && (
          <>
            {/* Confirm Password */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Confirm Password *</Text>
              <TextInput
                style={styles.input}
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChangeText={(value) => handleInputChange('confirmPassword', value)}
                secureTextEntry
              />
            </View>

            {/* Name */}
            <View style={styles.nameRow}>
              <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
                <Text style={styles.label}>First Name *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="First name"
                  value={formData.firstName}
                  onChangeText={(value) => handleInputChange('firstName', value)}
                />
              </View>
              <View style={[styles.inputGroup, { flex: 1, marginLeft: 10 }]}>
                <Text style={styles.label}>Last Name *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Last name"
                  value={formData.lastName}
                  onChangeText={(value) => handleInputChange('lastName', value)}
                />
              </View>
            </View>

            {/* Phone Number */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Phone Number *</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your phone number"
                value={formData.phoneNumber}
                onChangeText={(value) => handleInputChange('phoneNumber', value)}
                keyboardType="phone-pad"
              />
            </View>

            {/* Sex */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Gender *</Text>
              <View style={styles.genderContainer}>
                {['male', 'female', 'other'].map(gender => (
                  <TouchableOpacity
                    key={gender}
                    style={[
                      styles.genderButton,
                      formData.sex === gender && styles.genderButtonActive
                    ]}
                    onPress={() => handleInputChange('sex', gender)}
                  >
                    <Text style={[
                      styles.genderText,
                      formData.sex === gender && styles.genderTextActive
                    ]}>
                      {gender.charAt(0).toUpperCase() + gender.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Birthday */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Birthday *</Text>
              <TouchableOpacity
                style={styles.dateButton}
                onPress={() => setShowDatePicker(true)}
              >
                <Text style={styles.dateText}>
                  {formData.birthday || 'Select your birthday'}
                </Text>
                <Ionicons name="calendar" size={20} color="#D4AF37" />
              </TouchableOpacity>
            </View>

            {/* User Type Selector */}
            {renderUserTypeSelector()}
          </>
        )}

        {/* Auth Button */}
        <TouchableOpacity 
          style={styles.authButton} 
          onPress={() => {
            console.log('Button pressed!');
            handleAuth();
          }}
        >
          <Text style={styles.authButtonText}>
            {isLogin ? 'Login' : 'Create Account'}
          </Text>
        </TouchableOpacity>

        {/* Debug/Test Button - Remove in production */}
        {isLogin && (
          <TouchableOpacity 
            style={[styles.authButton, { backgroundColor: '#10B981', marginTop: 10 }]} 
            onPress={() => {
              console.log('Quick admin login test');
              setFormData(prev => ({
                ...prev,
                email: 'admin@tlbdiamond.com',
                password: 'TLBAdmin2024!'
              }));
              setTimeout(() => {
                handleAuth();
              }, 100);
            }}
          >
            <Text style={styles.authButtonText}>
              Quick Admin Login (Test)
            </Text>
          </TouchableOpacity>
        )}

        {/* Additional Info */}
        {!isLogin && (
          <View style={styles.infoContainer}>
            <Text style={styles.infoText}>
              ℹ️ Note: Buyers can also sell products after registration.
              Sellers have additional marketplace tools available.{'\n\n'}
              🔒 Administrator access is restricted and not available through public registration.
            </Text>
          </View>
        )}
      </View>

      {/* Date Picker Modal */}
      {showDatePicker && (
        <Modal transparent animationType="slide">
          <View style={styles.datePickerOverlay}>
            <View style={styles.datePickerContainer}>
              <Text style={styles.datePickerTitle}>Select Birthday</Text>
              
              <View style={styles.datePickerRow}>
                <View style={styles.datePickerColumn}>
                  <Text style={styles.datePickerLabel}>Month</Text>
                  <ScrollView style={styles.datePickerScrollView} showsVerticalScrollIndicator={false}>
                    {months.map((month, index) => (
                      <TouchableOpacity
                        key={month}
                        style={[
                          styles.datePickerOption,
                          selectedDate.month === (index + 1).toString() && styles.datePickerOptionSelected
                        ]}
                        onPress={() => setSelectedDate(prev => ({ ...prev, month: (index + 1).toString() }))}
                      >
                        <Text style={[
                          styles.datePickerOptionText,
                          selectedDate.month === (index + 1).toString() && styles.datePickerOptionTextSelected
                        ]}>
                          {month}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>

                <View style={styles.datePickerColumn}>
                  <Text style={styles.datePickerLabel}>Day</Text>
                  <ScrollView style={styles.datePickerScrollView} showsVerticalScrollIndicator={false}>
                    {Array.from({ length: getDaysInMonth(selectedDate.month, selectedDate.year) }, (_, i) => i + 1).map(day => (
                      <TouchableOpacity
                        key={day}
                        style={[
                          styles.datePickerOption,
                          selectedDate.day === day.toString() && styles.datePickerOptionSelected
                        ]}
                        onPress={() => setSelectedDate(prev => ({ ...prev, day: day.toString() }))}
                      >
                        <Text style={[
                          styles.datePickerOptionText,
                          selectedDate.day === day.toString() && styles.datePickerOptionTextSelected
                        ]}>
                          {day}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>

                <View style={styles.datePickerColumn}>
                  <Text style={styles.datePickerLabel}>Year</Text>
                  <ScrollView style={styles.datePickerScrollView} showsVerticalScrollIndicator={false}>
                    {getYears().map(year => (
                      <TouchableOpacity
                        key={year}
                        style={[
                          styles.datePickerOption,
                          selectedDate.year === year && styles.datePickerOptionSelected
                        ]}
                        onPress={() => setSelectedDate(prev => ({ ...prev, year }))}
                      >
                        <Text style={[
                          styles.datePickerOptionText,
                          selectedDate.year === year && styles.datePickerOptionTextSelected
                        ]}>
                          {year}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              </View>

              <View style={styles.datePickerButtons}>
                <TouchableOpacity
                  style={styles.datePickerCancelButton}
                  onPress={() => setShowDatePicker(false)}
                >
                  <Text style={styles.datePickerCancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.datePickerSelectButton,
                    (!selectedDate.day || !selectedDate.month || !selectedDate.year) && styles.datePickerSelectButtonDisabled
                  ]}
                  onPress={handleDateSelection}
                  disabled={!selectedDate.day || !selectedDate.month || !selectedDate.year}
                >
                  <Text style={styles.datePickerSelectButtonText}>Select</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8E7',
  },
  contentContainer: {
    paddingBottom: 30,
  },
  header: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#D4AF37',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#8B4513',
    textAlign: 'center',
  },
  toggleContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 30,
    backgroundColor: '#F5E6A3',
    borderRadius: 12,
    padding: 4,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  toggleButtonActive: {
    backgroundColor: '#D4AF37',
  },
  toggleText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8B4513',
  },
  toggleTextActive: {
    color: '#FFFFFF',
  },
  formContainer: {
    paddingHorizontal: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C1810',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#2C1810',
  },
  nameRow: {
    flexDirection: 'row',
  },
  genderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  genderButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    marginHorizontal: 4,
  },
  genderButtonActive: {
    backgroundColor: '#D4AF37',
    borderColor: '#D4AF37',
  },
  genderText: {
    fontSize: 16,
    color: '#8B4513',
    fontWeight: '500',
  },
  genderTextActive: {
    color: '#FFFFFF',
  },
  dateButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 16,
    color: '#2C1810',
  },
  userTypeContainer: {
    marginBottom: 20,
  },
  userTypeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  userTypeCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    marginBottom: 12,
    position: 'relative',
  },
  userTypeLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 4,
  },
  userTypeDescription: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 16,
  },
  selectedIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  authButton: {
    backgroundColor: '#D4AF37',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  authButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  infoContainer: {
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#3B82F6',
  },
  infoText: {
    fontSize: 14,
    color: '#1E40AF',
    lineHeight: 18,
  },
  datePickerOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  datePickerContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    width: '80%',
  },
  datePickerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C1810',
    marginBottom: 20,
    textAlign: 'center',
  },
  datePickerRow: {
    flexDirection: 'row',
    height: 200,
    marginBottom: 20,
  },
  datePickerColumn: {
    flex: 1,
    marginHorizontal: 5,
  },
  datePickerLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C1810',
    marginBottom: 8,
    textAlign: 'center',
  },
  datePickerScrollView: {
    flex: 1,
    backgroundColor: '#F9F9F9',
    borderRadius: 8,
  },
  datePickerOption: {
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: 'center',
  },
  datePickerOptionSelected: {
    backgroundColor: '#D4AF37',
  },
  datePickerOptionText: {
    fontSize: 16,
    color: '#2C1810',
  },
  datePickerOptionTextSelected: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  datePickerButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  datePickerCancelButton: {
    flex: 1,
    backgroundColor: '#E5E7EB',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginRight: 10,
  },
  datePickerCancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
  datePickerSelectButton: {
    flex: 1,
    backgroundColor: '#D4AF37',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginLeft: 10,
  },
  datePickerSelectButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  datePickerSelectButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});