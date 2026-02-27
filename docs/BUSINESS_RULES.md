# Business Rules - WhatsApp Multi-Channel CRM

## Role-Based Dashboard Rules
The system enforces strict data visibility and functional access based on user roles:

| Role | Core KPIs | Primary Responsibilities |
| :--- | :--- | :--- |
| **Super Admin** | Total Clients, Overall Revenue | Global system monitoring, high-level activity tables. |
| **Admin** | Channel counts, Routing status | Channel management, UI/AI Configuration, User management. |
| **Manager** | Leads Today, Conversion Rate | Performance oversight, Team productivity tables. |
| **Team Leader** | Pending Replies, SLA Status | Operational bottleneck identification, Counselor performance. |
| **Counselor** | Active Follow-ups, Hot Leads | Daily lead engagement, Detail-oriented CRM updates. |
| **Support** | New Messages, Wait Time | Real-time chat response, Ticket resolution. |

## Unified Inbox Logic
- **Left Panel (Conversation List)**: Sorted by recency and unread status.
- **Center Panel (Chat)**: Real-time sync with WhatsApp.
- **Right Panel (Lead Info)**: Persistent view of the active lead's metadata, notes, and history.

## Lead Qualification
- Leads are automatically qualified based on configured AI rules (see `AdminAIConfig.jsx`).
- Statuses: `New`, `Qualified`, `Hot`, `Follow-up`, `Converted`, `Enrolled`.

## Design Constraints
To maintain a professional enterprise SaaS standard, the following are strictly prohibited:
- **No Charts**: Data must be presented in tables or KPI cards.
- **No Gradients**: Use solid hex colors according to the brand guide.
- **No Glassmorphism**: Clean borders and soft shadows only.
- **Limited Animation**: Framer Motion used only for micro-interactions (hover, toggle, slide).

## Operational Rules
- **SLA**: Messages must be responded to within the timeframe defined in `WorkingHours.jsx`.
- **Routing**: Leads are distributed to counselors based on round-robin or category rules defined by Admins.
- **Privacy**: Counselors cannot see leads assigned to other team members unless escalated.
