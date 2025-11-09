# TLB Diamond Backend API

Complete backend system for the TLB Diamond marketplace with MDM kiosk functionality.

## Features

- 🔐 **Authentication & Authorization**: JWT-based auth with role management
- 💰 **TLB Diamond Economy**: Wallet, transactions, installments, commissions
- 🛒 **E-commerce Platform**: Products, orders, reviews, seller management
- 👥 **Community System**: Multi-level referrals, bonuses, affiliate tracking
- 📱 **MDM Control**: Device locking, kiosk mode, security enforcement
- 🔧 **Admin Dashboard**: User management, analytics, system controls

## Quick Start

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Setup Environment
```bash
cp .env.example .env
# Edit .env with your database credentials
```

### 3. Setup PostgreSQL Database
```bash
# Install PostgreSQL if not already installed
sudo apt update
sudo apt install postgresql postgresql-contrib

# Create database and user
sudo -u postgres createuser --superuser tlb_admin
sudo -u postgres createdb tlb_diamond_db
sudo -u postgres psql -c "ALTER USER tlb_admin PASSWORD 'tlb_password_123';"
```

### 4. Start the Server
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

## API Documentation

### Base URL
```
http://localhost:3000/api/v1
```

### Authentication
```javascript
// Register
POST /auth/register
{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890",
  "gender": "male",
  "birthday": "1990-01-01",
  "accountType": "individual",
  "referralCode": "JOHN2024" // Optional
}

// Login  
POST /auth/login
{
  "email": "user@example.com",
  "password": "password123"
}
```

### Wallet Operations
```javascript
// Get wallet balance
GET /wallet
Headers: { Authorization: "Bearer <token>" }

// Send TLB
POST /wallet/send
{
  "recipient": "friend@example.com",
  "amount": 25.00,
  "message": "Thanks for helping!"
}

// Request payment
POST /wallet/request
{
  "requester": "someone@example.com", 
  "amount": 50.00,
  "message": "Payment for services"
}

// Top up wallet
POST /wallet/topup
{
  "method": "card",
  "amount": 100.00,
  "paymentDetails": {
    "card_number": "4111111111111111",
    "exp_month": "12",
    "exp_year": "2025",
    "cvc": "123"
  }
}
```

### MDM Operations
```javascript
// Lock device
POST /mdm/lock
Headers: { "X-Device-ID": "device123" }
{
  "reason": "payment_overdue",
  "details": {
    "order_id": "order123",
    "amount_due": 25.00
  }
}

// Unlock device
POST /mdm/unlock
{
  "unlock_code": "ABC123XY"
}

// Device status
GET /mdm/status
Headers: { "X-Device-ID": "device123" }
```

## Database Schema

### Core Tables
- `users` - User accounts and profiles
- `wallets` - TLB Diamond balances and limits  
- `transactions` - All financial transactions
- `products` - Marketplace inventory
- `orders` - Purchase orders with installments
- `devices` - MDM device registry
- `referrals` - Affiliate relationships
- `commissions` - Earnings from referrals
- `bonuses` - Reward system
- `mdm_events` - Device security events

### Key Relationships
- Users ↔ Wallets (1:1)
- Users ↔ Devices (1:Many)
- Users ↔ Orders (1:Many as buyer/seller)
- Orders ↔ Payments (1:Many for installments)
- Users ↔ Referrals (Many:Many hierarchical)

## Security Features

- 🔐 **JWT Authentication**: Secure token-based auth
- 🛡️ **Input Validation**: All endpoints protected
- 🚫 **Rate Limiting**: Prevent abuse
- 🔒 **Password Hashing**: bcrypt with salt rounds
- 📱 **Device Tracking**: Hardware fingerprinting
- 🚨 **MDM Enforcement**: Kiosk mode security

## Payment System

### TLB Diamond Currency
- Decimal precision to 2 places
- Wallet balances: Available, Locked, Pending
- Transaction types: Send, Receive, Purchase, Commission, Bonus
- Daily spending limits with compliance tracking

### Installment Support
- Flexible payment plans (2-6 installments)
- Support bonus system for assisted payments
- Automated payment tracking and enforcement
- Device locking for overdue payments

## Community Features

### Multi-Level Referrals
- 3+ generation tracking
- Configurable commission rates (50%, 25%, 12.5%)
- Real-time network analytics
- Performance leaderboards

### Bonus System
- Daily login rewards
- Birthday bonuses
- Gift-of-legacy forwarding
- Achievement-based rewards
- Time-limited availability

## MDM Capabilities

### Device Control
- Remote lock/unlock
- Kiosk mode enforcement
- Hardware button blocking
- App restriction policies
- Emergency unlock procedures

### Security Monitoring
- Hardware button violations
- App switching attempts
- Location tracking
- Battery monitoring
- Compliance reporting

## Admin Features

- User management and KYC
- Financial oversight and reporting
- Device fleet management
- Community analytics
- System health monitoring

## Environment Variables

```bash
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=tlb_diamond_db
DB_USERNAME=tlb_admin
DB_PASSWORD=tlb_password_123

# JWT
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d

# Server
NODE_ENV=development
PORT=3000

# Frontend CORS
FRONTEND_URL=http://localhost:19006
```

## Development Scripts

```bash
npm run dev      # Start with nodemon
npm start        # Production start
npm run setup    # Initialize database
npm run seed     # Add sample data
npm run reset    # Reset database
```

## API Response Format

### Success Response
```javascript
{
  "message": "Operation successful",
  "data": { ... },
  "timestamp": "2024-12-05T10:30:00.000Z"
}
```

### Error Response
```javascript
{
  "error": "Validation Error",
  "message": "Invalid input data",
  "details": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ],
  "timestamp": "2024-12-05T10:30:00.000Z"
}
```

## Testing

```bash
# Test endpoints with curl
curl -X GET http://localhost:3000/health
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@tlbdiamond.com","password":"TLBAdmin2024!"}'
```

## Production Deployment

1. Set `NODE_ENV=production`
2. Use environment variables for all secrets
3. Enable SSL/HTTPS
4. Setup PostgreSQL connection pooling
5. Configure reverse proxy (nginx)
6. Enable logging and monitoring
7. Setup backup procedures

## Support

For issues and questions:
- Check the API documentation
- Review error responses
- Check server logs
- Verify database connection
- Confirm environment variables