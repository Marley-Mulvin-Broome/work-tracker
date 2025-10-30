# Code Audit Report - Work Tracker

**Generated:** 2025-10-30  
**Project:** Work Tracker (SvelteKit + PostgreSQL)

This audit identifies code quality issues, security concerns, inefficiencies, and bad practices. Each issue is categorized with an acronym for easy tracking.

---

## Issue Categories

- **DUP** - Code Duplication ✅ **(All 6 issues FIXED)**
- **SEC** - Security Issue
- **PERF** - Performance Issue
- **BP** - Bad Practice ✅ **(All 6 issues FIXED)**
- **A11Y** - Accessibility Issue
- **TYPE** - Type Safety Issue
- **MAINT** - Maintainability Issue

---

## 🔴 Critical Issues

### SEC-001: Hardcoded Database Credentials in Repository
**Category:** SEC  
**Severity:** Critical  
**Files:**
- `compose.yaml` (line 9)
- `package.json` (line 20)
- `.env.example`

**Issue:**
Database credentials (`mysecretpassword`) are hardcoded in version-controlled files. This is a major security risk.

**Fix:**
1. Use environment variables for all credentials
2. Update `compose.yaml` to reference env vars:
   ```yaml
   environment:
     POSTGRES_PASSWORD: ${POSTGRES_PASSWORD:-changeme}
   ```
3. Remove hardcoded password from `package.json` script
4. Add `.env` to `.gitignore`
5. Update documentation to require setting passwords

---

### SEC-002: Missing httpOnly and Secure Flags on Session Cookie
**Category:** SEC  
**Severity:** Critical  
**File:** `src/lib/server/auth.ts` (lines 69-72)

**Issue:**
Session cookie is missing `httpOnly` and `secure` flags, making it vulnerable to XSS attacks.

**Current Code:**
```typescript
event.cookies.set(sessionCookieName, token, {
  expires: expiresAt,
  path: '/'
});
```

**Fix:**
```typescript
event.cookies.set(sessionCookieName, token, {
  expires: expiresAt,
  path: '/',
  httpOnly: true,
  secure: import.meta.env.PROD,
  sameSite: 'lax'
});
```

---

### SEC-003: Missing Rate Limiting on Login
**Category:** SEC  
**Severity:** High  
**File:** `src/routes/login/+page.server.ts`

**Issue:**
No rate limiting on login attempts enables brute force attacks.

**Fix:**
Implement rate limiting using a library like `@vercel/edge-rate-limit` or simple in-memory tracking with session cleanup.

---

### SEC-004: Password Shown in Command Line History
**Category:** SEC  
**Severity:** Medium  
**File:** `scripts/create-user.ts`

**Issue:**
Password is passed as command-line argument, which gets stored in shell history.

**Fix:**
Use interactive prompts for password input:
```typescript
import * as readline from 'readline/promises';
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const password = await rl.question('Password: ', { hideEchoBack: true });
```


---

## ⚡ Performance Issues

### PERF-001: Missing Database Query Limit
**Category:** PERF  
**Severity:** Medium  
**Files:**
- `src/routes/+page.server.ts` (lines 47-52)
- `src/routes/users/[id]/+page.server.ts` (lines 71-76)
- `src/routes/activities/+page.server.ts` (lines 11-15)

**Issue:**
Database queries fetch all activities without limit, could cause performance issues with large datasets.

**Fix:**
Add `.limit()` clause:
```typescript
const activities = await db
  .select()
  .from(table.activity)
  .where(eq(table.activity.userId, user.id))
  .orderBy(desc(table.activity.date), desc(table.activity.createdAt))
  .limit(100); // Add reasonable limit
```

Consider implementing pagination.

---

### PERF-002: Inefficient Session Renewal Logic
**Category:** PERF  
**Severity:** Low  
**File:** `src/lib/server/auth.ts` (lines 52-58)

**Issue:**
Session renewal happens on every request when within 15 days of expiry, causing unnecessary database writes.

**Fix:**
Consider adding a threshold check to prevent too-frequent updates:
```typescript
const lastUpdated = session.updatedAt || session.expiresAt;
const shouldRenew = renewSession && (Date.now() - lastUpdated.getTime() > RENEWAL_THROTTLE);
```

---

### PERF-003: N+1 Query Pattern Potential
**Category:** PERF  
**Severity:** Medium  
**File:** `src/routes/leaderboard/+page.server.ts` (lines 23-33)

**Issue:**
While using a JOIN, the query could be optimized further with proper indexing documentation.

**Fix:**
Ensure composite indexes exist and document query performance expectations in comments.

---

## ♿ Accessibility Issues

### A11Y-001: Missing Form Error Announcements
**Category:** A11Y  
**Severity:** Medium  
**Files:**
- `src/routes/login/+page.svelte` (lines 38-40)
- `src/routes/activities/+page.svelte` (lines 263-267)

**Issue:**
Error messages displayed visually but not announced to screen readers.

**Fix:**
Add `role="alert"` and `aria-live="polite"`:
```svelte
{#if form?.message}
  <div role="alert" aria-live="polite" class="text-red-600 text-sm text-center">
    {form.message}
  </div>
{/if}
```

---

### A11Y-002: Missing Table Caption
**Category:** A11Y  
**Severity:** Low  
**Files:**
- `src/routes/activities/+page.svelte` (line 138)
- `src/routes/+page.svelte` (line 202)
- `src/routes/users/[id]/+page.svelte` (line 218)

**Issue:**
Data tables lack `<caption>` elements for screen reader context.

**Fix:**
Add captions:
```svelte
<table class="min-w-full divide-y divide-gray-200">
  <caption class="sr-only">List of activities</caption>
  <!-- ... -->
</table>
```

---

### A11Y-003: Insufficient Color Contrast for Links
**Category:** A11Y  
**Severity:** Low  
**File:** `src/routes/+layout.svelte` (lines 35-56)

**Issue:**
Navigation links may not meet WCAG AA contrast requirements on hover states.

**Fix:**
Test contrast ratios and adjust colors as needed. Use tools like WebAIM Contrast Checker.

---

## 🔧 Maintainability Issues

### MAINT-001: Inconsistent Date Handling
**Category:** MAINT  
**Severity:** Medium  
**Files:** Multiple

**Issue:**
Mix of `Date` objects, date strings, and manual parsing throughout the codebase.

**Fix:**
Standardize on a date handling approach:
- Use `date-fns` or similar library
- Create wrapper functions for common operations
- Document expected formats

---

### MAINT-002: Missing Input Validation Abstraction
**Category:** MAINT  
**Severity:** Medium  
**File:** `src/routes/login/+page.server.ts` (lines 56-65)

**Issue:**
Validation logic inline in actions rather than reusable validators.

**Fix:**
Create validation schema using Zod or similar:
```typescript
import { z } from 'zod';

const loginSchema = z.object({
  username: z.string().min(3).max(31).regex(/^[a-zA-Z0-9_]+$/),
  password: z.string().min(6).max(255)
});
```

---

### MAINT-003: No TypeScript Strict Mode
**Category:** TYPE  
**Severity:** Medium  
**File:** `tsconfig.json`

**Issue:**
TypeScript configuration may not have strict mode enabled.

**Fix:**
Verify `tsconfig.json` has:
```json
{
  "compilerOptions": {
    "strict": true
  }
}
```

---

### MAINT-004: Missing JSDoc Comments
**Category:** MAINT  
**Severity:** Low  
**Files:** All `.ts` and `.svelte` files

**Issue:**
Functions lack documentation comments.

**Fix:**
Add JSDoc comments to all exported functions:
```typescript
/**
 * Formats hours into human-readable string (e.g., "2h 30m")
 * @param hours - Number of hours (decimal)
 * @returns Formatted string
 */
export function formatHours(hours: number): string {
  // ...
}
```

---

### MAINT-005: Inconsistent Error Messages
**Category:** MAINT  
**Severity:** Low  
**Files:** Multiple server files

**Issue:**
Error messages inconsistently capitalized and formatted.

**Fix:**
Standardize error message format:
- Capitalize first letter
- End with period
- Use consistent terminology

---

## 📊 Summary

| Category | Count | Critical | High | Medium | Low |
|----------|-------|----------|------|--------|-----|
| SEC      | 4     | 2        | 1    | 1      | 0   |
| DUP      | 0     | 0        | 0    | 0      | 0   |
| BP       | 0     | 0        | 0    | 0      | 0   |
| PERF     | 3     | 0        | 0    | 2      | 1   |
| A11Y     | 3     | 0        | 0    | 1      | 2   |
| MAINT    | 5     | 0        | 0    | 3      | 2   |
| **TOTAL**| **15**| **2**    | **1**| **4** | **7** |

---

## Priority Order

1. **SEC-001** - Critical security issue (session fixation)
2. **PERF-001, PERF-002** - Performance bottlenecks affecting UX
3. **A11Y-001, A11Y-002, A11Y-003** - Accessibility improvements
4. **MAINT-001, MAINT-002, MAINT-003** - Long-term maintainability

---

## 📝 Notes

- **Testing**: No test files found. Consider adding unit and integration tests.
- **Logging**: Limited structured logging. Consider adding a logging framework.
- **Monitoring**: No observability setup detected. Consider adding error tracking (e.g., Sentry).
- **Documentation**: API documentation is minimal. Consider adding OpenAPI specs or similar.
- **Git Hygiene**: Ensure `.env` is in `.gitignore` and never committed.

---

*End of Audit Report*
