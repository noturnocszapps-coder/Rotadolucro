# Roxou Transporte - System Architecture

## 1. Overview
Roxou Transporte is a connection layer between passengers and drivers for events. It is NOT a ride-hailing app.

## 2. Technical Implementation Plan

### Root Structure (Monorepo Ready)
```text
/src
  /app                # Next.js 15 App Router
    /(auth)           # Login, Register
    /(passenger)      # Dashboard, Request Creation
    /(driver)         # Availability, Match List
    /(admin)          # Approval Queue, Moderation
    /api              # Webhooks & External Bridges
  /components
    /chat             # Real-time communication
    /legal            # Mandatory Disclaimers
    /ui               # Shared Design System
  /actions            # Server Actions (Mutations)
  /services           # Business Logic & External APIs
  /lib                # Initializations (Supabase, etc.)
  /hooks              # Custom React Hooks
  /validators         # Zod Schemas
  /constants          # Enums & Route Paths
```

### 3. Database Schema (PostgreSQL)
- **Profiles:** `id, role, full_name, phone, accepted_terms_version`
- **Drivers:** `id, status (pending/approved), driverdash_id, is_active`
- **Transport Requests:** `id, passenger_id, event_id, status, description`
- **Connections:** `id, request_id, passenger_id, driver_id`
- **Messages:** `id, connection_id, sender_id, content`

### 4. Implementation Priorities
1. **Legal Guard:** Force disclaimer acceptance before any action.
2. **RBAC Middleware:** Secure routes based on user role.
3. **DriverDash Bridge:** Isolated service for driver verification.
4. **Real-time Chat:** Supabase Realtime integration.
