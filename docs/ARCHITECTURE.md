# Architecture Documentation - WhatsApp Multi-Channel CRM

## Frontend Architecture
The frontend is built as a single-page application (SPA) using React and Vite, following a component-based architecture.

### Directory Structure
- `frontend/src/pages`: Contains main route components, organized by user roles (e.g., `admin/`, `counselor/`, `manager/`).
- `frontend/src/components`: (Implied) Modular UI elements like buttons, inputs, and layout wrappers.
- `frontend/src/hooks`: Custom React hooks for business logic and data fetching wrappers.
- `frontend/src/store`: Zustand stores for global state (Theme, Auth, Filters).

### State Management
- **Local State**: `useState` for UI-specific toggles.
- **Global State**: `Zustand` for application-wide data (Active Country, User Profile, Sidebar collapse state).
- **Server State**: `React Query` for managing API requests, caching, and background synchronization to ensure a snappy user experience.

### Micro-Interactions
- `Framer Motion` handles all animations, including sidebar transitions and KPI card hover effects, maintaining a consistent 60fps experience.

---

## Backend Architecture
The backend is a Node.js/Express REST API designed for scalability and real-time communication.

### Layers
- **Routing Layer**: `backend/src/routes/` defines the API surface.
- **Controller Layer**: `backend/src/controllers/` handles request validation and calls the service layer.
- **Service Layer**: `backend/src/services/` (implied) contains the core business logic.
- **Data Layer**: `Prisma ORM` interacts with the underlying database (MySQL/PostgreSQL), ensuring safe and efficient queries.

### Communication
- **REST**: Standard HTTP methods for CRUD operations.
- **WebSockets**: `Socket.io` used for real-time inbox messaging and notification broadcasting.

## Data Flow
1. User interacts with a UI component.
2. Component triggers a React Query mutation or query.
3. React Query sends an HTTP request to the Express API.
4. Express routes the request to a controller.
5. Controller interacts with Prisma to fetch/update data.
6. Real-time updates are pushed back via Socket.io if necessary.
7. React Query caches the result and updates the UI automatically.
