import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// function to decode url-encoded strings

/**
 * Decodes a URL-encoded string. It handles `+` characters as spaces,
 * which is common in query strings but not handled by `decodeURIComponent`.
 *
 * @param encodedString The URL-encoded string to decode.
 * @returns The decoded string. Returns the original string if decoding fails.
 */
export const decodeUrlString = (encodedString: string): string => {
  try {
    return decodeURIComponent(encodedString.replace(/\+/g, ' ').replace(/%20/g, ' '));
  } catch (error) {
    console.error('Failed to decode URL string:', error);
    return encodedString; // Return original string if decoding fails
  }
};
