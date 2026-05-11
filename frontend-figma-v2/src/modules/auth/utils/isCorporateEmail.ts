const PERSONAL_DOMAINS = new Set<string>([
  "gmail.com",
  "hotmail.com",
  "outlook.com",
  "yahoo.com",
  "icloud.com",
  "live.com",
  "protonmail.com",
  "me.com",
  "msn.com",
]);

/**
 * Returns false when the email's domain is a known personal provider.
 * Used as a UX hint, never as a hard validation rule.
 */
export function isCorporateEmail(email: string): boolean {
  const trimmed = email.trim().toLowerCase();
  const at = trimmed.lastIndexOf("@");
  if (at < 0) return true; // not an email yet — don't show warning
  const domain = trimmed.slice(at + 1);
  if (!domain) return true;
  return !PERSONAL_DOMAINS.has(domain);
}
