# Product Requirements Document: Work Tracker

## 1. Project Overview

### 1.1 Product Name
Work Tracker

### 1.2 Product Description
A fullstack web application that enables users to track their work hours, compare productivity with team members, and visualize their work patterns through an intuitive dashboard.

### 1.3 Target Audience
Teams and organizations that need to track work hours internally without public registration capabilities.

### 1.4 Project Goals
- Provide a simple, fast interface for logging work activities
- Enable team productivity comparison through leaderboards
- Deliver clear insights into individual work patterns
- Maintain security through controlled user access

---

## 2. Feature Requirements

| Feature ID | Feature Name | Description | Priority | Status |
|------------|--------------|-------------|----------|--------|
| F-001 | User Authentication | JWT-based login system with username/password | P0 | Pending |
| F-002 | Closed Registration | User creation only via direct database access | P0 | Pending |
| F-003 | Activity Creation | Add work activities with flexible time input methods | P0 | Pending |
| F-004 | Activity Management | Edit and delete activities within the same day | P0 | Pending |
| F-005 | Personal Dashboard | View today's hours, weekly hours, and week-over-week comparison | P0 | Pending |
| F-006 | Quick Add Access | Global quick-add functionality accessible from all screens | P1 | Pending |
| F-007 | Team Leaderboard | Weekly comparison of work hours across all users | P1 | Pending |
| F-008 | User History Viewing | View other users' activity history (read-only) | P2 | Pending |
| F-009 | Activity List View | Browse and filter personal activities | P1 | Pending |
| F-010 | Profile Management | View and update user profile information | P2 | Pending |

**Priority Legend:**
- P0: Critical (MVP)
- P1: High (Launch)
- P2: Medium (Post-launch)

---

## 3. Functional Requirements

### 3.1 Authentication & Authorization

#### F-001: User Authentication
**Description:** Secure login system using Lucia with stateless JWT tokens

**Requirements:**
- Login form with username and password fields
- Lucia authentication library integration with JWT session strategy
- Stateless JWT token generation upon successful authentication
- Token expiration handling with automatic logout
- Secure token storage in httpOnly cookies
- CSRF protection for authentication endpoints
- Session validation middleware for protected routes

**Acceptance Criteria:**
- User can log in with valid credentials
- Invalid credentials show appropriate error message
- JWT token is securely stored in httpOnly cookie
- User remains logged in after page refresh
- Expired tokens trigger re-authentication
- Lucia properly validates sessions on protected routes

#### F-002: Closed Registration
**Description:** Prevent public user registration

**Requirements:**
- No public registration endpoint or UI
- User creation only through direct database manipulation
- Admin script or SQL commands for user creation
- Password hashing for manually created users

**Acceptance Criteria:**
- No registration page exists in the application
- No public API endpoint for user creation
- Documentation provided for manual user creation process

### 3.2 Activity Management

#### F-003: Activity Creation
**Description:** Multiple methods for logging work activities

**Requirements:**
- **Input Method 1:** Start datetime + End datetime
- **Input Method 2:** Start datetime + Duration
- **Input Method 3:** Date + Duration (no specific time)
- Activity name/description field (required)
- Form validation for all input methods
- Automatic duration calculation for Method 1
- Prevent overlapping activities for the same user

**Data Model:**
```
Activity {
  id: UUID
  userId: string (foreign key to users.id)
  name: string
  startDateTime: timestamp (nullable for Method 3)
  endDateTime: timestamp (nullable)
  duration: integer (minutes)
  date: date
  createdAt: timestamp
  updatedAt: timestamp
}
```

**Acceptance Criteria:**
- User can successfully create activities using any of the three methods
- Duration is automatically calculated when start and end times are provided
- Form shows validation errors for invalid inputs
- Activities appear immediately in the user's history

#### F-004: Activity Management
**Description:** Edit and delete personal activities

**Requirements:**
- Edit functionality for activities created on the current day
- Delete functionality for activities created on the current day
- Confirmation dialog before deletion
- Update all relevant fields when editing
- Real-time dashboard updates after modifications

**Acceptance Criteria:**
- User can edit their activities from the current day
- User can delete their activities from the current day
- User cannot edit/delete activities from previous days
- Changes reflect immediately in dashboard and lists
- Deletion requires confirmation

#### F-006: Quick Add Access
**Description:** Global quick-add functionality

**Requirements:**
- Floating action button (FAB) or fixed header button visible on all pages
- Quick-add modal/drawer that opens from any screen
- Simplified form with default values
- Keyboard shortcut support (optional enhancement)

**Acceptance Criteria:**
- Add button is visible and accessible from all application screens
- Clicking the button opens the activity creation form
- Form can be submitted without navigating away from current page
- Success feedback is shown upon activity creation

### 3.3 Dashboard & Analytics

#### F-005: Personal Dashboard
**Description:** Overview of personal work hours

**Requirements:**
- **Today's Hours:** Total duration worked today
- **This Week's Hours:** Total duration worked in current week (Monday-Sunday)
- **Last Week's Hours:** Total duration worked in previous week
- **Week-over-week Comparison:** Percentage change and visual indicator
- Visual charts/graphs for data representation
- Real-time updates when activities are added/modified

**Acceptance Criteria:**
- Dashboard displays accurate calculations for all time periods
- Week starts on Monday
- Comparison shows positive/negative change with appropriate styling
- Data updates without page refresh when activities change

#### F-007: Team Leaderboard
**Description:** Weekly work hours ranking

**Requirements:**
- Display all users sorted by total hours worked this week
- Show user ranking, name, and total hours
- Highlight current user's position
- Auto-update weekly
- Optional: Avatar/profile picture support

**Acceptance Criteria:**
- Leaderboard shows all users in the system
- Users are correctly ranked by hours worked this week
- Current user's row is visually distinguished
- Leaderboard resets/recalculates at the start of each week

### 3.4 Social Features

#### F-008: User History Viewing
**Description:** View other users' activity logs

**Requirements:**
- Click on any user to view their activity history
- Display activities in chronological order
- Show same statistics as personal dashboard
- Read-only access (no edit/delete capabilities)
- Filter by date range (optional enhancement)

**Acceptance Criteria:**
- User can view any other user's activity history
- Other users' activities cannot be edited or deleted
- Activity details are displayed clearly
- Navigation back to personal view is intuitive

---

## 4. Technical Requirements

### 4.1 Technology Stack

| Category | Technology | Version | Justification |
|----------|-----------|---------|---------------|
| Frontend Framework | SvelteKit | Latest | Modern, performant, excellent DX |
| Backend | SvelteKit API Routes | Latest | Integrated fullstack solution |
| Database | PostgreSQL | 14+ | Reliable, robust relational database |
| ORM | Drizzle | Latest | Type-safe, lightweight ORM |
| Authentication | Lucia | Latest | Type-safe auth library with JWT support |
| Styling | TailwindCSS | Latest | Utility-first, rapid development |
| Language | JavaScript | ES2022+ | Project requirement |

### 4.2 Architecture Requirements

**Frontend:**
- Component-based architecture using Svelte components
- Responsive design (mobile-first approach)
- Client-side routing using SvelteKit's file-based routing
- State management using Svelte stores
- Form validation using native HTML5 + custom validators

**Backend:**
- RESTful API design using SvelteKit API routes
- Lucia authentication with JWT session strategy for protected routes
- Input validation and sanitization
- Error handling and logging
- Database connection pooling

**Database:**
- PostgreSQL database with proper indexing
- Foreign key constraints for data integrity
- Timestamps for all records (createdAt, updatedAt)
- Database migrations using Drizzle Kit

### 4.3 Security Requirements

| Requirement | Implementation |
|-------------|----------------|
| Password Storage | Lucia's built-in password hashing (Argon2 or Scrypt) |
| Session Security | Stateless JWT tokens in httpOnly cookies |
| SQL Injection Prevention | Parameterized queries via Drizzle ORM |
| XSS Protection | Input sanitization, output encoding |
| CSRF Protection | SvelteKit's built-in CSRF protection |
| Rate Limiting | Login attempt throttling |
| HTTPS | Enforce HTTPS in production |
| Session Validation | Lucia middleware on all protected routes |

### 4.4 Performance Requirements

- Initial page load: < 2 seconds on 3G connection
- API response time: < 200ms for 95th percentile
- Dashboard data updates: Real-time or < 1 second delay
- Support for at least 100 concurrent users
- Database query optimization with proper indexing

### 4.5 Browser Support

- Chrome/Edge (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- Mobile browsers (iOS Safari, Chrome Mobile)

### 4.6 Data Model

#### Users Table
```
users {
  id: string (primary key, generated by Lucia)
  username: string (unique, not null)
  passwordHash: string (not null)
  displayName: string (nullable)
  createdAt: timestamp
  updatedAt: timestamp
}
```

#### Sessions Table (for Lucia)
```
sessions {
  id: string (primary key)
  userId: string (foreign key -> users.id)
  expiresAt: timestamp (not null)
}
```

#### Activities Table
```
activities {
  id: UUID (primary key)
  userId: string (foreign key -> users.id)
  name: string (not null)
  startDateTime: timestamp (nullable)
  endDateTime: timestamp (nullable)
  duration: integer (minutes, not null)
  date: date (not null)
  createdAt: timestamp
  updatedAt: timestamp
}
```

**Indexes:**
- `users.username` (unique index)
- `sessions.userId` (index)
- `sessions.expiresAt` (index)
- `activities.userId` (index)
- `activities.date` (index)
- `activities.userId, activities.date` (composite index)

---

## 5. User Experience Requirements

### 5.1 UI/UX Principles

- **Simplicity:** Minimal clicks to accomplish primary tasks
- **Speed:** Quick add functionality accessible within 1 click from anywhere
- **Clarity:** Clear visual hierarchy and information architecture
- **Feedback:** Immediate visual feedback for all user actions
- **Consistency:** Unified design language across all screens
- **Accessibility:** WCAG 2.1 Level AA compliance (target)

### 5.2 Design Requirements

**Style Guidelines:**
- Modern, clean aesthetic
- Ample whitespace for readability
- Professional color palette with good contrast ratios
- Consistent typography scale
- Smooth transitions and animations (subtle)
- Mobile-responsive layouts

**Key Screens:**
1. Login Page
2. Dashboard (Home)
3. Activity List View
4. Activity Creation/Edit Modal
5. Leaderboard Page
6. User Profile View

### 5.3 Responsive Design

- **Mobile (< 768px):** Single column layout, hamburger menu
- **Tablet (768px - 1024px):** Adaptive layouts, collapsible sidebars
- **Desktop (> 1024px):** Full multi-column layouts, persistent navigation

---

## 6. Non-Functional Requirements

### 6.1 Scalability
- Database design supports 1000+ users
- Efficient queries for activity aggregation
- Pagination for activity lists

### 6.2 Reliability
- 99% uptime target
- Graceful error handling
- Data backup strategy

### 6.3 Maintainability
- Clear code documentation
- Consistent code style (ESLint + Prettier)
- Comprehensive error logging
- Git-based version control

### 6.4 Usability
- Intuitive navigation requiring no training
- Error messages that guide users to resolution
- Consistent interaction patterns

---

## 7. Constraints & Assumptions

### 7.1 Constraints
- No email integration (no password reset via email)
- User creation requires database access
- JavaScript-enabled browsers required
- Single timezone support (or per-user timezone)

### 7.2 Assumptions
- Users have reliable internet connectivity
- Admin has PostgreSQL database access for user management
- Users understand basic time tracking concepts
- Team size is manageable for a single leaderboard view

---

## 8. Future Enhancements (Out of Scope for MVP)

- Export functionality (CSV, PDF reports)
- Activity categories/tags
- Team/department grouping
- Advanced analytics and reporting
- Email notifications
- Mobile native applications
- Integration with calendar services
- Bulk activity import
- Custom time period comparisons
- Activity comments/notes
- Dark mode support

---

## 9. Success Metrics

| Metric | Target | Measurement Method |
|--------|--------|-------------------|
| User Adoption | 80% of team within 1 month | Active user count |
| Daily Active Users | 70% of total users | Login analytics |
| Average Session Duration | 2-5 minutes | Analytics tracking |
| Activity Entry Time | < 30 seconds | User testing |
| User Satisfaction | 4.0/5.0 | Feedback survey |
| System Uptime | 99% | Server monitoring |

---

## 10. Project Timeline (Estimated)

| Phase | Duration | Deliverables |
|-------|----------|--------------|
| Planning & Design | 1 week | PRD, UI mockups, DB schema |
| Development - Auth | 1 week | Lucia integration, login system |
| Development - Core | 2 weeks | Activity CRUD, Dashboard |
| Development - Social | 1 week | Leaderboard, user viewing |
| Testing & QA | 1 week | Bug fixes, performance optimization |
| Deployment | 3 days | Production setup, user creation |
| **Total** | **6-7 weeks** | Production-ready application |

---

## 11. Glossary

- **Activity:** A logged work session with a name and duration
- **Duration:** The length of time spent on an activity (in minutes)
- **Lucia:** Type-safe authentication library for handling sessions and JWT tokens
- **JWT:** JSON Web Token, used for stateless session management
- **Week:** Monday through Sunday period
- **Quick Add:** Fast access button for creating new activities

---

## Document Information

- **Version:** 1.0
- **Last Updated:** 2025-10-29
- **Status:** Draft
- **Owner:** Development Team
- **Approvers:** Product Owner, Tech Lead

