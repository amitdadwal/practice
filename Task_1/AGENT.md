# Customer Management Dashboard - Project Context

## Purpose of this Document
This `AGENT.md` file serves as the persistent project memory and primary context document for all AI coding sessions. It provides a comprehensive overview of the Customer Management Dashboard's architecture, conventions, and current status. It is designed to give an AI assistant complete context about the project environment, rules, and existing patterns to ensure consistent and high-quality contributions.

## Project Overview
The Customer Management Dashboard is a React-based web application designed for internal administrators. It serves as a secure, centralized panel to view, manage, and maintain customer records. Its primary functionality includes robust user authentication, paginated data tables for browsing customer lists, and full CRUD (Create, Read, Update, Delete) capabilities for individual customer profiles.

## Functional Requirements
- **Authentication**: The application requires users to authenticate before accessing any data. It includes screens for Login, Forgot Password, and Reset Password, along with a secure logout flow.
- **Protected Routing**: Navigation is split into public routes (authentication) and protected routes (dashboard and customer management). Unauthenticated users are automatically redirected to the login page.
- **Customer Management**:
  - Administrators can view a paginated list of customers with search and filter capabilities.
  - Detailed customer information is accessible via a slide-out drawer.
  - Adding new customers or editing existing ones is handled through a shared modal form.
  - Deleting customers requires explicit confirmation via a dialog to prevent accidental data loss.
- **UI/UX**: The application provides clear feedback through Loading, Empty, Error, and Success states across all views. Global toast notifications alert users to the outcome of their actions. The design is fully responsive and accessible.

## Tech Stack
- **Frontend Framework**: React, Vite
- **Language**: TypeScript
- **Routing**: React Router DOM
- **UI Library**: Material UI (MUI)
- **State Management (Server)**: TanStack Query (React Query)
- **Forms & Validation**: React Hook Form, Zod
- **API Client**: Axios
- **Linting & Formatting**: ESLint, Prettier

## Folder Structure
```
src/
├── api/          # Axios instance and API service abstractions
├── assets/       # Static assets (images, icons, fonts)
├── components/   # Reusable React components
│   ├── Common/   # Generic UI components (Buttons, Modals, Inputs)
│   ├── Layout/   # Structural components (Sidebar, Header, Footer)
│   ├── Customer/ # Domain-specific components for the Customer module
│   └── UI/       # Themed UI wrappers around MUI components
├── constants/    # Global constants (e.g., Route paths, API endpoints)
├── contexts/     # React Context providers (e.g., Auth, Theme)
├── hooks/        # Custom React hooks (e.g., useAuth, React Query hooks)
├── layouts/      # Page layout wrappers (AuthLayout, DashboardLayout)
├── pages/        # Route components (Login, Dashboard, Customers)
├── routes/       # Route configuration and wrappers (ProtectedRoute)
├── schemas/      # Zod validation schemas
├── services/     # Business logic and API call wrappers
├── store/        # Global client state management (if needed)
├── styles/       # Global CSS/SCSS and theme overrides
├── theme/        # Material UI theme configuration
├── types/        # TypeScript interface and type definitions
├── utils/        # Utility functions and helpers
├── App.tsx       # Root component
└── main.tsx      # Application entry point
```

## Project Conventions
- **Coding Patterns**: Favor functional components and custom hooks. Keep components small, focused, and free of complex business logic where possible.
- **Routing Conventions**: Define all route paths in `constants/routeConstants.ts` to avoid hardcoded strings. Use `ProtectedRoute` wrappers for any route requiring authentication.
- **API Layer Conventions**: All network requests must go through the centralized Axios instance located in `api/axios.ts`, which handles token injection and global error catching. Define specific API calls in service files (e.g., `services/customerService.ts`).
- **Component Organization**: Group components by domain (`Customer/`) or purpose (`Common/`, `Layout/`). A component folder should ideally contain its `.tsx` file, its styles (if any), and its specific tests.
- **Styling Conventions**: Utilize Material UI's styling solutions (e.g., `sx` prop or styled components). Rely on the central theme (`theme/`) for colors, typography, and spacing to maintain consistency.
- **Naming Conventions**: 
  - PascalCase for React components and their filenames (`CustomerList.tsx`).
  - camelCase for functions, variables, and hooks (`useCustomers.ts`).
  - UPPER_SNAKE_CASE for constants (`API_BASE_URL`).
- **Type Imports**: Always use `import type { ... }` instead of regular imports for TypeScript types and interfaces to prevent unused import lint errors and ensure clean module resolution.
- **State Management**: Use TanStack Query for all asynchronous data fetching and server state. Use React Context or simple state for global UI state (like theme toggling or toast notifications).

## Architectural Decisions
- **Data Fetching**: Chosen TanStack Query over Redux for server state management to simplify caching, background updates, and loading states.
- **Form Handling**: Integrated React Hook Form with Zod resolvers to ensure performant, type-safe form validation without relying on heavy UI-blocking renders.
- **API Centralization**: Implemented a singleton Axios instance to handle auth token lifecycles (interception and injection) automatically, keeping the UI components clean of authentication logic.
- **Styling Strategy**: Consolidated design tokens within a central MUI `theme.ts` (typography, palette, border radii) and favored the `sx` prop with theme-aware values over inline styles to maintain a modern, consistent, and maintainable UI structure.
- **Design System Foundation**: Established a robust Material UI theme configured with standardized colors (Indigo/Sky Blue palette), spacing defaults, typography scale, component overrides (buttons, forms, cards, tables), and soft elevation shadows to ensure a cohesive, professional UI language across the application before feature development.
- **MUI Typography & System Props**: To avoid TypeScript "No overload matches this call" errors, especially when composing components (e.g., `MuiLink` with `react-router-dom`'s `Link`), style properties like `fontWeight`, `textTransform`, etc., MUST be passed via the `sx` prop (e.g., `sx={{ fontWeight: 'bold' }}`) rather than directly as component props on `Typography` or `Link`.
- **Code Splitting**: Implemented React.lazy and Suspense for route-level code splitting to optimize bundle size and initial load performance.

## Known Assumptions
- The backend API provides standard RESTful endpoints for authentication (JWT based) and Customer CRUD operations.
- The backend handles complex search and pagination logic; the frontend will pass appropriate query parameters.
- Material UI is the primary component library and will be customized via a central theme rather than overriding individual component styles extensively.

## API Endpoints (Expected)
- `AuthService`: `/auth/login`, `/auth/logout`, `/auth/forgot-password`, `/auth/reset-password`
- `CustomerService`: `/customers` (GET, POST), `/customers/:id` (GET, PUT, DELETE)

## Components
- **Layouts**: `AuthLayout`, `DashboardLayout` (includes Sidebar, Header, Breadcrumbs).
- **Common**: `DataTable`, `SearchBar`, `StatusBadge`, `PageHeader`, `EmptyState`, `ErrorState`, `LoadingTable`, `ConfirmDialog`, `Loader`, `ToastProvider`.
- **Customer Specific**: `CustomerListTable`, `CustomerDetailsDrawer`, `CustomerFormModal`.

## Project Status
- Phase 1 (Project Setup): Completed
- Phase 2 (Routing & Layout): Completed
- Phase 3 (Authentication): Completed
- Phase 4 (API Layer): Completed
- Phase 5 (Customer Management): Completed
- Phase 6 (Customer CRUD): Completed
- Phase 6 (Customer CRUD): Completed
- Phase 7 (Polish): Completed

## Completed Work
- Project documentation and AGENT.md context created.
- Initialize Vite project and configure TypeScript, ESLint, Prettier.
- Setup folder structure and configure Theme, React Query, Axios.
- Implement Route constants and App routing (Protected/Public routes).
- Build Layouts (Auth, Dashboard).
- Develop Authentication screens (Login, Forgot/Reset Password) and Auth context.
- Setup API Layer (Axios interceptors, services).
- Initial UI Polish for layouts and authentication forms (spacing, modern typography, component refactoring).
- Establish consistent Design System (Theme colors, typography, component styling overrides).
- Complete UI Modernization across Auth flows, Layouts, and Dashboard placeholders to reflect a production-ready B2B SaaS aesthetic.
- Build Customer List with Search, Pagination, Loading/Empty/Error states.
- Develop Customer CRUD operations (View Drawer, Add/Edit Modal, Delete Confirm).
- Phase 7 Polish: Added global Toast notifications, lazy loaded routing for performance, and debounced search inputs.

## Remaining Work
- Project implementation completed. Ready for production.

## AI Working Instructions
When beginning a new session or task, the AI assistant MUST adhere to the following rules:
1. **Read AGENT.md First**: Always review this document to understand project context, conventions, and current status.
2. **Read IMPLEMENTATION_PLAN.md**: Review the implementation plan before starting any work to understand the full scope of the requested features.
3. **Targeted Implementation**: Implement ONLY the phase or specific feature requested by the user. Do not preemptively build future phases.
4. **Preserve Architecture**: Strictly follow the established Folder Structure and Project Conventions.
5. **Avoid Unnecessary Refactoring**: Do not refactor existing code unless explicitly requested by the user or required to fix a bug.
6. **Reuse Existing Components**: Check the `components/Common` and `components/UI` directories for existing components before creating new ones.
7. **Document Updates**: After completing an implementation, you MUST update this `AGENT.md` file by:
   - Moving items from **Remaining Work** to **Completed Work**.
   - Updating the **Project Status** phase markers.
   - Recording any new **Architectural Decisions** made during the session.
   - Logging any new **Known Assumptions** discovered.
