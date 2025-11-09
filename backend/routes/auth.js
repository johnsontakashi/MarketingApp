const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User, Wallet, Device } = require('../models');
const { authenticateToken } = require('../middleware/auth');
const router = express.Router();

// Generate JWT token
const generateToken = (userId, email, role = 'user') => {
  return jwt.sign(
    { userId, email, role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
};

// Register endpoint
router.post('/register', async (req, res) => {
  try {
    const {
      email,
      password,
      firstName,
      lastName,
      phone,
      gender,
      birthday,
      accountType = 'individual',
      referralCode
    } = req.body;

    // Validate required fields
    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Email, password, first name, and last name are required'
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Invalid email format'
      });
    }

    // Validate password strength
    if (password.length < 6) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Password must be at least 6 characters long'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({
        error: 'Conflict',
        message: 'User with this email already exists'
      });
    }

    // Find referrer if referral code provided
    let referrerId = null;
    if (referralCode) {
      const referrer = await User.findOne({ where: { referral_code: referralCode } });
      if (referrer) {
        referrerId = referrer.id;
      }
    }

    // Hash password
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Create user
    const userData = {
      email: email.toLowerCase().trim(),
      password_hash: passwordHash,
      first_name: firstName.trim(),
      last_name: lastName.trim(),
      phone: phone?.trim(),
      gender,
      birthday: birthday ? new Date(birthday) : null,
      account_type: accountType,
      referred_by: referrerId,
      status: 'active',
      email_verified: false // In production, require email verification
    };

    const user = await User.create(userData);

    // Create wallet for user
    await Wallet.create({
      user_id: user.id,
      available_balance: 0.00,
      currency: 'TLB'
    });

    // Create device record if device info provided
    const deviceId = req.header('X-Device-ID');
    if (deviceId) {
      const deviceData = {
        device_id: deviceId,
        user_id: user.id,
        device_name: req.header('X-Device-Name') || 'Mobile Device',
        device_type: req.header('X-Device-Type') || 'android',
        app_version: req.header('X-App-Version'),
        user_agent: req.header('User-Agent'),
        last_seen_ip: req.ip
      };

      await Device.create(deviceData);
    }

    // Update referrer's referral count
    if (referrerId) {
      await User.increment('total_referrals', { where: { id: referrerId } });
    }

    // Generate token
    const token = generateToken(user.id, user.email, user.role);

    // Remove password from response
    const userResponse = user.toJSON();
    delete userResponse.password_hash;

    res.status(201).json({
      message: 'User registered successfully',
      user: userResponse,
      token,
      expires_in: process.env.JWT_EXPIRE || '7d'
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Registration failed'
    });
  }
});

// Login endpoint
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Email and password are required'
      });
    }

    // Find user by email (case insensitive)
    const user = await User.findOne({
      where: { email: email.toLowerCase().trim() }
    });

    if (!user) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid email or password'
      });
    }

    // Check if account is active
    if (user.status !== 'active') {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Account is suspended or deactivated'
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid email or password'
      });
    }

    // Update login tracking
    user.last_login = new Date();
    user.login_count = user.login_count + 1;
    await user.save(['last_login', 'login_count']);

    // Update or create device record
    const deviceId = req.header('X-Device-ID');
    if (deviceId) {
      let device = await Device.findOne({
        where: { device_id: deviceId, user_id: user.id }
      });

      if (device) {
        // Update existing device
        device.last_seen_ip = req.ip;
        device.user_agent = req.header('User-Agent');
        device.app_version = req.header('X-App-Version') || device.app_version;
        device.last_heartbeat = new Date();
        await device.save();
      } else {
        // Create new device
        const deviceData = {
          device_id: deviceId,
          user_id: user.id,
          device_name: req.header('X-Device-Name') || 'Mobile Device',
          device_type: req.header('X-Device-Type') || 'android',
          app_version: req.header('X-App-Version'),
          user_agent: req.header('User-Agent'),
          last_seen_ip: req.ip
        };

        await Device.create(deviceData);
      }
    }

    // Generate token
    const token = generateToken(user.id, user.email, user.role);

    // Remove password from response
    const userResponse = user.toJSON();
    delete userResponse.password_hash;

    res.json({
      message: 'Login successful',
      user: userResponse,
      token,
      expires_in: process.env.JWT_EXPIRE || '7d'
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Login failed'
    });
  }
});

// Get current user profile
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password_hash'] },
      include: [{
        model: Wallet,
        as: 'wallet'
      }]
    });

    if (!user) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'User not found'
      });
    }

    res.json({
      user,
      profile_complete: !!(user.phone && user.gender && user.birthday)
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to get profile'
    });
  }
});

// Update user profile
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      phone,
      gender,
      birthday,
      location,
      timezone,
      language,
      preferences
    } = req.body;

    const updateData = {};
    
    if (firstName) updateData.first_name = firstName.trim();
    if (lastName) updateData.last_name = lastName.trim();
    if (phone) updateData.phone = phone.trim();
    if (gender && ['male', 'female', 'other'].includes(gender)) {
      updateData.gender = gender;
    }
    if (birthday) updateData.birthday = new Date(birthday);
    if (location) updateData.location = location.trim();
    if (timezone) updateData.timezone = timezone;
    if (language) updateData.language = language;
    if (preferences && typeof preferences === 'object') {
      updateData.preferences = preferences;
    }

    await User.update(updateData, { where: { id: req.userId } });

    const updatedUser = await User.findByPk(req.userId, {
      attributes: { exclude: ['password_hash'] }
    });

    res.json({
      message: 'Profile updated successfully',
      user: updatedUser
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to update profile'
    });
  }
});

// Change password
router.put('/password', authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Current password and new password are required'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'New password must be at least 6 characters long'
      });
    }

    const user = await User.findByPk(req.userId);
    
    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password_hash);
    if (!isCurrentPasswordValid) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Current password is incorrect'
      });
    }

    // Hash new password
    const saltRounds = 12;
    const newPasswordHash = await bcrypt.hash(newPassword, saltRounds);

    // Update password
    await User.update(
      { password_hash: newPasswordHash },
      { where: { id: req.userId } }
    );

    res.json({
      message: 'Password changed successfully'
    });

  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to change password'
    });
  }
});

// Logout (optional - mainly for cleanup)
router.post('/logout', authMiddleware, deviceMiddleware, async (req, res) => {
  try {
    // Update device status if device exists
    if (req.device) {
      req.device.last_heartbeat = new Date();
      await req.device.save(['last_heartbeat']);
    }

    res.json({
      message: 'Logged out successfully'
    });

  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Logout failed'
    });
  }
});

// Validate token
router.post('/validate', authMiddleware, (req, res) => {
  res.json({
    valid: true,
    user: req.user
  });
});

// Refresh token
router.post('/refresh', authMiddleware, (req, res) => {
  try {
    const newToken = generateToken(req.user.id, req.user.email, req.user.role);

    res.json({
      token: newToken,
      expires_in: process.env.JWT_EXPIRE || '7d'
    });

  } catch (error) {
    console.error('Token refresh error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Token refresh failed'
    });
  }
});

module.exports = router;