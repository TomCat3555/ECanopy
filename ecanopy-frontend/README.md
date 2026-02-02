# ECanopy Frontend - Complete Society Management System

Comprehensive React frontend for the ECanopy Society Management System. Works seamlessly with both .NET and Spring Boot backends.

## 🚀 Complete Feature Set

### **Authentication & Access Control**
- User registration and login with JWT tokens
- Role-based access control (Resident, RWA Member, RWA Secretary, RWA President, Admin)
- Protected routes and conditional UI rendering

### **Core Management Features**

#### **Complaint Management System**
- File complaints with categories, priorities, and attachments
- Public complaint tracking by ticket number
- Comment system for complaint updates
- Admin complaint status management
- Analytics dashboard for complaint metrics

#### **Property Management**
- Society creation and management
- Building management with floor details
- Flat management with types (1BHK, 2BHK, etc.)
- Visual building layouts showing all flats

#### **Payment & Financial Management**
- Payment recording with multiple methods
- Maintenance bill creation and tracking
- Financial dashboard with payment vs bills overview
- Payment history and outstanding calculations

#### **Notice Board System**
- Create and manage society notices
- Role-based notice creation permissions
- Chronological notice display

#### **RWA Management**
- RWA member management
- Role request processing (Member → Secretary → President)
- Ownership request handling
- Member role assignments

#### **Inventory Management**
- Society asset tracking
- Item categorization (Furniture, Electronics, etc.)
- Condition monitoring (Excellent, Good, Fair, Poor)
- Location-based inventory organization

#### **Request Management**
- Resident join requests
- Role elevation requests
- Property ownership claims
- Approval workflows for administrators

#### **Admin Panel**
- User management and role assignments
- System analytics and metrics
- Pending request approvals
- Complete system oversight

## 🎯 User Roles & Permissions

| Feature | Resident | RWA Member | RWA Secretary | RWA President | Admin |
|---------|----------|------------|---------------|---------------|---------|
| File Complaints | ✅ | ✅ | ✅ | ✅ | ✅ |
| Track Complaints | ✅ | ✅ | ✅ | ✅ | ✅ |
| View Notices | ✅ | ✅ | ✅ | ✅ | ✅ |
| Submit Requests | ✅ | ✅ | ✅ | ✅ | ✅ |
| Create Notices | ❌ | ❌ | ✅ | ✅ | ✅ |
| Manage Properties | ❌ | ❌ | ✅ | ✅ | ✅ |
| Handle Payments | ❌ | ❌ | ✅ | ✅ | ✅ |
| Manage Inventory | ❌ | ❌ | ✅ | ✅ | ✅ |
| RWA Management | ❌ | ❌ | ❌ | ✅ | ✅ |
| Admin Panel | ❌ | ❌ | ❌ | ❌ | ✅ |

## 📱 Application Routes

### **Public Routes**
- `/login` - User authentication
- `/register` - New user registration
- `/join-society` - Resident join request form
- `/track-complaint` - Public complaint tracking

### **Protected Routes**
- `/dashboard` - Main application dashboard with:
  - Complaints management
  - Society overview
  - Notice board
  - Request forms
  - Property management (RWA+)
  - Payment management (RWA+)
  - Inventory management (RWA+)
  - RWA management (President+)
  - Admin panel (Admin only)

## 🔧 Backend Compatibility

### **Dual Backend Support**
The frontend seamlessly works with both:
- **.NET Core API** (primary backend)
- **Spring Boot API** (mirror implementation)

### **API Endpoints Covered**
```
Authentication:
- POST /api/auth/login
- POST /api/auth/register
- GET /api/auth/me

Complaints:
- POST /api/complaints
- GET /api/complaints/track/{ticketNumber}
- POST /api/complaints/track/{ticketNumber}/comments
- PUT /api/complaints/track/{ticketNumber}/status
- GET /api/complaints/analytics

Society Management:
- GET /api/societies
- POST /api/societies
- GET /api/buildings
- POST /api/buildings
- GET /api/flats
- POST /api/flats

Payments:
- GET /api/payments
- POST /api/payments
- GET /api/maintainance-bills
- POST /api/maintainance-bills

RWA Management:
- GET /api/rwa/members
- POST /api/rwa/members
- GET /api/role-requests/pending
- POST /api/role-requests/process

Admin:
- GET /api/admin/dashboard
- GET /api/admin/users
- GET /api/resident-join-requests/pending
- POST /api/resident-join-requests/process

Inventory:
- GET /api/items
- POST /api/items
- PUT /api/items/{id}
- DELETE /api/items/{id}
```

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm build
```

## ⚙️ Configuration

### **Environment Variables**
```bash
# .NET Backend (default)
REACT_APP_API_URL=https://localhost:7001/api

# Spring Boot Backend
REACT_APP_API_URL=http://localhost:8080/api
```

### **Backend Switching**
Simply update the `.env` file to switch between backends. The frontend automatically adapts to both API implementations.

## 🏗️ Architecture

### **Component Structure**
```
src/
├── components/           # Reusable UI components
│   ├── Login.js         # Authentication
│   ├── Register.js      # User registration
│   ├── AdminPanel.js    # Admin management
│   ├── PropertyManagement.js  # Buildings & flats
│   ├── PaymentManagement.js   # Financial tracking
│   ├── RWAManagement.js       # RWA operations
│   ├── InventoryManagement.js # Asset tracking
│   ├── RequestForms.js        # User requests
│   ├── ComplaintTracker.js    # Public tracking
│   └── ResidentJoinRequest.js # Society joining
├── pages/               # Main application pages
│   └── Dashboard.js     # Central dashboard
├── api.js              # API service layer
├── AuthContext.js      # Authentication state
└── App.js              # Main application
```

### **State Management**
- **React Context** for authentication state
- **Local state** for component-specific data
- **API service layer** for backend communication

### **Styling Approach**
- **Inline styles** for rapid development
- **Responsive design** with CSS Grid and Flexbox
- **Consistent color scheme** and spacing
- **Mobile-friendly** interface

## 🎨 UI/UX Features

- **Role-based navigation** - Different menus for different user types
- **Modal dialogs** for forms and confirmations
- **Status indicators** with color coding
- **Real-time updates** through API calls
- **Responsive grid layouts** for all screen sizes
- **Loading states** and error handling
- **Intuitive icons** and visual cues

## 🔒 Security Features

- **JWT token authentication** with automatic refresh
- **Role-based access control** at component level
- **Protected routes** with authentication checks
- **Input validation** and sanitization
- **Secure API communication** with interceptors

## 📊 Analytics & Reporting

- **Complaint analytics** with status breakdowns
- **Payment tracking** with outstanding calculations
- **User activity** monitoring
- **System metrics** for administrators

## 🚀 Production Ready

- **Error boundaries** for graceful error handling
- **Loading states** for better user experience
- **Optimized builds** with code splitting
- **Environment-based configuration**
- **Cross-browser compatibility**

This frontend provides a complete, production-ready solution for society management with all the features needed to run a modern residential community efficiently.