const jwt = require('jsonwebtoken');
const { User, Device } = require('../models');

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'No token provided'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const user = await User.findByPk(decoded.userId, {
      attributes: { exclude: ['password_hash'] }
    });

    if (!user) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid token - user not found'
      });
    }

    if (user.status !== 'active') {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Account suspended or deactivated'
      });
    }

    req.user = user;
    req.userId = user.id;
    
    // Extract device info if provided
    const deviceId = req.header('X-Device-ID');
    if (deviceId) {
      const device = await Device.findOne({
        where: { device_id: deviceId, user_id: user.id }
      });
      req.device = device;
    }

    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid token'
      });
    }

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Token expired'
      });
    }

    console.error('Auth middleware error:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Authentication error'
    });
  }
};

const adminMiddleware = async (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Authentication required'
    });
  }

  if (req.user.role !== 'admin' && req.user.role !== 'moderator') {
    return res.status(403).json({
      error: 'Forbidden',
      message: 'Admin access required'
    });
  }

  next();
};

const optionalAuth = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.userId, {
      attributes: { exclude: ['password_hash'] }
    });

    if (user && user.status === 'active') {
      req.user = user;
      req.userId = user.id;
    }
  } catch (error) {
    // Ignore token errors for optional auth
  }

  next();
};

const deviceMiddleware = async (req, res, next) => {
  const deviceId = req.header('X-Device-ID');
  
  if (!deviceId) {
    return res.status(400).json({
      error: 'Bad Request',
      message: 'Device ID required'
    });
  }

  try {
    let device = await Device.findOne({
      where: { device_id: deviceId }
    });

    // If device doesn't exist and user is authenticated, create it
    if (!device && req.user) {
      const deviceData = {
        device_id: deviceId,
        user_id: req.user.id,
        device_name: req.header('X-Device-Name') || 'Unknown Device',
        device_type: req.header('X-Device-Type') || 'android',
        app_version: req.header('X-App-Version'),
        user_agent: req.header('User-Agent'),
        last_seen_ip: req.ip
      };

      device = await Device.create(deviceData);
    }

    if (device) {
      req.device = device;
      
      // Update last heartbeat
      await device.updateHeartbeat();
    }

    next();
  } catch (error) {
    console.error('Device middleware error:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Device verification error'
    });
  }
};

module.exports = {
  authMiddleware,
  adminMiddleware,
  optionalAuth,
  deviceMiddleware
};