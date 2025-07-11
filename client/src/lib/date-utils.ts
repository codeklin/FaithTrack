// import { Timestamp } from 'firebase/firestore';

// Define a placeholder for Timestamp if needed for type safety, or remove if not strictly necessary
// For now, we'll remove it from function signatures or replace with 'any' or 'object' if structure is checked.
// type Timestamp = any; // Placeholder if direct replacement is too complex

/**
 * Converts a Date or string/number to a JavaScript Date object
 */
export function toDate(value: Date | string | number | object): Date { // Timestamp removed, object added for potential structured data
  if (value instanceof Date) {
    return value;
  }
  
  // if (value && typeof value === 'object' && 'toDate' in value) {
  //   // Firestore Timestamp
  //   return (value as any).toDate();
  // }
  
  // if (value && typeof value === 'object' && '_seconds' in value) {
  //   // Firestore Timestamp serialized format
  //   return new Date((value as any)._seconds * 1000);
  // }

  if (typeof value === 'string' || typeof value === 'number') {
    return new Date(value);
  }

  // If it's an object but not a Date, and not matching Firestore Timestamp,
  // it might be a complex object that Date constructor can't handle directly.
  // For now, attempt to cast to string, which might work for some ISO string representations in objects.
  // This part might need refinement based on actual data structures from Supabase.
  if (typeof value === 'object' && value !== null) {
    console.warn("toDate received an object that is not a Date. Attempting conversion, but this might be unreliable.", value);
    return new Date(String(value));
  }
  
  // Fallback for other types or if conversion is not straightforward
  // Consider throwing an error or returning an invalid Date
  console.error("toDate could not convert value:", value);
  return new Date(NaN); // Invalid Date
}

/**
 * Safely formats a date value that might be a Date or string/number
 */
export function formatDate(value: Date | string | number | object | undefined, fallback: string = 'N/A'): string {
  if (!value) return fallback;
  
  try {
    const date = toDate(value);
    if (isNaN(date.getTime())) return fallback; // Check if date is valid
    return date.toLocaleDateString();
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
