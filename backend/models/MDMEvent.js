module.exports = (sequelize, DataTypes) => {
  const MDMEvent = sequelize.define('MDMEvent', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    device_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Devices',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    event_type: {
      type: DataTypes.ENUM(
        'device_enrolled', 'device_unenrolled', 'device_locked', 'device_unlocked',
        'kiosk_enabled', 'kiosk_disabled', 'app_blocked', 'app_allowed',
        'location_update', 'heartbeat', 'compliance_updated', 'policy_updated',
        'unlock_failed', 'emergency_unlock', 'device_wipe_initiated', 'device_wiped',
        'sim_card_detected', 'sim_card_removed', 'network_changed', 'battery_critical',
        'home_button_pressed', 'back_button_pressed', 'app_switch_attempted',
        'security_violation', 'tamper_detected', 'admin_override'
      ),
      allowNull: false
    },
    event_level: {
      type: DataTypes.ENUM('info', 'warning', 'error', 'critical'),
      defaultValue: 'info'
    },
    title: {
      type: DataTypes.STRING,
      allowNull: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    details: {
      type: DataTypes.JSON,
      defaultValue: {}
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    ip_address: {
      type: DataTypes.STRING,
      allowNull: true
    },
    user_agent: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    location: {
      type: DataTypes.JSON,
      defaultValue: {}
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
    app_version: {
      type: DataTypes.STRING,
      allowNull: true
    },
    os_version: {
      type: DataTypes.STRING,
      allowNull: true
    },
    device_model: {
      type: DataTypes.STRING,
      allowNull: true
    },
    severity: {
      type: DataTypes.ENUM('low', 'medium', 'high', 'critical'),
      defaultValue: 'medium'
    },
    acknowledged: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    acknowledged_by: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    acknowledged_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    resolved: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    resolved_by: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    resolved_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    resolution_notes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    tags: {
      type: DataTypes.JSON,
      defaultValue: []
    },
    metadata: {
      type: DataTypes.JSON,
      defaultValue: {}
    }
  }, {
    tableName: 'mdm_events',
    indexes: [
      {
        fields: ['device_id']
      },
      {
        fields: ['event_type']
      },
      {
        fields: ['event_level']
      },
      {
        fields: ['severity']
      },
      {
        fields: ['user_id']
      },
      {
        fields: ['created_at']
      },
      {
        fields: ['acknowledged']
      },
      {
        fields: ['resolved']
      },
      {
        fields: ['device_id', 'event_type']
      },
      {
        fields: ['device_id', 'created_at']
      }
    ],
    hooks: {
      beforeCreate: async (event) => {
        // Auto-generate title if not provided
        if (!event.title) {
          const titles = {
            'device_enrolled': 'Device Enrolled',
            'device_unenrolled': 'Device Unenrolled',
            'device_locked': 'Device Locked',
            'device_unlocked': 'Device Unlocked',
            'kiosk_enabled': 'Kiosk Mode Enabled',
            'kiosk_disabled': 'Kiosk Mode Disabled',
            'app_blocked': 'Application Blocked',
            'app_allowed': 'Application Allowed',
            'location_update': 'Location Updated',
            'heartbeat': 'Device Heartbeat',
            'compliance_updated': 'Compliance Status Updated',
            'policy_updated': 'Policy Updated',
            'unlock_failed': 'Unlock Attempt Failed',
            'emergency_unlock': 'Emergency Unlock',
            'device_wipe_initiated': 'Device Wipe Initiated',
            'device_wiped': 'Device Wiped',
            'sim_card_detected': 'SIM Card Detected',
            'sim_card_removed': 'SIM Card Removed',
            'network_changed': 'Network Changed',
            'battery_critical': 'Critical Battery Level',
            'home_button_pressed': 'Home Button Pressed',
            'back_button_pressed': 'Back Button Pressed',
            'app_switch_attempted': 'App Switch Attempted',
            'security_violation': 'Security Violation',
            'tamper_detected': 'Tampering Detected',
            'admin_override': 'Admin Override'
          };
          event.title = titles[event.event_type] || 'MDM Event';
        }

        // Set event level based on type
        if (!event.event_level || event.event_level === 'info') {
          const criticalEvents = [
            'device_wipe_initiated', 'device_wiped', 'security_violation', 
            'tamper_detected', 'emergency_unlock'
          ];
          const errorEvents = [
            'unlock_failed', 'app_blocked', 'compliance_updated'
          ];
          const warningEvents = [
            'device_locked', 'kiosk_enabled', 'sim_card_detected', 
            'battery_critical', 'home_button_pressed', 'back_button_pressed'
          ];

          if (criticalEvents.includes(event.event_type)) {
            event.event_level = 'critical';
            event.severity = 'critical';
          } else if (errorEvents.includes(event.event_type)) {
            event.event_level = 'error';
            event.severity = 'high';
          } else if (warningEvents.includes(event.event_type)) {
            event.event_level = 'warning';
            event.severity = 'medium';
          }
        }

        // Auto-acknowledge routine events
        const routineEvents = ['heartbeat', 'location_update'];
        if (routineEvents.includes(event.event_type)) {
          event.acknowledged = true;
          event.acknowledged_at = new Date();
        }
      },
      beforeUpdate: (event) => {
        // Set acknowledgment timestamp
        if (event.changed('acknowledged') && event.acknowledged && !event.acknowledged_at) {
          event.acknowledged_at = new Date();
        }

        // Set resolution timestamp
        if (event.changed('resolved') && event.resolved && !event.resolved_at) {
          event.resolved_at = new Date();
        }
      }
    }
  });

  // Instance methods
  MDMEvent.prototype.acknowledge = async function(acknowledgedBy = null) {
    this.acknowledged = true;
    this.acknowledged_by = acknowledgedBy;
    this.acknowledged_at = new Date();
    await this.save();
    return this;
  };

  MDMEvent.prototype.resolve = async function(resolvedBy = null, notes = null) {
    this.resolved = true;
    this.resolved_by = resolvedBy;
    this.resolved_at = new Date();
    this.resolution_notes = notes;
    await this.save();
    return this;
  };

  MDMEvent.prototype.isCritical = function() {
    return this.event_level === 'critical' || this.severity === 'critical';
  };

  MDMEvent.prototype.requiresAttention = function() {
    return !this.acknowledged && 
           (this.event_level === 'error' || this.event_level === 'critical' || this.severity === 'high');
  };

  MDMEvent.prototype.getAge = function() {
    const now = new Date();
    const created = new Date(this.created_at);
    const ageMs = now - created;
    
    const days = Math.floor(ageMs / (1000 * 60 * 60 * 24));
    const hours = Math.floor((ageMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((ageMs % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) {
      return `${days}d ${hours}h`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes}m`;
    }
  };

  MDMEvent.prototype.addTag = async function(tag) {
    if (!this.tags.includes(tag)) {
      this.tags.push(tag);
      await this.save(['tags']);
    }
    return this;
  };

  MDMEvent.prototype.removeTag = async function(tag) {
    const index = this.tags.indexOf(tag);
    if (index > -1) {
      this.tags.splice(index, 1);
      await this.save(['tags']);
    }
    return this;
  };

  // Class methods
  MDMEvent.getUnacknowledged = async function(deviceId = null) {
    const where = { 
      acknowledged: false,
      event_level: ['warning', 'error', 'critical']
    };
    
    if (deviceId) {
      where.device_id = deviceId;
    }

    return await MDMEvent.findAll({
      where,
      include: [{
        model: sequelize.models.Device,
        as: 'device',
        include: [{
          model: sequelize.models.User,
          as: 'user',
          attributes: ['id', 'first_name', 'last_name', 'email']
        }]
      }],
      order: [['created_at', 'DESC']]
    });
  };

  MDMEvent.getCriticalEvents = async function(hours = 24) {
    const { Op } = require('sequelize');
    const since = new Date(Date.now() - hours * 60 * 60 * 1000);

    return await MDMEvent.findAll({
      where: {
        event_level: 'critical',
        created_at: { [Op.gte]: since }
      },
      include: [{
        model: sequelize.models.Device,
        as: 'device',
        include: [{
          model: sequelize.models.User,
          as: 'user',
          attributes: ['id', 'first_name', 'last_name', 'email']
        }]
      }],
      order: [['created_at', 'DESC']]
    });
  };

  MDMEvent.getEventStats = async function(deviceId = null, days = 7) {
    const { Op } = require('sequelize');
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    const where = { created_at: { [Op.gte]: since } };
    
    if (deviceId) {
      where.device_id = deviceId;
    }

    const stats = await MDMEvent.findAll({
      where,
      attributes: [
        'event_type',
        'event_level',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: ['event_type', 'event_level']
    });

    return stats.map(stat => ({
      event_type: stat.event_type,
      event_level: stat.event_level,
      count: parseInt(stat.getDataValue('count'))
    }));
  };

  MDMEvent.getSecurityViolations = async function(deviceId = null, hours = 24) {
    const { Op } = require('sequelize');
    const since = new Date(Date.now() - hours * 60 * 60 * 1000);
    const securityEvents = [
      'security_violation', 'tamper_detected', 'unlock_failed', 
      'home_button_pressed', 'back_button_pressed', 'app_switch_attempted'
    ];

    const where = {
      event_type: { [Op.in]: securityEvents },
      created_at: { [Op.gte]: since }
    };
    
    if (deviceId) {
      where.device_id = deviceId;
    }

    return await MDMEvent.findAll({
      where,
      include: [{
        model: sequelize.models.Device,
        as: 'device',
        include: [{
          model: sequelize.models.User,
          as: 'user',
          attributes: ['id', 'first_name', 'last_name', 'email']
        }]
      }],
      order: [['created_at', 'DESC']]
    });
  };

  MDMEvent.logKioskViolation = async function(deviceId, violationType, details = {}) {
    const titles = {
      'home_button': 'HOME Button Violation',
      'back_button': 'BACK Button Violation', 
      'app_switch': 'App Switch Violation',
      'recent_apps': 'Recent Apps Violation'
    };

    return await MDMEvent.create({
      device_id: deviceId,
      event_type: violationType === 'home_button' ? 'home_button_pressed' : 
                 violationType === 'back_button' ? 'back_button_pressed' : 'app_switch_attempted',
      event_level: 'warning',
      severity: 'medium',
      title: titles[violationType] || 'Kiosk Violation',
      description: `User attempted to ${violationType.replace('_', ' ')} while in kiosk mode`,
      details: {
        violation_type: violationType,
        timestamp: new Date(),
        ...details
      }
    });
  };

  MDMEvent.cleanup = async function(daysToKeep = 90) {
    const { Op } = require('sequelize');
    const cutoff = new Date(Date.now() - daysToKeep * 24 * 60 * 60 * 1000);

    // Only cleanup routine events, keep security events longer
    const routineEvents = ['heartbeat', 'location_update'];
    
    const result = await MDMEvent.destroy({
      where: {
        event_type: { [Op.in]: routineEvents },
        created_at: { [Op.lt]: cutoff }
      }
    });

    return { deleted_events: result };
  };

  return MDMEvent;
};