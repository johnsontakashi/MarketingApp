# TLB Diamond Marketplace UI Wireframes & Component Architecture

## 🎨 Design System Overview

### Color Palette (Extending Current Golden Theme)
```
Primary Colors:
- Gold Primary: #D4AF37 (Current)
- Gold Secondary: #B8860B (Current)
- Gold Light: #F5E6A3 (Current)
- Gold Dark: #8B4513

Semantic Colors:
- Success: #10B981 (Green)
- Warning: #F59E0B (Amber)
- Error: #EF4444 (Red)
- Info: #3B82F6 (Blue)

Neutral Colors:
- Background: #FFF8E7 (Current cream)
- Surface: #FFFFFF
- Text Primary: #2C1810 (Current dark brown)
- Text Secondary: #8B4513
- Border: #D4AF37
```

### Typography
```
Font Family: Inter (System fallback: -apple-system, BlinkMacSystemFont)

Headings:
- H1: 28px, Bold, #2C1810
- H2: 24px, Bold, #2C1810
- H3: 20px, SemiBold, #2C1810
- H4: 18px, SemiBold, #2C1810

Body Text:
- Large: 16px, Regular, #2C1810
- Medium: 14px, Regular, #2C1810
- Small: 12px, Regular, #8B4513

Interactive:
- Button Text: 16px, SemiBold, #FFFFFF
- Link Text: 14px, Medium, #D4AF37
```

---

## 📱 MOBILE APP WIREFRAMES

### 1. Authentication Screens

```
┌─────────────────────────────┐
│  WELCOME SCREEN             │
├─────────────────────────────┤
│  [TLB Logo]                 │
│                             │
│  Welcome to TLB Diamond     │
│  Secure Marketplace        │
│                             │
│  🔹 Buy with confidence     │
│  🔹 Sell with guarantee     │
│  🔹 Earn with community     │
│                             │
│  [Get Started]              │
│  [Already have account?]    │
└─────────────────────────────┘
```

```
┌─────────────────────────────┐
│  REGISTRATION SCREEN        │
├─────────────────────────────┤
│  ← Create Account           │
│                             │
│  [First Name     ]          │
│  [Last Name      ]          │
│  [Email          ]          │
│  [Password       ]          │
│  [Confirm Pass   ]          │
│  [Birth Date     ]          │
│  [Referral Code  ] Optional │
│                             │
│  ☐ I accept Terms & Privacy │
│  ☐ MDM Lock Agreement       │
│                             │
│  [Continue]                 │
│                             │
│  Already have account? Login│
└─────────────────────────────┘
```

### 2. Enhanced Home Dashboard

```
┌─────────────────────────────┐
│  HOME DASHBOARD             │
├─────────────────────────────┤
│  👤 Hi John! 🔔[3]          │
│  💰 Wallet: 1,250.00 TLB    │
│  🔒 Device: Secure          │
│                             │
│  ┌─ Quick Actions ─────────┐│
│  │ 🛒Buy  💰Pay  🎁Bonus   ││
│  │ 📦Orders 👥Referrals    ││
│  └─────────────────────────┘│
│                             │
│  📊 Your Overview           │
│  ┌─────────────────────────┐│
│  │ Active Orders: 2        ││
│  │ Pending Payments: $50   ││
│  │ Available Bonuses: 3    ││
│  │ Referral Earnings: $25  ││
│  └─────────────────────────┘│
│                             │
│  🔥 Featured Products       │
│  [Product Cards Carousel]   │
└─────────────────────────────┘
```

### 3. Marketplace Interface

```
┌─────────────────────────────┐
│  MARKETPLACE                │
├─────────────────────────────┤
│  [Search Bar          ] 🔍  │
│  Filters: All 🔽 Sort: 🔽   │
│                             │
│  Categories                 │
│  🔌Electronics  👕Fashion   │
│  🏠Home        🏃Sports     │
│                             │
│  ┌─ Product Card ──────────┐│
│  │ [Product Image]         ││
│  │ Product Title       ⭐4.5││
│  │ 💎 100.00 TLB          ││
│  │ 🏪 Seller Name          ││
│  │ 🎁 50% Support Bonus    ││
│  │ 💳 4 Installments       ││
│  └─────────────────────────┘│
│                             │
│  [More Product Cards...]    │
│                             │
│  ├── 🏠Home  🛒Shop  👤Me ──┤
└─────────────────────────────┘
```

### 4. Product Detail Screen

```
┌─────────────────────────────┐
│  PRODUCT DETAIL             │
├─────────────────────────────┤
│  ← [Share] [❤️Save]         │
│                             │
│  [Product Image Gallery]    │
│  ●●○○○                      │
│                             │
│  Premium Headphones    ⭐4.8│
│  by TechStore          (25) │
│                             │
│  💎 200.00 TLB              │
│  ~~250.00~~ 20% OFF         │
│                             │
│  🎁 Support Bonus Available │
│  Pay 100 TLB now + 4 payments│
│  Device lock required       │
│                             │
│  📦 In Stock (15 left)      │
│  🚚 Free shipping           │
│                             │
│  [Add to Cart] [Buy Now]    │
│                             │
│  📝 Description             │
│  🔧 Specifications          │
│  ⭐ Reviews (25)             │
└─────────────────────────────┘
```

### 5. Checkout & Support Bonus Flow

```
┌─────────────────────────────┐
│  CHECKOUT - PAYMENT PLAN    │
├─────────────────────────────┤
│  ← Cart Summary             │
│                             │
│  Total: 💎 200.00 TLB       │
│                             │
│  Payment Options:           │
│  ○ Pay Full Amount          │
│  ● Split Payment + Bonus    │
│                             │
│  ┌─ Split Payment Plan ────┐│
│  │ Pay Now: 💎 100.00 TLB  ││
│  │ Support Bonus: 100.00   ││
│  │ Installments: 4x 25.00  ││
│  │ Every 2 weeks           ││
│  └─────────────────────────┘│
│                             │
│  ⚠️ MDM Lock Required       │
│  Your device will be locked │
│  until payments complete    │
│                             │
│  [Continue to Lock Agreement]│
└─────────────────────────────┘
```

```
┌─────────────────────────────┐
│  MDM LOCK AGREEMENT         │
├─────────────────────────────┤
│  🔒 Device Lock Terms       │
│                             │
│  By accepting Support Bonus:│
│                             │
│  ✓ Device will be locked    │
│  ✓ 100-hour grace period    │
│  ✓ Unlock after final payment│
│  ✓ No root/reset allowed    │
│                             │
│  Grace Period Details:      │
│  • Automatic after missed   │
│    payment                  │
│  • Excludes weekends        │
│  • Support available 24/7   │
│                             │
│  ┌─────────────────────────┐│
│  │ I understand and agree  ││
│  │ to device lock terms    ││
│  │ [Toggle Switch]      ○  ││
│  └─────────────────────────┘│
│                             │
│  [Proceed with Order]       │
└─────────────────────────────┘
```

### 6. Order Management & Payment

```
┌─────────────────────────────┐
│  MY ORDERS                  │
├─────────────────────────────┤
│  Active (2) Completed (5)   │
│                             │
│  ┌─ Order #TLB240315001 ───┐│
│  │ Premium Headphones      ││
│  │ 💎 200.00 TLB           ││
│  │ 📦 Shipped              ││
│  │ 🚚 Track Package        ││
│  │                         ││
│  │ Payment: 2/4 Complete   ││
│  │ Next: 💎 25.00 TLB      ││
│  │ Due: Mar 29, 2024       ││
│  │ 🔒 Device Locked        ││
│  └─────────────────────────┘│
│                             │
│  ┌─ Order #TLB240310002 ───┐│
│  │ Gaming Mouse            ││
│  │ 💎 50.00 TLB            ││
│  │ ✅ Delivered            ││
│  │ 💎 Paid in Full         ││
│  │ [Rate & Review]         ││
│  └─────────────────────────┘│
└─────────────────────────────┘
```

```
┌─────────────────────────────┐
│  PAYMENT SCHEDULE           │
├─────────────────────────────┤
│  Order #TLB240315001        │
│  Premium Headphones         │
│                             │
│  Payment Progress: 50%      │
│  ████████░░░░░░░░░░         │
│                             │
│  ✅ Initial: 💎 100.00 TLB  │
│     Paid: Mar 15, 2024      │
│                             │
│  ✅ Install 1: 💎 25.00 TLB │
│     Paid: Mar 29, 2024      │
│                             │
│  🔸 Install 2: 💎 25.00 TLB │
│     Due: Apr 12, 2024       │
│     [Pay Now]               │
│                             │
│  ⏳ Install 3: 💎 25.00 TLB │
│     Due: Apr 26, 2024       │
│                             │
│  ⏳ Install 4: 💎 25.00 TLB │
│     Due: May 10, 2024       │
│                             │
│  🔒 Device unlocks after    │
│     final payment           │
└─────────────────────────────┘
```

### 7. Wallet & Community Hub

```
┌─────────────────────────────┐
│  TLB WALLET                 │
├─────────────────────────────┤
│  💰 Balance                 │
│  1,250.00 TLB               │
│                             │
│  Available: 1,200.00        │
│  Locked: 50.00              │
│  Pending: 0.00              │
│                             │
│  Quick Actions:             │
│  [Send] [Request] [History] │
│                             │
│  📊 This Month              │
│  Earned: +150.00 TLB        │
│  Spent: -300.00 TLB         │
│  Bonuses: +75.00 TLB        │
│                             │
│  Recent Transactions        │
│  ┌─────────────────────────┐│
│  │ + Referral Bonus        ││
│  │ +5.00 TLB   Today       ││
│  └─────────────────────────┘│
│  ┌─────────────────────────┐│
│  │ - Order Payment         ││
│  │ -25.00 TLB  Yesterday   ││
│  └─────────────────────────┘│
└─────────────────────────────┘
```

```
┌─────────────────────────────┐
│  COMMUNITY HUB              │
├─────────────────────────────┤
│  🤝 Your Network            │
│  Referrals: 12 | Earnings: 💎45│
│                             │
│  🎁 Available Bonuses (3)   │
│  ┌─────────────────────────┐│
│  │ 🎂 Birthday Bonus       ││
│  │ 💎 50.00 TLB            ││
│  │ Expires in 2 days       ││
│  │ [Claim Now]             ││
│  └─────────────────────────┘│
│                             │
│  ┌─────────────────────────┐│
│  │ ⭐ Gift of Legacy        ││
│  │ 💎 25.00 TLB            ││
│  │ From: Sarah M.          ││
│  │ "Good luck! 🍀"         ││
│  │ [Claim] [Forward]       ││
│  └─────────────────────────┘│
│                             │
│  📈 Your Referral Tree      │
│  Gen 1: 5 people (💎25.00)  │
│  Gen 2: 7 people (💎15.00)  │
│  [View Full Tree]           │
└─────────────────────────────┘
```

### 8. Device Lock Status Interface

```
┌─────────────────────────────┐
│  DEVICE STATUS              │
├─────────────────────────────┤
│  🔒 Device Locked           │
│  Active since: Mar 15, 2024 │
│                             │
│  Lock Reason:               │
│  Support Bonus - Order      │
│  #TLB240315001              │
│                             │
│  ⏱️ Payment Progress         │
│  2 of 4 payments complete   │
│  ████████░░░░░░░░░░         │
│                             │
│  🕐 Grace Period Status     │
│  No missed payments         │
│  Good standing ✅           │
│                             │
│  📅 Next Payment            │
│  💎 25.00 TLB               │
│  Due: Apr 12, 2024          │
│  [Pay Now]                  │
│                             │
│  🆘 Need Help?              │
│  [Contact Support]          │
│  [Emergency Unlock Request] │
└─────────────────────────────┘
```

---

## 🌐 WEB DASHBOARD WIREFRAMES

### 1. Admin Dashboard Overview

```
┌─────────────────────────────────────────────────────────────┐
│  TLB DIAMOND ADMIN DASHBOARD                                │
├─────────────────────────────────────────────────────────────┤
│  [Logo] Dashboard    👤 Admin User  🔔 [3]  ⚙️ Settings     │
├─────────────────────────────────────────────────────────────┤
│  📊 SYSTEM OVERVIEW                    📈 REAL-TIME METRICS │
│  ┌─────────────────┬─────────────────┐ ┌─────────────────┐ │
│  │ Total Users     │ Active Devices  │ │ Live Transactions│ │
│  │ 10,247         │ 8,950          │ │ [Live Feed]     │ │
│  │ ↗️ +15 today    │ 🔒 142 locked   │ │                 │ │
│  └─────────────────┴─────────────────┘ │ [Scrolling      │ │
│  ┌─────────────────┬─────────────────┐ │  transaction    │ │
│  │ Orders Today    │ Revenue (24h)   │ │  list]          │ │
│  │ 89 orders      │ 💎 12,450 TLB   │ │                 │ │
│  │ ↗️ +12%         │ ↗️ +8%          │ └─────────────────┘ │
│  └─────────────────┴─────────────────┘                     │
│                                                             │
│  🚨 ALERTS & NOTIFICATIONS              📱 DEVICE STATUS   │
│  ┌─────────────────────────────────────┐ ┌─────────────────┐ │
│  │ ⚠️ 3 Payment Defaults               │ │ Device Fleet    │ │
│  │ 🔐 2 Security Violations            │ │ └── Active: 8950│ │
│  │ 📦 5 Shipping Delays                │ │ └── Locked: 142 │ │
│  │ [View All Alerts]                   │ │ └── Grace: 23   │ │
│  └─────────────────────────────────────┘ │ └── Violations:5│ │
│                                         └─────────────────┘ │
│  [View Users] [Manage Orders] [Device Control] [Reports]    │
└─────────────────────────────────────────────────────────────┘
```

### 2. User Management Interface

```
┌─────────────────────────────────────────────────────────────┐
│  USER MANAGEMENT                                            │
├─────────────────────────────────────────────────────────────┤
│  🔍 [Search users...        ] 🔽 Filter 📊 Export          │
│                                                             │
│  Filters: All Users 🔽 Status: All 🔽 KYC: All 🔽         │
│                                                             │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │ User ID  │ Name         │ Type   │ Status │ KYC │ Actions││
│  ├─────────────────────────────────────────────────────────┤ │
│  │ 1001     │ John Doe     │ Buyer  │ Active │ ✅  │ [View] ││
│  │ 1002     │ Jane Smith   │ Seller │ Active │ ✅  │ [View] ││
│  │ 1003     │ Bob Johnson  │ Affiliate│ Lock  │ ⏳  │ [Edit] ││
│  │ 1004     │ Alice Brown  │ Buyer  │ Active │ ❌  │ [KYC]  ││
│  └─────────────────────────────────────────────────────────┘ │
│                                                             │
│  📋 Bulk Actions: [Select All] [Suspend] [Export]          │
│  📄 Showing 1-20 of 10,247 users    [< 1 2 3 ... 512 >]   │
└─────────────────────────────────────────────────────────────┘
```

### 3. Device Fleet Management

```
┌─────────────────────────────────────────────────────────────┐
│  DEVICE MANAGEMENT                                          │
├─────────────────────────────────────────────────────────────┤
│  🔍 [Search by device ID...] 📍 Map View 📊 Export         │
│                                                             │
│  🔐 Lock Controls: [Lock Selected] [Unlock] [Emergency]    │
│                                                             │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │Device ID │ User      │ Model      │ Status │ Last Seen  ││
│  ├─────────────────────────────────────────────────────────┤ │
│  │DEV001    │John Doe   │iPhone 14   │🔒Locked│2 min ago   ││
│  │DEV002    │Jane Smith │Galaxy S23  │✅Active│5 min ago   ││
│  │DEV003    │Bob J.     │Pixel 7     │⏳Grace │1 hour ago  ││
│  │DEV004    │Alice B.   │iPhone 13   │⚠️Viol. │3 hours ago ││
│  └─────────────────────────────────────────────────────────┘ │
│                                                             │
│  📊 Fleet Statistics:                                       │
│  Total: 8,950  Active: 8,805  Locked: 142  Grace: 23       │
│                                                             │
│  🗺️ Geographic Distribution: [Interactive Map]             │
└─────────────────────────────────────────────────────────────┘
```

### 4. Financial Overview Dashboard

```
┌─────────────────────────────────────────────────────────────┐
│  FINANCIAL DASHBOARD                                        │
├─────────────────────────────────────────────────────────────┤
│  💰 REVENUE OVERVIEW                    📊 PAYMENT ANALYSIS │
│  ┌─────────────────────────────────────┐ ┌─────────────────┐ │
│  │ Today: 💎 12,450 TLB                │ │ Payment Status  │ │
│  │ This Week: 💎 89,230 TLB            │ │ ████ 78% Success│ │
│  │ This Month: 💎 342,100 TLB          │ │ ████ 15% Pending│ │
│  │ [Revenue Chart - 30 days]           │ │ ██   5% Failed  │ │
│  └─────────────────────────────────────┘ │ ██   2% Default │ │
│                                         └─────────────────┘ │
│  🎁 SUPPORT BONUS POOL                 💳 COMMISSION SYSTEM │
│  ┌─────────────────────────────────────┐ ┌─────────────────┐ │
│  │ Total Pool: 💎 125,000 TLB          │ │ Generated: 💎 450│ │
│  │ Used Today: 💎 2,340 TLB            │ │ Paid: 💎 420    │ │
│  │ Available: 💎 122,660 TLB           │ │ Pending: 💎 30  │ │
│  │ Risk Level: Low ✅                  │ │ This Month      │ │
│  │ [Pool Management]                   │ │ [Commission Log]│ │
│  └─────────────────────────────────────┘ └─────────────────┘ │
│                                                             │
│  ⚠️ RISK ALERTS                                             │
│  • 3 users in grace period over 48 hours                   │
│  • Support bonus usage up 12% this week                    │
│  • 2 high-value orders require manual review               │
└─────────────────────────────────────────────────────────────┘
```

---

## 🧩 COMPONENT ARCHITECTURE

### Core Component Structure

```javascript
src/
├── components/
│   ├── ui/ (Reusable UI Components)
│   │   ├── Button.js
│   │   ├── Card.js
│   │   ├── Modal.js
│   │   ├── Input.js
│   │   ├── Badge.js
│   │   ├── LoadingSpinner.js
│   │   ├── ProgressBar.js
│   │   └── StatusIndicator.js
│   │
│   ├── layout/ (Layout Components)
│   │   ├── Header.js
│   │   ├── Navigation.js
│   │   ├── TabBar.js
│   │   ├── Sidebar.js
│   │   └── Container.js
│   │
│   ├── auth/ (Authentication)
│   │   ├── LoginForm.js
│   │   ├── RegisterForm.js
│   │   ├── KYCUpload.js
│   │   ├── BiometricAuth.js
│   │   └── TwoFactorAuth.js
│   │
│   ├── marketplace/ (Shopping)
│   │   ├── ProductCard.js
│   │   ├── ProductGrid.js
│   │   ├── ProductDetail.js
│   │   ├── CategoryFilter.js
│   │   ├── SearchBar.js
│   │   ├── CartSummary.js
│   │   ├── CheckoutFlow.js
│   │   └── PaymentPlan.js
│   │
│   ├── wallet/ (Wallet & Payments)
│   │   ├── WalletBalance.js
│   │   ├── TransactionList.js
│   │   ├── PaymentForm.js
│   │   ├── TransferForm.js
│   │   ├── PaymentSchedule.js
│   │   └── QRScanner.js
│   │
│   ├── community/ (Social Features)
│   │   ├── ReferralTree.js
│   │   ├── AffiliateStats.js
│   │   ├── BonusCard.js
│   │   ├── CommissionTracker.js
│   │   ├── GiftOfLegacy.js
│   │   └── LeaderBoard.js
│   │
│   ├── mdm/ (Device Management)
│   │   ├── DeviceStatus.js
│   │   ├── LockControls.js
│   │   ├── ComplianceChecker.js
│   │   ├── SecurityScanner.js
│   │   ├── GracePeriodTimer.js
│   │   └── EmergencyUnlock.js
│   │
│   ├── orders/ (Order Management)
│   │   ├── OrderCard.js
│   │   ├── OrderTracking.js
│   │   ├── OrderHistory.js
│   │   ├── OrderStatus.js
│   │   └── ReviewForm.js
│   │
│   └── admin/ (Admin Dashboard)
│       ├── MetricCards.js
│       ├── UserTable.js
│       ├── DeviceFleet.js
│       ├── FinancialCharts.js
│       ├── AlertCenter.js
│       └── SystemControls.js
```

### Key Component Examples

#### 1. Enhanced Lock Control Component
```javascript
// components/mdm/LockControls.js
import React, { useState } from 'react';
import { Modal, Alert } from 'react-native';
import { useLockStatus } from '../../hooks/useLockStatus';

const LockControls = ({ orderId, supportBonusAmount }) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [lockConsent, setLockConsent] = useState(false);
  const { lockDevice, isLocking } = useLockStatus();

  const handleLockConsent = async () => {
    if (!lockConsent) {
      Alert.alert('Consent Required', 'Please accept lock terms');
      return;
    }

    try {
      await lockDevice({
        orderId,
        supportBonusAmount,
        gracePeriodHours: 100
      });
      setShowConfirm(false);
    } catch (error) {
      Alert.alert('Lock Failed', error.message);
    }
  };

  return (
    <>
      <TouchableOpacity 
        style={styles.activateButton}
        onPress={() => setShowConfirm(true)}
      >
        <Text style={styles.buttonText}>
          Activate Support Bonus
        </Text>
      </TouchableOpacity>

      <Modal visible={showConfirm} animationType="slide">
        <LockConsentModal
          onConsent={setLockConsent}
          onConfirm={handleLockConsent}
          onCancel={() => setShowConfirm(false)}
          isLoading={isLocking}
        />
      </Modal>
    </>
  );
};
```

#### 2. Payment Schedule Component
```javascript
// components/wallet/PaymentSchedule.js
import React from 'react';
import { View, Text } from 'react-native';
import { PaymentProgressBar } from '../ui/ProgressBar';
import { PaymentButton } from '../ui/Button';

const PaymentSchedule = ({ schedule, onPayment }) => {
  const paidCount = schedule.filter(p => p.status === 'paid').length;
  const progress = (paidCount / schedule.length) * 100;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Payment Progress</Text>
      <PaymentProgressBar progress={progress} />
      
      {schedule.map((payment, index) => (
        <PaymentScheduleItem
          key={payment.id}
          payment={payment}
          onPay={() => onPayment(payment)}
        />
      ))}
    </View>
  );
};
```

#### 3. Bonus Management Component
```javascript
// components/community/BonusCard.js
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { BonusIcon } from '../ui/Icons';

const BonusCard = ({ bonus, onClaim }) => {
  const getBonusIcon = (type) => {
    const icons = {
      daily: '🎁',
      birthday: '🎂',
      referral: '🤝',
      gift_of_legacy: '⭐',
      support: '🛡️'
    };
    return icons[type] || '🎁';
  };

  return (
    <View style={styles.bonusCard}>
      <View style={styles.header}>
        <Text style={styles.icon}>{getBonusIcon(bonus.type)}</Text>
        <Text style={styles.title}>{bonus.title}</Text>
        <Text style={styles.amount}>💎 {bonus.amount} TLB</Text>
      </View>
      
      <Text style={styles.description}>{bonus.description}</Text>
      
      {bonus.giver && (
        <Text style={styles.giver}>From: {bonus.giver}</Text>
      )}
      
      <TouchableOpacity 
        style={styles.claimButton}
        onPress={() => onClaim(bonus)}
      >
        <Text style={styles.claimText}>Claim Bonus</Text>
      </TouchableOpacity>
    </View>
  );
};
```

This comprehensive UI wireframe and component architecture provides a solid foundation for implementing the TLB Diamond Marketplace while maintaining the golden theme and ensuring a smooth user experience across all features.