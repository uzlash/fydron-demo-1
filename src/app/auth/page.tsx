import Link from "next/link";

const links: { href: string; label: string }[] = [
  { href: "/auth/login", label: "Login" },
  { href: "/auth/login?error=1", label: "Login (error + toast)" },
  { href: "/auth/forgot-password", label: "Forgot password" },
  { href: "/auth/mail-sent", label: "Mail sent" },
  { href: "/auth/create-password", label: "Create password" },
  { href: "/auth/create-password?mismatch=1", label: "Create password (mismatch preview)" },
  { href: "/auth/password-success", label: "Password success (light)" },
  { href: "/auth/password-success?theme=dark", label: "Password success (dark)" },
  { href: "/auth/profile", label: "Profile (empty)" },
  { href: "/auth/profile?state=filled", label: "Profile (filled)" },
  { href: "/auth/mfa", label: "MFA" },
  { href: "/dashboard", label: "Dashboard" }
];

export default function AuthHubPage() {
  return (
    <main className="mx-auto max-w-lg p-8">
      <h1 className="mb-6 text-xl font-semibold">Auth demo routes</h1>
      <ul className="flex flex-col gap-2">
        {links.map((l) => (
          <li key={l.href}>
            <Link className="text-primary underline" href={l.href}>
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
