export type PasswordChecks = {
  length: boolean;
  uppercase: boolean;
  number: boolean;
  match: boolean;
};

export function evaluatePassword(pw: string, confirm: string): PasswordChecks {
  return {
    length: pw.length >= 8,
    uppercase: /[A-Z]/.test(pw),
    number: /[0-9]/.test(pw),
    match: pw.length > 0 && pw === confirm,
  };
}

export function passwordIsValid(checks: PasswordChecks): boolean {
  return checks.length && checks.uppercase && checks.number && checks.match;
}
