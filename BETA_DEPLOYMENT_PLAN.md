# Roxou Transporte - Private Beta Deployment Plan

This document provides the exact step-by-step sequence for deploying Roxou Transporte to production for a Private Beta launch.

---

## 1. Final Pre-Deploy Checklist
- [ ] **Code Freeze:** No new features merged. Only critical bug fixes.
- [ ] **Build Verification:** Run `npm run build` locally or in CI to ensure zero compilation errors.
- [ ] **Linting:** Run `npm run lint` to ensure code quality and no missing imports.
- [ ] **Secrets Audit:** Ensure no hardcoded keys exist in the codebase.
- [ ] **Legal Assets:** Verify `Terms of Service` and `Privacy Policy` URLs are ready.

## 2. Supabase Verification Sequence (Infrastructure First)
1. **Create Production Project:** Initialize a new project in Supabase.
2. **Schema Migration:** Run the SQL schema (from `supabase/migrations` or your initial setup) to create tables.
3. **Enable RLS:** Go to **Authentication -> Policies** and ensure RLS is enabled for all tables.
4. **Storage Setup:**
   - Create `driver-documents` bucket.
   - Set to **Private**.
   - Apply RLS: `Authenticated` users can upload; `Admins` and `Owners` can read.
5. **Auth Configuration:**
   - Enable **Google Auth**.
   - Add Vercel production URL to **Redirect URLs**.
   - Disable **Email Confirmations** (optional for private beta speed, but recommended for production).

## 3. Environment Variable Verification Order
Set these in Vercel **before** the first deployment:
1. `NEXT_PUBLIC_SUPABASE_URL`: From Supabase Settings -> API.
2. `NEXT_PUBLIC_SUPABASE_ANON_KEY`: From Supabase Settings -> API.
3. `SUPABASE_SERVICE_ROLE_KEY`: From Supabase Settings -> API (Keep Secret).
4. `NEXT_PUBLIC_GEMINI_API_KEY`: Your Google AI Studio key.
5. `ADMIN_BOOTSTRAP_SECRET`: A long, random string (e.g., `openssl rand -base64 32`).
6. `APP_URL`: Your final production domain (e.g., `https://roxou.vercel.app`).

## 4. Vercel Deployment Sequence
1. **Connect Repository:** Link your GitHub repo to Vercel.
2. **Configure Build:**
   - Framework: **Next.js**.
   - Build Command: `npm run build`.
   - Output Directory: `.next`.
3. **Deploy:** Trigger the first production build.
4. **Verify Logs:** Check Vercel deployment logs for any runtime errors during build/optimization.

## 5. First Admin Bootstrap Sequence
1. **Sign Up:** Access the production URL and sign up with your primary admin email.
2. **Bootstrap Call:** Use `curl` or Postman to promote your user:
   ```bash
   curl -X POST https://your-app.vercel.app/api/admin/bootstrap \
     -H "Content-Type: application/json" \
     -d '{
       "secret": "YOUR_ADMIN_BOOTSTRAP_SECRET",
       "email": "your-email@example.com"
     }'
   ```
3. **Verify:** Log in again and try to access `/admin/dashboard`.

## 6. RLS & Security Verification
- [ ] **Unauthenticated Access:** Try accessing `/dashboard` without logging in (should redirect to `/login`).
- [ ] **Cross-User Access:** Log in as User A. Try to fetch a transport request belonging to User B via API or console (should return empty/error).
- [ ] **Admin Isolation:** Log in as a Passenger. Try to access `/admin/dashboard` (should redirect to `/`).
- [ ] **Document Privacy:** Try to access a driver's document URL from an unauthenticated browser (should return 403).

## 7. End-to-End QA Flow (The "Golden Path")
### Passenger Flow
- [ ] Create a transport request for a specific event.
- [ ] View the request in "Meus Pedidos".
- [ ] Receive a connection from a driver.
- [ ] Open chat and send a message.
- [ ] Report the driver (test safety loop).

### Driver Flow
- [ ] Complete onboarding (upload dummy documents).
- [ ] Admin approves the driver.
- [ ] Set status to "Online".
- [ ] View "Leads Disponíveis".
- [ ] Connect with a passenger.
- [ ] Chat with the passenger.

### Admin Flow
- [ ] View pending driver applications.
- [ ] Review documents and approve.
- [ ] View safety reports.
- [ ] Resolve a report and warn/block a user.

## 8. Immediate Post-Launch Monitoring
- [ ] **Vercel Analytics:** Monitor for 404s or 500s.
- [ ] **Supabase Logs:** Check for RLS violations (indicates bug or attack).
- [ ] **User Feedback:** Set up a simple WhatsApp or Telegram group for beta testers.

## 9. Rollback Checklist
- [ ] **Vercel:** Use "Instant Rollback" to the previous successful deployment if `/` returns 500.
- [ ] **Database:** If schema migration fails, restore the last backup (Supabase Snapshot).

## 10. Launch Blockers (STOP if unresolved)
- [ ] RLS is disabled on any table.
- [ ] `driver-documents` bucket is public.
- [ ] Admin dashboard is accessible by non-admins.
- [ ] Chat messages are visible to non-participants.
- [ ] Terms of Service acceptance is not enforced.
