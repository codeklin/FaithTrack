import { Timestamp } from 'firebase/firestore';

/**
 * Converts a Date or Firestore Timestamp to a JavaScript Date object
 */
export function toDate(value: Date | Timestamp | string | number): Date {
  if (value instanceof Date) {
    return value;
  }
  
  if (value && typeof value === 'object' && 'toDate' in value) {
    // Firestore Timestamp
    return value.toDate();
  }
  
  if (value && typeof value === 'object' && '_seconds' in value) {
    // Firestore Timestamp serialized format
    return new Date((value as any)._seconds * 1000);
  }
  
  // String or number
  return new Date(value);
}

/**
 * Safely formats a date value that might be a Date or Timestamp
 */
export function formatDate(value: Date | Timestamp | string | number | undefined, fallback: string = 'N/A'): string {
  if (!value) return fallback;
  
  try {
    return toDate(value).toLocaleDateString();
  } catch (error) {
    console.warn('Error formatting date:', error);
    return fallback;
  }
}

/**
 * Converts a date value to ISO string for input fields
 */
export function toInputValue(value: Date | Timestamp | string | number | undefined): string {
  if (!value) return '';
  
  try {
    const date = toDate(value);
    return date.toISOString().slice(0, 16); // Format for datetime-local input
  } catch (error) {
    console.warn('Error converting to input value:', error);
    return '';
  }
}
