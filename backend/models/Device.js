module.exports = (sequelize, DataTypes) => {
  const Device = sequelize.define('Device', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    device_id: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    device_name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    device_type: {
      type: DataTypes.ENUM('android', 'ios', 'web', 'desktop'),
      defaultValue: 'android'
    },
    platform_version: {
      type: DataTypes.STRING,
      allowNull: true
    },
    app_version: {
      type: DataTypes.STRING,
      allowNull: true
    },
    brand: {
      type: DataTypes.STRING,
      allowNull: true
    },
    model: {
      type: DataTypes.STRING,
      allowNull: true
    },
    manufacturer: {
      type: DataTypes.STRING,
      allowNull: true
    },
    screen_resolution: {
      type: DataTypes.STRING,
      allowNull: true
    },
    ram_size: {
      type: DataTypes.STRING,
      allowNull: true
    },
    storage_size: {
      type: DataTypes.STRING,
      allowNull: true
    },
    battery_level: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 0,
        max: 100
      }
    },
    network_type: {
      type: DataTypes.ENUM('wifi', 'cellular', 'ethernet', 'unknown'),
      allowNull: true
    },
    location: {
      type: DataTypes.JSON,
      defaultValue: {}
    },
    timezone: {
      type: DataTypes.STRING,
      allowNull: true
    },
    language: {
      type: DataTypes.STRING,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive', 'locked', 'blocked', 'lost', 'stolen'),
      defaultValue: 'active'
    },
    mdm_status: {
      type: DataTypes.ENUM('none', 'enrolled', 'locked', 'wiping', 'wiped', 'unenrolled'),
      defaultValue: 'none'
    },
    lock_status: {
      type: DataTypes.ENUM('unlocked', 'locked', 'emergency_unlocked', 'pending_lock'),
      defaultValue: 'unlocked'
    },
    is_kiosk_mode: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    kiosk_app_package: {
      type: DataTypes.STRING,
      allowNull: true
    },
    lock_reason: {
      type: DataTypes.ENUM('payment_overdue', 'support_bonus', 'admin_lock', 'security_breach', 'user_request'),
      allowNull: true
    },
    lock_details: {
      type: DataTypes.JSON,
      defaultValue: {}
    },
    locked_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    locked_by: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    unlock_code: {
      type: DataTypes.STRING,
      allowNull: true
    },
    unlock_attempts: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    max_unlock_attempts: {
      type: DataTypes.INTEGER,
      defaultValue: 3
    },
    emergency_contact: {
      type: DataTypes.STRING,
      allowNull: true
    },
    last_heartbeat: {
      type: DataTypes.DATE,
      allowNull: true
    },
    last_location_update: {
      type: DataTypes.DATE,
      allowNull: true
    },
    last_seen_ip: {
      type: DataTypes.STRING,
      allowNull: true
    },
    user_agent: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    push_token: {
      type: DataTypes.STRING,
      allowNull: true
    },
    push_enabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    notifications_enabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    location_tracking: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    remote_wipe_enabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    biometric_enabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    device_admin_enabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    owner_mode_enabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    compliance_status: {
      type: DataTypes.ENUM('compliant', 'non_compliant', 'unknown'),
      defaultValue: 'unknown'
    },
    compliance_issues: {
      type: DataTypes.JSON,
      defaultValue: []
    },
    security_patch_level: {
      type: DataTypes.STRING,
      allowNull: true
    },
    root_jailbreak_status: {
      type: DataTypes.ENUM('not_detected', 'detected', 'unknown'),
      defaultValue: 'unknown'
    },
    installed_apps: {
      type: DataTypes.JSON,
      defaultValue: []
    },
    blocked_apps: {
      type: DataTypes.JSON,
      defaultValue: []
    },
    allowed_apps: {
      type: DataTypes.JSON,
      defaultValue: []
    },
    policies: {
      type: DataTypes.JSON,
      defaultValue: {}
    },
    settings: {
      type: DataTypes.JSON,
      defaultValue: {}
    },
    metadata: {
      type: DataTypes.JSON,
      defaultValue: {}
    }
  }, {
    tableName: 'devices',
    indexes: [
      {
        fields: ['user_id']
      },
      {
        fields: ['device_id']
      },
      {
        fields: ['device_type']
      },
      {
        fields: ['status']
      },
      {
        fields: ['mdm_status']
      },
      {
        fields: ['lock_status']
      },
      {
        fields: ['is_kiosk_mode']
      },
      {
        fields: ['locked_at']
      },
      {
        fields: ['last_heartbeat']
      },
      {
        fields: ['compliance_status']
      }
    ],
    hooks: {
      beforeCreate: async (device) => {
        // Generate unlock code
        if (!device.unlock_code) {
          device.unlock_code = Math.random().toString(36).substr(2, 8).toUpperCase();
        }

        // Set initial heartbeat
        device.last_heartbeat = new Date();
      },
      beforeUpdate: (device) => {
        // Update heartbeat when status changes
        if (device.changed('status') || device.changed('mdm_status') || device.changed('lock_status')) {
          device.last_heartbeat = new Date();
        }

        // Set lock timestamp
        if (device.changed('lock_status') && device.lock_status === 'locked' && !device.locked_at) {
          device.locked_at = new Date();
        }

        // Clear lock timestamp when unlocked
        if (device.changed('lock_status') && device.lock_status === 'unlocked') {
          device.locked_at = null;
          device.unlock_attempts = 0;
        }
      }
    }
  });

  // Instance methods
  Device.prototype.isOnline = function() {
    if (!this.last_heartbeat) return false;
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    return new Date(this.last_heartbeat) > fiveMinutesAgo;
  };

  Device.prototype.isLocked = function() {
    return this.lock_status === 'locked' || this.lock_status === 'pending_lock';
  };

  Device.prototype.canUnlock = function() {
    return this.isLocked() && 
           this.unlock_attempts < this.max_unlock_attempts &&
           this.status === 'active';
  };

  Device.prototype.isCompliant = function() {
    return this.compliance_status === 'compliant' && 
           this.compliance_issues.length === 0;
  };

  Device.prototype.hasKioskMode = function() {
    return this.device_type === 'android' && 
           this.owner_mode_enabled && 
           this.device_admin_enabled;
  };

  Device.prototype.lock = async function(reason, details = {}, lockedBy = null) {
    if (this.isLocked()) {
      throw new Error('Device is already locked');
    }

    this.lock_status = 'locked';
    this.lock_reason = reason;
    this.lock_details = details;
    this.locked_at = new Date();
    this.locked_by = lockedBy;
    this.unlock_attempts = 0;

    // Enable kiosk mode if device supports it
    if (this.hasKioskMode()) {
      this.is_kiosk_mode = true;
      this.mdm_status = 'locked';
    }

    await this.save();
    
    // Log MDM event
    const { MDMEvent } = require('./index');
    await MDMEvent.create({
      device_id: this.id,
      event_type: 'device_locked',
      details: {
        reason,
        details,
        locked_by: lockedBy
      }
    });

    return this;
  };

  Device.prototype.unlock = async function(unlockedBy = null, isEmergency = false) {
    if (!this.isLocked()) {
      throw new Error('Device is not locked');
    }

    this.lock_status = isEmergency ? 'emergency_unlocked' : 'unlocked';
    this.lock_reason = null;
    this.lock_details = {};
    this.locked_at = null;
    this.unlock_attempts = 0;
    this.is_kiosk_mode = false;
    
    if (this.mdm_status === 'locked') {
      this.mdm_status = 'enrolled';
    }

    await this.save();

    // Log MDM event
    const { MDMEvent } = require('./index');
    await MDMEvent.create({
      device_id: this.id,
      event_type: 'device_unlocked',
      details: {
        unlocked_by: unlockedBy,
        is_emergency: isEmergency
      }
    });

    return this;
  };

  Device.prototype.attemptUnlock = async function(code) {
    if (!this.canUnlock()) {
      throw new Error('Device cannot be unlocked at this time');
    }

    this.unlock_attempts += 1;

    if (code === this.unlock_code) {
      await this.unlock();
      return { success: true, message: 'Device unlocked successfully' };
    } else {
      await this.save(['unlock_attempts']);
      
      const remainingAttempts = this.max_unlock_attempts - this.unlock_attempts;
      
      if (remainingAttempts <= 0) {
        this.status = 'blocked';
        await this.save(['status']);
        
        // Log failed unlock attempt
        const { MDMEvent } = require('./index');
        await MDMEvent.create({
          device_id: this.id,
          event_type: 'unlock_failed',
          details: {
            attempts: this.unlock_attempts,
            max_attempts: this.max_unlock_attempts,
            device_blocked: true
          }
        });

        return { 
          success: false, 
          message: 'Device blocked due to too many failed attempts',
          blocked: true
        };
      }

      return { 
        success: false, 
        message: `Invalid unlock code. ${remainingAttempts} attempts remaining`,
        attempts_remaining: remainingAttempts
      };
    }
  };

  Device.prototype.updateHeartbeat = async function(location = null, batteryLevel = null) {
    this.last_heartbeat = new Date();
    
    if (location) {
      this.location = location;
      this.last_location_update = new Date();
    }
    
    if (batteryLevel !== null) {
      this.battery_level = batteryLevel;
    }

    await this.save(['last_heartbeat', 'location', 'last_location_update', 'battery_level']);
    return this;
  };

  Device.prototype.updateCompliance = async function(issues = []) {
    this.compliance_status = issues.length === 0 ? 'compliant' : 'non_compliant';
    this.compliance_issues = issues;
    
    await this.save(['compliance_status', 'compliance_issues']);
    
    // Log compliance event
    const { MDMEvent } = require('./index');
    await MDMEvent.create({
      device_id: this.id,
      event_type: 'compliance_updated',
      details: {
        status: this.compliance_status,
        issues
      }
    });

    return this;
  };

  Device.prototype.wipeDevice = async function(wipedBy = null) {
    this.mdm_status = 'wiping';
    this.status = 'inactive';
    
    await this.save();

    // Log wipe event
    const { MDMEvent } = require('./index');
    await MDMEvent.create({
      device_id: this.id,
      event_type: 'device_wipe_initiated',
      details: {
        wiped_by: wipedBy
      }
    });

    return this;
  };

  Device.prototype.getLocationHistory = async function(limit = 10) {
    const { MDMEvent } = require('./index');
    
    return await MDMEvent.findAll({
      where: {
        device_id: this.id,
        event_type: 'location_update'
      },
      order: [['created_at', 'DESC']],
      limit
    });
  };

  // Class methods
  Device.findByDeviceId = async function(deviceId) {
    return await Device.findOne({ where: { device_id: deviceId } });
  };

  Device.getLockedDevices = async function() {
    return await Device.findAll({
      where: {
        lock_status: ['locked', 'pending_lock']
      },
      include: [{
        model: sequelize.models.User,
        as: 'user',
        attributes: ['id', 'first_name', 'last_name', 'email']
      }],
      order: [['locked_at', 'DESC']]
    });
  };

  Device.getOfflineDevices = async function(hours = 24) {
    const { Op } = require('sequelize');
    const cutoff = new Date(Date.now() - hours * 60 * 60 * 1000);

    return await Device.findAll({
      where: {
        [Op.or]: [
          { last_heartbeat: null },
          { last_heartbeat: { [Op.lt]: cutoff } }
        ],
        status: { [Op.ne]: 'inactive' }
      }
    });
  };

  Device.getNonCompliantDevices = async function() {
    return await Device.findAll({
      where: {
        compliance_status: 'non_compliant'
      },
      include: [{
        model: sequelize.models.User,
        as: 'user',
        attributes: ['id', 'first_name', 'last_name', 'email']
      }]
    });
  };

  return Device;
};