import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formats a number or string into a string with Indonesian thousand separators (.).
 * Strips non-digit characters before formatting.
 * @param value The number or string to format.
 * @returns A formatted number string.
 */
export function formatNumber(value: number | string | undefined | null): string {
  if (value === null || value === undefined) {
    return "0";
  }
  // Remove all non-digit characters, then parse as integer
  const number = typeof value === 'string' ? parseInt(value.replace(/\D/g, ''), 10) : value;
  
  if (isNaN(number)) {
    // If parsing results in NaN, return the original value if it was a string, otherwise '0'
    return typeof value === 'string' ? value : '0';
  }
  
  // Format the number using Indonesian locale for dot separators
  return new Intl.NumberFormat('id-ID').format(number);
}