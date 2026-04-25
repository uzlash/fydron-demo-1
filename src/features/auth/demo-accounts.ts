/**
 * Demo login for the prototype (no real auth):
 * - Michael (or michael@fydron.com) / demo
 * - Bram (or bram@fydron.com) / demo
 *
 * Login id matching is case-insensitive; session still stores the demo email shape.
 */
export const DEMO_PASSWORD = "demo" as const;

export type DemoUser = {
  email: string;
  firstName: string;
  lastName: string;
};

export function matchDemoUser(loginId: string, password: string): DemoUser | null {
  const id = loginId.trim().toLowerCase();
  const normalizedPassword = password.trim();

  if (!id || normalizedPassword !== DEMO_PASSWORD) return null;

  if (id === "michael" || id === "michael@fydron.com") {
    return { email: "michael@fydron.com", firstName: "Michael", lastName: "" };
  }

  if (id === "bram" || id === "bram@fydron.com") {
    return { email: "bram@fydron.com", firstName: "Bram", lastName: "" };
  }

  return null;
}

export function demoDisplayName(user: DemoUser): string {
  const full = [user.firstName, user.lastName].filter(Boolean).join(" ").trim();
  return full || user.firstName;
}
