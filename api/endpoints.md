# TLB Diamond Marketplace API Endpoints

## 🔐 Authentication & Authorization

All API endpoints require authentication except for public endpoints marked with 🌐.
Authentication uses JWT tokens with role-based access control.

### Authentication Headers
```
Authorization: Bearer <jwt_token>
X-Device-ID: <device_fingerprint>
X-App-Version: <app_version>
```

## 📱 Authentication Endpoints

### User Registration & Login
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "firstName": "John",
  "lastName": "Doe",
  "birthDate": "1990-01-01",
  "referralCode": "ABC123", // Optional
  "deviceFingerprint": "unique_device_id",
  "acceptedTerms": true
}

Response:
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "userType": "buyer",
      "kycStatus": "pending",
      "referralCode": "USER001"
    },
    "tokens": {
      "accessToken": "jwt_token",
      "refreshToken": "refresh_token",
      "expiresIn": 3600
    }
  }
}
```

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "deviceFingerprint": "unique_device_id",
  "twoFactorCode": "123456" // Optional if 2FA enabled
}
```

```http
POST /api/auth/refresh
Content-Type: application/json

{
  "refreshToken": "refresh_token"
}
```

```http
POST /api/auth/logout
Authorization: Bearer <token>

{
  "deviceFingerprint": "unique_device_id"
}
```

### KYC Verification
```http
POST /api/auth/verify-kyc
Authorization: Bearer <token>
Content-Type: multipart/form-data

{
  "documentType": "passport|driver_license|national_id",
  "documentNumber": "123456789",
  "expiryDate": "2030-12-31",
  "frontImage": <file>,
  "backImage": <file>, // Optional
  "selfieImage": <file>
}
```

## 👤 User Management

### Profile Management
```http
GET /api/users/profile
Authorization: Bearer <token>

Response:
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "userType": "buyer",
    "kycStatus": "verified",
    "referralCode": "USER001",
    "profileImageUrl": "https://...",
    "bio": "User bio",
    "location": {
      "country": "US",
      "city": "New York"
    },
    "stats": {
      "totalOrders": 5,
      "totalSpent": 1250.00,
      "memberSince": "2024-01-01T00:00:00Z"
    }
  }
}
```

```http
PUT /api/users/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Smith",
  "bio": "Updated bio",
  "location": {
    "country": "US",
    "city": "Los Angeles"
  }
}
```

### Referral System
```http
GET /api/users/referral-tree
Authorization: Bearer <token>

Response:
{
  "success": true,
  "data": {
    "totalReferrals": 25,
    "generations": [
      {
        "level": 1,
        "count": 10,
        "totalVolume": 5000.00,
        "members": [...]
      },
      {
        "level": 2,
        "count": 15,
        "totalVolume": 3500.00,
        "members": [...]
      }
    ]
  }
}
```

```http
POST /api/users/generate-referral-code
Authorization: Bearer <token>

{
  "customCode": "MYNEWCODE" // Optional
}
```

## 📱 MDM Lock Control Service

### Device Registration & Management
```http
POST /api/mdm/register-device
Authorization: Bearer <token>
Content-Type: application/json

{
  "deviceFingerprint": "unique_device_id",
  "deviceName": "John's Phone",
  "model": "Samsung Galaxy S23",
  "manufacturer": "Samsung",
  "osType": "android",
  "osVersion": "14.0",
  "appVersion": "1.0.0",
  "securityPatchLevel": "2024-01-01",
  "isRooted": false,
  "isEmulator": false,
  "location": {
    "latitude": 40.7128,
    "longitude": -74.0060
  }
}

Response:
{
  "success": true,
  "data": {
    "deviceId": "uuid",
    "status": "active",
    "lockCapabilities": {
      "supportsLockTask": true,
      "isDeviceOwner": true,
      "canSurviveReset": true
    }
  }
}
```

```http
GET /api/mdm/device-status/:deviceId
Authorization: Bearer <token>

Response:
{
  "success": true,
  "data": {
    "deviceId": "uuid",
    "status": "locked",
    "isLocked": true,
    "lockReason": "Support bonus activated for order TLB20240315000123",
    "lockedAt": "2024-03-15T10:30:00Z",
    "gracePeriodEnd": "2024-03-19T14:30:00Z",
    "unlockAttempts": 0,
    "maxUnlockAttempts": 3,
    "lastHeartbeat": "2024-03-15T12:45:00Z"
  }
}
```

### Lock/Unlock Operations
```http
POST /api/mdm/lock-device
Authorization: Bearer <token>
Content-Type: application/json

{
  "deviceId": "uuid",
  "reason": "Support bonus activated",
  "orderId": "uuid", // Reference to triggering order
  "gracePeriodHours": 100,
  "conditions": {
    "unlockAfterPayment": true,
    "allowEmergencyUnlock": false
  }
}

Response:
{
  "success": true,
  "data": {
    "lockId": "uuid",
    "status": "locked",
    "gracePeriodEnd": "2024-03-19T14:30:00Z",
    "unlockConditions": [...]
  }
}
```

```http
POST /api/mdm/unlock-device
Authorization: Bearer <token>
Content-Type: application/json

{
  "deviceId": "uuid",
  "unlockReason": "payment_completed|admin_override|emergency",
  "authorizationCode": "optional_admin_code",
  "orderId": "uuid" // If unlock is payment-related
}

Response:
{
  "success": true,
  "data": {
    "status": "unlocked",
    "unlockedAt": "2024-03-15T14:30:00Z",
    "unlockMethod": "payment_completed"
  }
}
```

### Device Monitoring
```http
POST /api/mdm/heartbeat/:deviceId
Authorization: Bearer <token>
Content-Type: application/json

{
  "timestamp": "2024-03-15T12:45:00Z",
  "batteryLevel": 85,
  "isCharging": false,
  "networkType": "wifi",
  "location": {
    "latitude": 40.7128,
    "longitude": -74.0060
  },
  "securityStatus": {
    "isRooted": false,
    "debuggingEnabled": false,
    "unknownSourcesEnabled": false
  }
}
```

```http
GET /api/mdm/grace-period/:deviceId
Authorization: Bearer <token>

Response:
{
  "success": true,
  "data": {
    "gracePeriodActive": true,
    "startTime": "2024-03-15T10:30:00Z",
    "endTime": "2024-03-19T14:30:00Z",
    "remainingHours": 96,
    "excludeWeekends": true,
    "businessHoursOnly": false
  }
}
```

### Security & Compliance
```http
POST /api/mdm/validate-unlock-request
Authorization: Bearer <token>
Content-Type: application/json

{
  "deviceId": "uuid",
  "unlockReason": "payment_completed",
  "verificationData": {
    "orderId": "uuid",
    "paymentReference": "payment_123",
    "adminApproval": false
  }
}

Response:
{
  "success": true,
  "data": {
    "approved": true,
    "reason": "All payments completed successfully",
    "conditions": [],
    "unlockToken": "temporary_unlock_token"
  }
}
```

```http
GET /api/mdm/tamper-status/:deviceId
Authorization: Bearer <token>

Response:
{
  "success": true,
  "data": {
    "tamperDetected": false,
    "lastSecurityCheck": "2024-03-15T12:45:00Z",
    "securityScore": 95,
    "violations": [],
    "recommendations": []
  }
}
```

```http
POST /api/mdm/report-violation
Authorization: Bearer <token>
Content-Type: application/json

{
  "deviceId": "uuid",
  "violationType": "root_detected|uninstall_attempt|factory_reset|debugging|tamper_detected",
  "severity": 1, // 1=low, 2=medium, 3=high, 4=critical
  "description": "Root access detected during device scan",
  "evidenceData": {
    "detectionMethod": "SafetyNet",
    "timestamp": "2024-03-15T12:45:00Z",
    "additionalInfo": {}
  }
}
```

## 🛒 Marketplace Operations

### Product Management
```http
🌐 GET /api/marketplace/products
Query Parameters:
- category: string
- minPrice: number
- maxPrice: number
- search: string
- sortBy: price|rating|date
- sortOrder: asc|desc
- page: number
- limit: number
- featured: boolean

Response:
{
  "success": true,
  "data": {
    "products": [
      {
        "id": "uuid",
        "sellerId": "uuid",
        "title": "Product Title",
        "description": "Product description",
        "priceTlb": 100.00,
        "originalPriceTlb": 120.00,
        "stockQuantity": 50,
        "isSupportBonusEligible": true,
        "supportBonusPercentage": 50.00,
        "rating": 4.5,
        "ratingCount": 23,
        "images": ["url1", "url2"],
        "seller": {
          "id": "uuid",
          "name": "Seller Name",
          "rating": 4.8
        }
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 150,
      "totalPages": 8
    }
  }
}
```

```http
🌐 GET /api/marketplace/products/:id
Response:
{
  "success": true,
  "data": {
    "id": "uuid",
    "sellerId": "uuid",
    "title": "Detailed Product Title",
    "description": "Full product description with all details",
    "shortDescription": "Brief description",
    "priceTlb": 100.00,
    "originalPriceTlb": 120.00,
    "stockQuantity": 50,
    "sku": "PROD-001",
    "category": {
      "id": "uuid",
      "name": "Electronics",
      "slug": "electronics"
    },
    "installmentOptions": {
      "periods": [2, 3, 4],
      "minAmount": 50.00
    },
    "specifications": {
      "weight": 1.5,
      "dimensions": {
        "length": 10,
        "width": 5,
        "height": 2
      }
    },
    "images": ["url1", "url2", "url3"],
    "videos": ["video_url"],
    "seller": {
      "id": "uuid",
      "name": "Seller Name",
      "rating": 4.8,
      "totalSales": 1000,
      "memberSince": "2023-01-01"
    },
    "reviews": {
      "average": 4.5,
      "count": 23,
      "distribution": {
        "5": 15,
        "4": 6,
        "3": 2,
        "2": 0,
        "1": 0
      }
    }
  }
}
```

```http
POST /api/marketplace/products
Authorization: Bearer <token>
Role: seller, admin
Content-Type: application/json

{
  "title": "New Product",
  "description": "Product description",
  "shortDescription": "Brief description",
  "priceTlb": 100.00,
  "categoryId": "uuid",
  "stockQuantity": 50,
  "sku": "PROD-001",
  "isSupportBonusEligible": true,
  "supportBonusPercentage": 50.00,
  "installmentOptions": {
    "periods": [2, 3, 4],
    "minAmount": 50.00
  },
  "specifications": {
    "weight": 1.5,
    "dimensions": {
      "length": 10,
      "width": 5,
      "height": 2
    }
  },
  "images": ["url1", "url2"],
  "digitalProduct": false,
  "shippingRequired": true
}
```

### Order Processing
```http
POST /api/marketplace/orders
Authorization: Bearer <token>
Content-Type: application/json

{
  "items": [
    {
      "productId": "uuid",
      "quantity": 2,
      "unitPrice": 100.00
    }
  ],
  "shippingAddress": {
    "firstName": "John",
    "lastName": "Doe",
    "address1": "123 Main St",
    "address2": "Apt 4B",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "country": "US",
    "phone": "+1234567890"
  },
  "paymentPlan": {
    "upfrontPercentage": 50,
    "installmentPeriods": 4,
    "frequency": "biweekly"
  },
  "useSupportBonus": true,
  "notes": "Please handle with care"
}

Response:
{
  "success": true,
  "data": {
    "orderId": "uuid",
    "orderNumber": "TLB20240315000123",
    "status": "pending",
    "totalAmount": 200.00,
    "upfrontAmount": 100.00,
    "supportBonusAmount": 100.00,
    "paymentSchedule": [
      {
        "installmentNumber": 1,
        "amount": 25.00,
        "dueDate": "2024-03-29"
      },
      {
        "installmentNumber": 2,
        "amount": 25.00,
        "dueDate": "2024-04-12"
      }
    ],
    "mdmLockRequired": true
  }
}
```

```http
GET /api/marketplace/orders/:id
Authorization: Bearer <token>

Response:
{
  "success": true,
  "data": {
    "id": "uuid",
    "orderNumber": "TLB20240315000123",
    "status": "processing",
    "paymentStatus": "partial",
    "totalAmount": 200.00,
    "upfrontAmount": 100.00,
    "paidAmount": 100.00,
    "remainingAmount": 100.00,
    "items": [
      {
        "productId": "uuid",
        "productName": "Product Name",
        "quantity": 2,
        "unitPrice": 100.00,
        "totalPrice": 200.00
      }
    ],
    "paymentSchedule": [...],
    "shippingInfo": {
      "method": "standard",
      "trackingNumber": "TRACK123",
      "estimatedDelivery": "2024-03-20"
    },
    "supportBonus": {
      "activated": true,
      "amount": 100.00,
      "deviceLocked": true
    }
  }
}
```

## 💰 Payment & Wallet System

### Wallet Operations
```http
GET /api/wallet/balance/:userId
Authorization: Bearer <token>

Response:
{
  "success": true,
  "data": {
    "balanceAvailable": 1250.00,
    "balanceLocked": 100.00,
    "balancePending": 25.00,
    "lifetimeEarned": 5000.00,
    "lifetimeSpent": 3750.00,
    "dailyLimit": 1000.00,
    "monthlyLimit": 10000.00,
    "dailyUsed": 150.00,
    "monthlyUsed": 2500.00
  }
}
```

```http
POST /api/wallet/transfer
Authorization: Bearer <token>
Content-Type: application/json

{
  "toUserId": "uuid",
  "amount": 50.00,
  "description": "Payment for services",
  "pin": "1234" // Wallet PIN
}

Response:
{
  "success": true,
  "data": {
    "transactionId": "uuid",
    "transactionHash": "blockchain_hash",
    "status": "pending",
    "estimatedConfirmation": "2024-03-15T13:00:00Z"
  }
}
```

```http
GET /api/wallet/transactions/:userId
Authorization: Bearer <token>
Query Parameters:
- type: upfront|installment|support_bonus|commission|bonus|refund
- status: pending|confirmed|failed|cancelled
- startDate: ISO date
- endDate: ISO date
- page: number
- limit: number

Response:
{
  "success": true,
  "data": {
    "transactions": [
      {
        "id": "uuid",
        "transactionHash": "blockchain_hash",
        "type": "installment",
        "amount": 25.00,
        "fee": 0.50,
        "status": "confirmed",
        "description": "Installment payment for order TLB20240315000123",
        "fromWallet": "uuid",
        "toWallet": "uuid",
        "createdAt": "2024-03-15T10:30:00Z",
        "confirmedAt": "2024-03-15T10:32:00Z"
      }
    ],
    "pagination": {...}
  }
}
```

### Payment Processing
```http
POST /api/payments/initiate
Authorization: Bearer <token>
Content-Type: application/json

{
  "orderId": "uuid",
  "paymentType": "upfront|installment",
  "amount": 100.00,
  "paymentMethod": "wallet|external",
  "installmentNumber": 1, // For installment payments
  "pin": "1234" // Wallet PIN if using wallet
}

Response:
{
  "success": true,
  "data": {
    "paymentId": "uuid",
    "status": "pending",
    "amount": 100.00,
    "paymentUrl": "https://payment-gateway.com/pay/123", // For external payments
    "expiresAt": "2024-03-15T11:30:00Z"
  }
}
```

```http
POST /api/payments/confirm
Authorization: Bearer <token>
Content-Type: application/json

{
  "paymentId": "uuid",
  "externalReference": "external_payment_id", // For external payments
  "verificationCode": "123456" // If required
}
```

```http
GET /api/payments/installments/:orderId
Authorization: Bearer <token>

Response:
{
  "success": true,
  "data": {
    "orderId": "uuid",
    "totalInstallments": 4,
    "paidInstallments": 1,
    "schedule": [
      {
        "installmentNumber": 1,
        "amount": 25.00,
        "dueDate": "2024-03-29",
        "status": "paid",
        "paidAt": "2024-03-15T10:30:00Z"
      },
      {
        "installmentNumber": 2,
        "amount": 25.00,
        "dueDate": "2024-04-12",
        "status": "pending",
        "gracePeriodEnd": "2024-04-16T23:59:59Z"
      }
    ]
  }
}
```

## 🎁 Community & Bonus System

### Affiliate Operations
```http
GET /api/community/affiliates/:userId
Authorization: Bearer <token>

Response:
{
  "success": true,
  "data": {
    "networkId": "uuid",
    "totalReferrals": 25,
    "totalVolume": 15000.00,
    "totalCommissions": 150.00,
    "generationBreakdown": [
      {
        "level": 1,
        "count": 10,
        "volume": 8000.00,
        "commissions": 80.00
      },
      {
        "level": 2,
        "count": 15,
        "volume": 7000.00,
        "commissions": 70.00
      }
    ],
    "recentReferrals": [
      {
        "userId": "uuid",
        "name": "Jane Doe",
        "joinedAt": "2024-03-10T00:00:00Z",
        "totalSpent": 500.00
      }
    ]
  }
}
```

```http
GET /api/community/commissions/:userId
Authorization: Bearer <token>
Query Parameters:
- status: pending|approved|paid|cancelled
- startDate: ISO date
- endDate: ISO date

Response:
{
  "success": true,
  "data": {
    "totalEarned": 150.00,
    "totalPending": 25.00,
    "commissions": [
      {
        "id": "uuid",
        "orderId": "uuid",
        "generationLevel": 1,
        "commissionRate": 0.0001,
        "baseAmount": 100.00,
        "commissionAmount": 0.01,
        "status": "approved",
        "createdAt": "2024-03-15T10:30:00Z",
        "order": {
          "orderNumber": "TLB20240315000123",
          "buyer": "John Doe"
        }
      }
    ]
  }
}
```

```http
POST /api/community/claim-commission
Authorization: Bearer <token>
Content-Type: application/json

{
  "commissionIds": ["uuid1", "uuid2"],
  "claimAll": false
}
```

### Bonus Management
```http
GET /api/bonuses/available/:userId
Authorization: Bearer <token>

Response:
{
  "success": true,
  "data": {
    "totalAvailable": 75.00,
    "bonuses": [
      {
        "id": "uuid",
        "type": "daily",
        "amount": 5.00,
        "title": "Daily Login Bonus",
        "description": "Bonus for logging in today",
        "availableAt": "2024-03-15T00:00:00Z",
        "expiresAt": "2024-03-15T23:59:59Z",
        "isTransferable": true,
        "conditions": {
          "requiresDeviceLock": false,
          "minActivityScore": 10
        }
      },
      {
        "id": "uuid",
        "type": "gift_of_legacy",
        "amount": 50.00,
        "title": "Gift of Legacy",
        "description": "Random legacy gift from community member",
        "giver": "Jane Doe",
        "message": "Good luck!",
        "expiresAt": "2024-03-22T00:00:00Z"
      }
    ]
  }
}
```

```http
POST /api/bonuses/claim/:bonusId
Authorization: Bearer <token>
Content-Type: application/json

{
  "acceptConditions": true,
  "deviceLockConsent": true // If bonus requires device lock
}

Response:
{
  "success": true,
  "data": {
    "bonusId": "uuid",
    "amount": 50.00,
    "claimedAt": "2024-03-15T12:00:00Z",
    "transactionId": "uuid",
    "mdmLockTriggered": true // If bonus required device lock
  }
}
```

```http
GET /api/bonuses/history/:userId
Authorization: Bearer <token>

Response:
{
  "success": true,
  "data": {
    "totalClaimed": 500.00,
    "totalExpired": 25.00,
    "bonuses": [
      {
        "id": "uuid",
        "type": "birthday",
        "amount": 100.00,
        "title": "Birthday Bonus",
        "status": "claimed",
        "claimedAt": "2024-03-01T12:00:00Z"
      }
    ]
  }
}
```

```http
POST /api/bonuses/gift-of-legacy
Authorization: Bearer <token>
Content-Type: application/json

{
  "amount": 50.00,
  "receiverId": "uuid", // Optional, null for random selection
  "message": "Good luck with your journey!",
  "conditions": {
    "minActivityScore": 20,
    "requiresDeviceLock": false
  },
  "expiresInDays": 7
}
```

## 📊 Analytics & Reporting

### User Analytics
```http
GET /api/analytics/user-stats/:userId
Authorization: Bearer <token>
Role: user (own data), admin (any user)

Response:
{
  "success": true,
  "data": {
    "overview": {
      "totalOrders": 15,
      "totalSpent": 2500.00,
      "totalEarned": 150.00,
      "totalSaved": 300.00,
      "memberSince": "2024-01-01T00:00:00Z"
    },
    "monthlyActivity": [
      {
        "month": "2024-03",
        "orders": 3,
        "spent": 450.00,
        "earned": 25.00
      }
    ],
    "categoryBreakdown": [
      {
        "category": "Electronics",
        "spent": 1200.00,
        "orders": 8
      }
    ]
  }
}
```

### System Analytics (Admin Only)
```http
GET /api/analytics/system-overview
Authorization: Bearer <token>
Role: admin

Response:
{
  "success": true,
  "data": {
    "users": {
      "total": 10000,
      "active": 8500,
      "newThisMonth": 500
    },
    "orders": {
      "total": 25000,
      "thisMonth": 1200,
      "revenue": 2500000.00
    },
    "devices": {
      "total": 9500,
      "locked": 150,
      "violations": 5
    },
    "marketplace": {
      "products": 5000,
      "sellers": 1200,
      "categories": 15
    }
  }
}
```

## 🔔 Notification System

### Send Notifications
```http
POST /api/notifications/send
Authorization: Bearer <token>
Role: admin, system
Content-Type: application/json

{
  "userId": "uuid",
  "title": "Payment Reminder",
  "message": "Your payment is due in 2 days",
  "type": "payment",
  "priority": 2,
  "channels": {
    "push": true,
    "email": false,
    "sms": false,
    "inApp": true
  },
  "actionButtons": [
    {
      "text": "Pay Now",
      "action": "pay_installment",
      "url": "/payments/installment/123"
    }
  ],
  "referenceId": "uuid",
  "referenceType": "payment_schedule",
  "expiresAt": "2024-03-20T00:00:00Z"
}
```

```http
GET /api/notifications/:userId
Authorization: Bearer <token>

Response:
{
  "success": true,
  "data": {
    "unreadCount": 5,
    "notifications": [
      {
        "id": "uuid",
        "title": "Payment Reminder",
        "message": "Your payment is due in 2 days",
        "type": "payment",
        "priority": 2,
        "isRead": false,
        "createdAt": "2024-03-15T10:00:00Z",
        "actionButtons": [...]
      }
    ]
  }
}
```

## 🛡️ Security & Compliance

### Security Monitoring
```http
GET /api/security/violations
Authorization: Bearer <token>
Role: admin
Query Parameters:
- deviceId: uuid
- severity: 1|2|3|4
- startDate: ISO date
- endDate: ISO date

Response:
{
  "success": true,
  "data": {
    "totalViolations": 25,
    "criticalViolations": 2,
    "violations": [
      {
        "id": "uuid",
        "deviceId": "uuid",
        "userId": "uuid",
        "type": "root_detected",
        "severity": 3,
        "description": "Root access detected during security scan",
        "evidenceData": {...},
        "resolved": false,
        "createdAt": "2024-03-15T10:30:00Z"
      }
    ]
  }
}
```

## 📋 Error Response Format

All API endpoints follow a consistent error response format:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": {
      "field": "email",
      "reason": "Invalid email format"
    },
    "timestamp": "2024-03-15T12:00:00Z",
    "requestId": "uuid"
  }
}
```

Common Error Codes:
- `VALIDATION_ERROR` - Input validation failed
- `AUTHENTICATION_REQUIRED` - Valid JWT token required
- `AUTHORIZATION_DENIED` - Insufficient permissions
- `RESOURCE_NOT_FOUND` - Requested resource doesn't exist
- `DEVICE_LOCKED` - Device is in locked state
- `PAYMENT_REQUIRED` - Payment needed to proceed
- `RATE_LIMIT_EXCEEDED` - Too many requests
- `SYSTEM_ERROR` - Internal server error