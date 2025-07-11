// import { Timestamp } from 'firebase/firestore'; // Firebase Timestamp type

/**
 * Converts a Date, string, or number to a JavaScript Date object.
 * Handles ISO 8601 strings (used by Supabase) and numeric timestamps.
 */
export function toDate(value: Date | string | number): Date {
  if (value instanceof Date) {
    return value;
  }
  
  // String (ISO 8601 or other parsable date strings) or number (timestamp)
  return new Date(value);
}

/**
 * Safely formats a date value that might be a Date, string, or number.
 */
export function formatDate(value: Date | string | number | undefined, fallback: string = 'N/A'): string {
  if (!value) return fallback;
  
  try {
    return toDate(value).toLocaleDateString();
  } catch (error) {
    console.warn('Error formatting date:', error);
    return fallback;
  }
}

/**
 * Converts a date value to a string suitable for datetime-local input fields.
 */
export function toInputValue(value: Date | string | number | undefined): string {
  if (!value) return '';
  
  try {
    const date = toDate(value);
    // Ensure the date is valid before trying to convert to ISO string
    if (isNaN(date.getTime())) {
      throw new Error('Invalid date value');
    }
    return date.toISOString().slice(0, 16); // Format for datetime-local input
  } catch (error) {
    console.warn('Error converting to input value:', error, 'Original value:', value);
    return '';
  }
}
