/**
 * Demo login for the prototype:
 * - michael@fydron.com / demo123
 * - bram@fydron.com / demo123
 */
export const DEMO_PASSWORD = "demo123" as const;

export type DemoUser = {
  email: string;
  firstName: string;
  lastName: string;
};

export function matchDemoUser(
  email: string,
  password: string,
): DemoUser | null {
  const normalizedEmail = email.trim().toLowerCase();
  const normalizedPassword = password.trim();

  if (normalizedPassword !== DEMO_PASSWORD) return null;

  if (normalizedEmail === "michael@fydron.com") {
    return { email: "michael@fydron.com", firstName: "Michael", lastName: "" };
  }

  if (normalizedEmail === "bram@fydron.com") {
    return { email: "bram@fydron.com", firstName: "Bram", lastName: "" };
  }

  return null;
}

export function demoDisplayName(user: DemoUser): string {
  const full = [user.firstName, user.lastName].filter(Boolean).join(" ").trim();
  return full || user.firstName;
}
