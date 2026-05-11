/**
 * Replace `{key}` placeholders in `template` with the values from `vars`.
 * Missing keys are left untouched.
 */
export function interpolate(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in vars ? String(vars[key]) : match,
  );
}
