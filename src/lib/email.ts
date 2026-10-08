/** Shared by client forms and API routes so both reject the same inputs. */
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function normalizeEmail(value: string): string {
  return value.trim().toLowerCase();
}

/** Returns a user-facing error, or null when the address looks valid. */
export function validateEmail(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return "Enter your email address.";
  if (trimmed.length > 254 || !EMAIL_PATTERN.test(trimmed)) {
    return "That email doesn't look right.";
  }
  return null;
}
