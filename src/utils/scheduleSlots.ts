/**
 * Utilities for Appointment Schedule parsing and 2-day booking date window enforcement.
 */

export interface BookingDateOption {
  dateStr: string; // YYYY-MM-DD
  label: string;   // "Today", "Tomorrow", "Day After"
  dayName: string; // "Mon", "Tue", etc.
  displayDate: string; // "17 Nov"
  dayOfWeek: number; // 0 (Sun) - 6 (Sat)
  isDoctorAvailable: boolean;
}

export interface TimeSlotOption {
  value: string;
  label: string;
  sessionLabel: string;
  startMinutes: number;
  endMinutes: number;
}

const DAY_NAME_MAP: Record<string, number> = {
  sun: 0, sunday: 0,
  mon: 1, monday: 1,
  tue: 2, tues: 2, tuesday: 2,
  wed: 3, wednesday: 3,
  thu: 4, thur: 4, thurs: 4, thursday: 4,
  fri: 5, friday: 5,
  sat: 6, saturday: 6,
};

export function formatLocalDateISO(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getBookingDateBounds(baseDate: Date = new Date()): {
  minDate: string;
  maxDate: string;
  allowedDates: string[];
} {
  const today = new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate());
  const day1 = new Date(today);
  day1.setDate(today.getDate() + 1);
  const day2 = new Date(today);
  day2.setDate(today.getDate() + 2);

  const minDate = formatLocalDateISO(today);
  const maxDate = formatLocalDateISO(day2);

  return {
    minDate,
    maxDate,
    allowedDates: [minDate, formatLocalDateISO(day1), maxDate],
  };
}

export function isDateWithinAllowedWindow(dateStr: string, baseDate: Date = new Date()): boolean {
  if (!dateStr) return false;
  const { minDate, maxDate } = getBookingDateBounds(baseDate);
  return dateStr >= minDate && dateStr <= maxDate;
}

export function getDayOfWeekFromISO(dateStr: string): number {
  const parts = dateStr.split('-').map(Number);
  if (parts.length !== 3 || parts.some(isNaN)) return new Date().getDay();
  return new Date(parts[0], parts[1] - 1, parts[2]).getDay();
}

/**
 * Parses the days of week from a doctor's opdSchedule string, e.g.
 * "Mon - Sat: 10:00 AM - 02:00 PM, 05:00 PM - 08:00 PM"
 */
export function parseScheduleDays(opdSchedule: string): Set<number> {
  const lower = (opdSchedule || '').toLowerCase();
  const daySection = lower.includes(':') ? lower.split(':')[0] : lower;

  if (
    daySection.includes('daily') ||
    daySection.includes('all day') ||
    daySection.includes('every day') ||
    daySection.includes('24x7')
  ) {
    return new Set([0, 1, 2, 3, 4, 5, 6]);
  }

  // Check for range like "mon - sat" or "mon to fri"
  const rangeMatch = daySection.match(
    /\b(sun|sunday|mon|monday|tue|tues|tuesday|wed|wednesday|thu|thur|thurs|thursday|fri|friday|sat|saturday)\s*(?:-|to|–)\s*(sun|sunday|mon|monday|tue|tues|tuesday|wed|wednesday|thu|thur|thurs|thursday|fri|friday|sat|saturday)\b/i
  );

  const days = new Set<number>();
  if (rangeMatch) {
    const startDay = DAY_NAME_MAP[rangeMatch[1].toLowerCase()];
    const endDay = DAY_NAME_MAP[rangeMatch[2].toLowerCase()];
    if (startDay !== undefined && endDay !== undefined) {
      let cur = startDay;
      for (let i = 0; i < 7; i++) {
        days.add(cur);
        if (cur === endDay) break;
        cur = (cur + 1) % 7;
      }
    }
  }

  // Also check any individually listed days (e.g., "Mon, Wed, Fri" or "+ Sun")
  const tokens = daySection.match(/\b(sun|sunday|mon|monday|tue|tues|tuesday|wed|wednesday|thu|thur|thurs|thursday|fri|friday|sat|saturday)\b/gi);
  if (tokens && !rangeMatch) {
    for (const tok of tokens) {
      const idx = DAY_NAME_MAP[tok.toLowerCase()];
      if (idx !== undefined) days.add(idx);
    }
  }

  // Fallback to Mon - Sat if no day pattern detected
  if (days.size === 0) {
    return new Set([1, 2, 3, 4, 5, 6]);
  }

  return days;
}

export function isDoctorAvailableOnDate(opdSchedule: string, dateStr: string): boolean {
  const allowedDays = parseScheduleDays(opdSchedule);
  const dow = getDayOfWeekFromISO(dateStr);
  return allowedDays.has(dow);
}

function parseTimeToMinutes(timeStr: string): number | null {
  const match = timeStr.trim().match(/^(\d{1,2})(?::(\d{2}))?\s*(AM|PM)$/i);
  if (!match) return null;
  let hours = parseInt(match[1], 10);
  const minutes = match[2] ? parseInt(match[2], 10) : 0;
  const period = match[3].toUpperCase();

  if (period === 'PM' && hours !== 12) hours += 12;
  if (period === 'AM' && hours === 12) hours = 0;

  return hours * 60 + minutes;
}

function formatMinutesToTime(totalMinutes: number): string {
  const normalized = ((totalMinutes % 1440) + 1440) % 1440;
  const hours24 = Math.floor(normalized / 60);
  const mins = normalized % 60;
  const period = hours24 >= 12 ? 'PM' : 'AM';
  let hours12 = hours24 % 12;
  if (hours12 === 0) hours12 = 12;
  return `${String(hours12).padStart(2, '0')}:${String(mins).padStart(2, '0')} ${period}`;
}

/**
 * Generates bookable appointment slots strictly from the doctor's opdSchedule string
 * and filters out past slots when booking for today.
 */
export function generateSlotsFromSchedule(
  opdSchedule: string,
  selectedDateStr: string,
  now: Date = new Date()
): TimeSlotOption[] {
  if (!isDoctorAvailableOnDate(opdSchedule, selectedDateStr)) {
    return [];
  }

  const timeRangeRegex = /(\d{1,2}(?::\d{2})?\s*(?:AM|PM))\s*(?:-|to|–)\s*(\d{1,2}(?::\d{2})?\s*(?:AM|PM))/gi;
  const sessions: Array<{ start: number; end: number }> = [];
  let match: RegExpExecArray | null;

  while ((match = timeRangeRegex.exec(opdSchedule || '')) !== null) {
    const start = parseTimeToMinutes(match[1]);
    const end = parseTimeToMinutes(match[2]);
    if (start !== null && end !== null && end > start) {
      sessions.push({ start, end });
    }
  }

  // Fallback if schedule string doesn't contain parseable time ranges
  if (sessions.length === 0) {
    sessions.push({ start: 10 * 60, end: 14 * 60 });
  }

  const slots: TimeSlotOption[] = [];
  const todayStr = formatLocalDateISO(now);
  const isToday = selectedDateStr === todayStr;
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  for (const session of sessions) {
    const sessionLabel = session.start < 12 * 60 ? 'Morning OPD' : session.start < 16 * 60 ? 'Afternoon OPD' : 'Evening OPD';
    let cursor = session.start;

    while (cursor < session.end) {
      const next = Math.min(cursor + 60, session.end);
      // Avoid tiny leftover slivers < 20 mins unless it's the only slot
      if (next - cursor >= 20) {
        const startLabel = formatMinutesToTime(cursor);
        const endLabel = formatMinutesToTime(next);
        const slotText = `${startLabel} - ${endLabel}`;

        // When booking for today, require at least 15 minutes before the slot ends (and slot hasn't already ended)
        const isStillBookableToday = !isToday || next - 15 > currentMinutes;

        if (isStillBookableToday) {
          slots.push({
            value: slotText,
            label: slotText,
            sessionLabel,
            startMinutes: cursor,
            endMinutes: next,
          });
        }
      }
      cursor = next;
    }
  }

  return slots;
}

export function getAllowedBookingDateOptions(
  opdSchedule: string,
  now: Date = new Date()
): BookingDateOption[] {
  const { allowedDates } = getBookingDateBounds(now);
  const labels = ['Today', 'Tomorrow', 'Day After'];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  return allowedDates.map((dateStr, idx) => {
    const [y, m, d] = dateStr.split('-').map(Number);
    const dt = new Date(y, m - 1, d);
    const dow = dt.getDay();
    const availableDay = isDoctorAvailableOnDate(opdSchedule, dateStr);
    const slotsForDay = availableDay ? generateSlotsFromSchedule(opdSchedule, dateStr, now) : [];

    return {
      dateStr,
      label: labels[idx] || dateStr,
      dayName: dayNames[dow],
      displayDate: `${String(d).padStart(2, '0')} ${monthNames[m - 1]}`,
      dayOfWeek: dow,
      isDoctorAvailable: availableDay && slotsForDay.length > 0,
    };
  });
}
