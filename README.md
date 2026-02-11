# 🧩 JobBridge – Web Platform Connecting SMEs with Young Freelancers

## Overview
JobBridge is a web-based platform that connects young freelancers with small and medium-sized enterprises (SMEs) that need specialized, short-term services such as graphic design, software development, translation, and digital marketing. The project is designed as an academic implementation with a strong emphasis on a clear user experience, structured data modeling, and role-based workflows.

Its overarching purpose is to reduce youth unemployment and simplify flexible hiring by providing an accessible digital environment where SMEs can find, evaluate, and contract services, while freelancers can publish offerings and manage their work.

---

## Project Goals
JobBridge aims to deliver:

- A role-based web application with two user types: **Freelancer** and **Client (SME)**.
- A structured flow for service discovery and contracting (payments are simulated).
- A relational database design that supports traceability, pricing snapshots, and contract lifecycle management.
- A clean, consistent UI design system implemented with a single global stylesheet.

---

## Users and Role-Based Workflows

### Freelancer
Freelancers use JobBridge to:
- Create and publish service offerings.
- Manage requests and active work.
- Track contracted services and work status.
- Receive ratings and reviews after completion.

### Client (SME)
SMEs use JobBridge to:
- Browse and search the service catalog.
- View service details and freelancer information.
- Contract services and manage their contracts.
- Rate and review services after delivery.

---

## Current System Structure

### Public Pages (no sidebar)
Public pages share the `public` body class and do not display authenticated navigation.

- `index.html` (splash screen that redirects to login)
- `login.html`
- `register.html`
- `passwordRecovery.html`

### Internal Pages (with sidebar)
Internal pages use the app shell layout with a collapsible sidebar. Role-specific styling is applied via body classes.

- `dashboardPYME.html` (SME dashboard, planned/placeholder depending on stage)
- `dashboardFreelancer.html` (Freelancer dashboard, planned/placeholder depending on stage)
- `exploreServices.html` (service catalog, SME flow)
- `serviceDetail.html` (service detail view, SME flow)
- Other planned internal pages: `myContracts.html`, `ratings.html`, `profile.html`, etc.

---

## UI Design System

JobBridge uses a single global stylesheet: `main.css`.

### Theme by Role
The UI theme is driven by CSS variables. Role classes determine the primary and accent colors:

- `body.role-client` (SME): primary orange, accent blue  
- `body.role-freelancer` (Freelancer): primary blue, accent orange  
- `body.public` (Public): balanced mix  

Core color variables used across the system:
- `--primary` (role primary)
- `--primary-2` (role accent)

### Layout Components Implemented
- Collapsible sidebar
- Sticky topbar
- Cards and panels
- Forms and inputs
- Buttons (primary, secondary, ghost)
- Service catalog grid and service cards
- Splash screen with large logo
- Auth layout centered with background image support

### Auth Background
Login, register, and password recovery support a shared background image:
- `imagenfondo1.png` (applied via a CSS class on the auth shell)

---

## Core Features in Scope

### Authentication (UI-first, academic scope)
- Registration with role selection (Freelancer or SME)
- Login and password recovery pages
- Role-based navigation concept (logic to be implemented later)

### Service Discovery (SME flow)
- Service catalog (`exploreServices.html`)
- Filters and search layout (UI structure)
- Service detail page (`serviceDetail.html`)
- Related services section (UI structure)

### Contracting and Tracking (planned next)
- Contract creation flow (conceptual / UI-first)
- Contract states and lifecycle tracking
- Contract history for SMEs and freelancers

### Ratings and Reviews (planned next)
- Ratings tied to completed contracts
- Reviews visible on services and freelancer profiles

---

## Database Architecture

JobBridge is supported by a relational database model. The main entities include:

- Company
- User
- Client
- Freelancer
- Area
- Service
- Freelancer_Service
- Service_Pricing
- Contracted_Service
- Rating

Key design principles:
- Referential integrity with well-defined foreign keys
- State control for service/contract lifecycle
- Price snapshot preserved at time of contracting
- Clear separation between authentication data and profile data

---

## Project Management Approach (PMBOK®-Aligned)
This academic project follows a structured project management approach aligned with PMI’s PMBOK® framework, emphasizing:

- Clear scope definition
- Planned deliverables and staged implementation
- Risk-aware decisions (e.g., simulated payments, UI-first development)
- Quality and consistency standards (single CSS, shared layouts, reusable components)

---

## Technology Stack (Current Academic Implementation)
- **Frontend:** HTML + CSS (single global stylesheet)
- **Database:** SQL Server (T-SQL) and normalized relational model
- **Platform:** Web application (academic scope, modular expansion planned)

---

## Academic Scope Notes
This is an academic implementation, therefore:
- Payments are simulated (no real transactions).
- Security measures are addressed conceptually (e.g., password hashing, role access control) and are not fully implemented at this stage.
- The current development approach prioritizes UI structure and database correctness before business logic.

---

## Roadmap (Next Planned Work)
- SME contracts list (`myContracts.html`)
- Freelancer dashboard and service management pages
- Contracting UI flow (request, acceptance, status updates)
- Ratings and reviews pages
- Integration of backend logic once UI and database are stable

---

## Author
Academic project developed as part of a university course in Engineering / Information Systems.
