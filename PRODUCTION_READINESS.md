# Roxou Transporte - Production Readiness & Deployment Blueprint

This document outlines the critical steps and checklists required to move Roxou Transporte from MVP development to a secure, reliable Beta launch on Vercel and Supabase.

---

## 1. Production Readiness Checklist
- [ ] **Custom Domain:** Configure `roxou.com.br` (or similar) in Vercel.
- [ ] **SSL/HTTPS:** Ensure all traffic is forced to HTTPS (Vercel default).
- [ ] **Error Boundaries:** Implement global and route-specific error boundaries.
- [ ] **Loading States:** Verify all async operations have skeleton or spinner feedback.
- [ ] **Empty States:** Add "No requests found", "No messages yet" illustrations/text.
- [ ] **Favicon & Metadata:** Update `metadata.json` and add production icons.
- [ ] **Legal Pages:** Finalize Terms of Service and Privacy Policy content.

## 2. Vercel Deployment Checklist
- [ ] **Environment Variables:** Sync all `.env.example` variables to Vercel Project Settings.
- [ ] **Framework Version:** Ensure Next.js 15+ and Node.js 20.x are selected.
- [ ] **Build Command:** `npm run build` verification.
- [ ] **Deployment Protection:** Enable Vercel Authentication for the Preview/Beta branch.
- [ ] **Log Drain:** (Optional) Connect Axiom or BetterStack for production log persistence.

## 3. Supabase Production Checklist
- [ ] **RLS (Row Level Security):** **CRITICAL**. Enable RLS on ALL tables.
  - `profiles`: Users read own, Admins read all.
  - `drivers`: Public read (basic), Owner/Admin write.
  - `transport_requests`: Owner read/write, Drivers read (if open).
  - `connections`: Involved parties only.
  - `messages`: Involved parties only.
  - `reports`: Reporter write, Admin read/write.
- [ ] **Database Backups:** Enable daily backups (Supabase Pro recommended for Beta).
- [ ] **PITR:** Enable Point-in-Time Recovery if data criticality is high.
- [ ] **Connection Pooling:** Use Transaction mode for Serverless functions.
- [ ] **Email Provider:** Switch from Supabase default to a custom SMTP (SendGrid/Resend) to avoid rate limits.

## 4. Environment Variables Checklist
| Variable | Description | Required for |
|----------|-------------|--------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase API URL | Client/Server |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase Anon Key | Client/Server |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase Admin Key | Server Actions (Admin only) |
| `NEXT_PUBLIC_GEMINI_API_KEY` | AI Studio Key | AI Features |
| `APP_URL` | Production URL | OAuth/Redirects |

## 5. Admin Bootstrap Checklist
- [ ] **First Admin:** Manually set the `role` to `'admin'` in the `profiles` table for the primary stakeholder email.
- [ ] **Admin Dashboard Protection:** Verify `middleware.ts` correctly blocks non-admins.
- [ ] **Audit Logs:** Ensure `moderation_logs` are capturing all admin actions.

## 6. Storage & Document Security Checklist
- [ ] **Bucket Creation:** Create `driver-documents` bucket.
- [ ] **Privacy:** Set bucket to **Private**.
- [ ] **RLS Policies:**
  - `SELECT`: Only the owner and Admins.
  - `INSERT`: Only the owner (authenticated).
  - `DELETE`: Only the owner.
- [ ] **File Limits:** Enforce 5MB max size and PDF/Image mime-types in the frontend.

## 7. Realtime/Chat Reliability Checklist
- [ ] **Presence:** Implement "Online" status for drivers (Future).
- [ ] **Reconnection:** Ensure `onSnapshot` / `channel.subscribe` handles network drops gracefully.
- [ ] **Message History:** Verify pagination or "Load More" for long conversations.

## 8. Critical UX States (Pre-Beta)
- [ ] **Blocked User State:** UI for users who are suspended/blocked by moderation.
- [ ] **Offline State:** Detection and "You are offline" banner.
- [ ] **Onboarding Progress:** Clearer "Waiting for Approval" screen for drivers.

## 9. Minimum QA Flow
### Passenger
1. Sign up -> Accept Terms -> Create Request -> See Request in List -> Chat with Driver.
### Driver
1. Sign up -> Onboarding (Upload Docs) -> Wait for Admin -> View Leads -> Connect -> Chat.
### Admin
1. Login -> Review Driver -> Approve -> View Reports -> Resolve Report.

## 10. Launch Blockers vs. Nice-to-Have
### 🛑 Blockers
- Missing RLS Policies (Security Risk).
- Broken Document Upload (Onboarding Blocked).
- Incomplete Legal Terms (Legal Risk).
- No Admin Bootstrap (Management Blocked).

### ✨ Nice-to-Have
- Push Notifications (Browser).
- Driver Rating System.
- Advanced Search Filters.
- Dark Mode.
