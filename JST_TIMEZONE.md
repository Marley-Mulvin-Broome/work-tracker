# Japanese Timezone (JST) Implementation

This document describes how the Work Tracker application handles dates and times using Japanese timezone (JST - UTC+9) as the source of truth.

## Overview

All date comparisons, "today" calculations, and week calculations now use Japanese Standard Time (Asia/Tokyo timezone). This ensures that activities are correctly associated with the right day based on JST, regardless of where the server is running or what timezone the user's browser is in.

## Key Changes

### Server-Side (`/lib/server/timezone.ts`)

Created comprehensive timezone utilities for server-side operations:

- **`nowInJST()`** - Get current date/time in JST
- **`todayInJST()`** - Get today's date at midnight in JST
- **`toJSTMidnight(date)`** - Convert any date to JST at midnight
- **`isSameDayJST(date1, date2)`** - Compare if two dates are the same day in JST
- **`isTodayJST(date)`** - Check if a date is today in JST
- **`getCurrentWeekRangeJST()`** - Get current week (Mon-Sun) in JST
- **`getTodayDateStringJST()`** - Get today as YYYY-MM-DD string in JST
- **`toDateStringJST(date)`** - Format date as YYYY-MM-DD in JST

### Client-Side (`/lib/utils/timezone.ts`)

Created client-side timezone utilities for browser operations:

- **`getTodayJST()`** - Get today's date as YYYY-MM-DD string in JST (for form inputs)
- **`isTodayJST(date)`** - Check if a date is today in JST (for UI logic)

### Updated Files

1. **`/lib/server/utils.ts`**
   - `getCurrentWeekRange()` now uses JST week calculations

2. **`/lib/server/services/activity.service.ts`**
   - `isActivityFromToday()` now uses JST comparison
   - Determines if activities can be edited (only today's activities)

3. **`/lib/server/services/stats.service.ts`**
   - `getUserStats()` uses JST for "today" and week calculations
   - `getWeeklyLeaderboard()` uses JST week range

4. **`/lib/utils/formatters.ts`**
   - `formatDate()` now formats dates in JST timezone

5. **`/routes/activities/+page.svelte`**
   - `canEdit()` function uses JST to determine edit permissions
   - Date input defaults to JST today

6. **`/lib/components/QuickAddButton.svelte`**
   - Date input defaults to JST today

## How It Works

### Server-Side Date Handling

When the server needs to determine "today":
```typescript
import { todayInJST, isTodayJST } from '$lib/server/timezone';

// Get today in JST
const today = todayInJST(); // Returns Date object at midnight JST

// Check if activity is from today
const canEdit = isTodayJST(activity.date); // Returns boolean
```

### Week Calculations

Week ranges (Monday-Sunday) are calculated in JST:
```typescript
import { getCurrentWeekRangeJST } from '$lib/server/timezone';

const { start, end } = getCurrentWeekRangeJST();
// Returns start (Monday 00:00:00 JST) and end (Sunday 23:59:59 JST)
```

### Client-Side Forms

Date inputs default to JST "today":
```svelte
<script>
import { getTodayJST } from '$lib/utils/timezone';
</script>

<input type="date" value={getTodayJST()} />
<!-- Defaults to today's date in JST -->
```

### UI Logic

Check if a date is today for UI decisions:
```svelte
<script>
import { isTodayJST } from '$lib/utils/timezone';

function canEdit(date: Date): boolean {
  return isTodayJST(date); // Only today's activities (in JST) can be edited
}
</script>
```

## Example Scenarios

### Scenario 1: User in California logs activity at 11 PM PST
- PST: 11:00 PM Dec 25
- JST: 4:00 PM Dec 26 (next day)
- **Activity is recorded as Dec 26** (JST date)

### Scenario 2: Checking if activity can be edited
```typescript
// Server running in UTC, current time: Dec 25 4:00 PM UTC
// JST: Dec 26 1:00 AM
// Activity date: Dec 25

isActivityFromToday(activityDate); // false
// Activity is from Dec 25, but "today" in JST is Dec 26
// Therefore, activity cannot be edited
```

### Scenario 3: Week statistics
```typescript
// Current JST: Tuesday, Jan 2, 2024
// Week range: Monday Jan 1 00:00 JST - Sunday Jan 7 23:59 JST
const { start, end } = getCurrentWeekRangeJST();
// All activities between these dates count toward "this week"
```

## Benefits

1. **Consistency**: All users see the same "today" regardless of their location
2. **Predictability**: Week boundaries are consistent for all users
3. **Simplicity**: Business rules (e.g., "only edit today's activities") work reliably
4. **Accuracy**: Activity dates match the actual day in Japan, not the server's timezone

## Migration Notes

- Existing activities in the database are not modified
- Date comparisons now account for JST timezone
- All new activities will be correctly associated with JST dates
- Users will see dates formatted in JST context
