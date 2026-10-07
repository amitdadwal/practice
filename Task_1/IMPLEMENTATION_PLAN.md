# Customer Management Dashboard - Implementation Plan

## Project Overview

Build a production-ready Customer Management Dashboard for an Admin Panel from scratch.

The project should follow scalable frontend architecture with proper separation of concerns, reusable components, routing, layouts, authentication, API abstraction, and maintainable folder structure.

---

# Tech Stack

- React
- TypeScript
- Vite
- React Router DOM
- Material UI
- TanStack Query
- React Hook Form
- Zod
- Axios
- ESLint
- Prettier

---

# Project Architecture

```
src/
│
├── api/
│   ├── axios.ts
│   ├── endpoints.ts
│   └── customerApi.ts
│
├── assets/
│   ├── images/
│   ├── icons/
│   └── fonts/
│
├── components/
│   ├── Common/
│   ├── Layout/
│   ├── Customer/
│   └── UI/
│
├── constants/
│
├── contexts/
│
├── hooks/
│
├── layouts/
│   ├── AuthLayout.tsx
│   └── DashboardLayout.tsx
│
├── pages/
│   ├── Auth/
│   │   ├── Login/
│   │   ├── ForgotPassword/
│   │   ├── ResetPassword/
│   │   └── Unauthorized/
│   │
│   ├── Dashboard/
│   │
│   ├── Customers/
│   │
│   └── NotFound/
│
├── routes/
│   ├── AppRoutes.tsx
│   ├── ProtectedRoute.tsx
│   ├── PublicRoute.tsx
│   └── routeConstants.ts
│
├── schemas/
│
├── services/
│
├── store/
│
├── styles/
│
├── theme/
│
├── types/
│
├── utils/
│
├── App.tsx
│
└── main.tsx
```

---

# Authentication Module

## Screens

### Login

Fields

- Email
- Password

Buttons

- Login
- Forgot Password

Validation

- Email required
- Password required

---

### Forgot Password

Fields

- Email

Button

- Send Reset Link

---

### Reset Password

Fields

- Password
- Confirm Password

Validation

- Required
- Passwords must match

---

### Unauthorized

Simple page shown when user doesn't have permission.

---

# Layouts

## AuthLayout

Used for

- Login
- Forgot Password
- Reset Password

Responsibilities

- Center authentication card
- Branding
- Responsive layout

---

## DashboardLayout

Contains

- Sidebar
- Header
- Main Content
- Footer (optional)

Responsible for

- Navigation
- User menu
- Logout
- Protected pages

---

# Routing

## Public Routes

- Login
- Forgot Password
- Reset Password

---

## Protected Routes

- Dashboard
- Customers

ProtectedRoute should

- Check authentication
- Redirect to Login if not authenticated

---

## Route Constants

```
LOGIN

FORGOT_PASSWORD

RESET_PASSWORD

DASHBOARD

CUSTOMERS
```

Avoid hardcoded route strings.

---

# Authentication Flow

1. User visits Login.
2. Submit credentials.
3. Store authentication token.
4. Redirect to Dashboard.
5. Axios automatically attaches token.
6. Logout clears token and redirects to Login.

---

# API Layer

## Axios Instance

Responsibilities

- Base URL
- Authorization Header
- Request Interceptor
- Response Interceptor
- Global Error Handling

---

# Customer Module

## Customer List

Features

- Table
- Pagination
- Search
- Loading
- Empty
- Error

Columns

- Name
- Email
- Company
- Status
- Created Date
- Actions

---

## Customer Details Drawer

Displays

- Name
- Email
- Company
- Status
- Created Date

Includes

- Loading state
- Error state

---

## Customer Form Modal

Shared for

- Add Customer
- Edit Customer

Validation

- Name required
- Email required
- Company required
- Status required

---

## Delete Customer

Confirmation dialog before deletion.

---

# Shared Components

## Layout

- Sidebar
- Header
- Breadcrumbs
- User Menu

---

## Common

- DataTable
- SearchBar
- StatusBadge
- PageHeader
- EmptyState
- ErrorState
- LoadingTable
- ConfirmDialog
- Loader
- ToastProvider

---

# Services

## AuthService

- login()
- logout()
- forgotPassword()
- resetPassword()

---

## CustomerService

- getCustomers()
- getCustomer()
- createCustomer()
- updateCustomer()
- deleteCustomer()

---

# Hooks

## Authentication

- useAuth()

## Customer

- useCustomers()
- useCustomer()
- useCreateCustomer()
- useUpdateCustomer()
- useDeleteCustomer()

---

# Form Validation

Use

- React Hook Form
- Zod

Schemas

- loginSchema
- forgotPasswordSchema
- resetPasswordSchema
- customerSchema

---

# Global State

Authentication

- User
- Token
- Authentication Status

UI

- Theme
- Sidebar State
- Toast State

---

# UI States

Every page should support

- Loading
- Empty
- Error
- Success

---

# Notifications

Global Toast Provider

Success

- Login Successful
- Customer Added
- Customer Updated
- Customer Deleted

Error

- Login Failed
- Network Error
- Validation Error

---

# Accessibility

- Keyboard navigation
- Focus management
- ARIA labels
- Semantic HTML
- Accessible dialogs
- Accessible drawers

---

# Performance

- Debounced search
- React Query caching
- Memoized components
- Lazy loaded routes
- Code splitting

---

# Development Phases

## Phase 1 — Project Setup

- [x] Initialize Vite
- [x] Configure TypeScript
- [x] Install dependencies
- [x] Configure ESLint & Prettier
- [x] Setup folder structure
- [x] Configure Theme
- [x] Configure React Query
- [x] Configure Axios

---

## Phase 2 — Routing & Layout

- [x] Route constants
- [x] App routes
- [x] Protected routes
- [x] Public routes
- [x] Auth layout
- [x] Dashboard layout
- [x] Sidebar
- [x] Header

---

## Phase 3 — Authentication

- [x] Login screen
- [x] Forgot Password
- [x] Reset Password
- [x] Authentication context
- [x] Token storage
- [x] Logout flow

---

## Phase 4 — API Layer

- [x] Axios instance
- [x] Interceptors
- [x] Auth service
- [x] Customer service

---

## Phase 5 — Customer Management

- [x] Customer table
- [x] Search
- [x] Pagination
- [x] Loading state
- [x] Empty state
- [x] Error state

---

## Phase 6 — Customer CRUD

- [x] View customer drawer
- [x] Add customer
- [x] Edit customer
- [x] Delete confirmation

---

## Phase 7 — Polish

- [x] Toast notifications
- [x] Accessibility
- [x] Performance optimization
- [x] Responsive design
- [x] Code cleanup
- [x] Documentation

---

# Definition of Done

- [x] Complete authentication flow
- [x] Protected routing
- [x] Dashboard layout
- [x] Customer CRUD
- [x] Search
- [x] Pagination
- [x] Validation
- [x] Loading states
- [x] Empty states
- [x] Error states
- [x] Toast notifications
- [x] Responsive UI
- [x] Accessibility
- [x] Type-safe APIs
- [x] Clean architecture
- [x] Production-ready code