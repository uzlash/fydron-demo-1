"use client";

import { Spinner } from "@fluentui/react-components";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { readDemoSessionUserFromStorage, useDemoSession } from "@/features/auth/demo-session-context";

const AUTH_PREFIX = "/auth";

function isAuthPath(pathname: string | null): boolean {
  if (!pathname) return false;
  if (pathname === "/") return false;
  return pathname === AUTH_PREFIX || pathname.startsWith(`${AUTH_PREFIX}/`);
}

/**
 * Enforces demo session for app routes. Auth routes (and /) are open.
 * Redirects logged-in users away from the login page.
 */
export function DemoSessionGate({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, ready, syncFromStorage } = useDemoSession();
  const auth = isAuthPath(pathname);
  const isLogin = pathname === "/auth/login";

  useEffect(() => {
    if (!ready) return;
    if (user && isLogin) {
      router.replace("/dashboard");
    }
  }, [ready, user, isLogin, router]);

  useEffect(() => {
    if (!ready) return;
    if (auth) return;
    if (user) return;
    // Right after sign-in, navigation can run before React commits `user`. Session is
    // already in localStorage — recover once before sending the user back to login.
    const stored = readDemoSessionUserFromStorage();
    if (stored) {
      syncFromStorage();
      return;
    }
    router.replace("/auth/login");
  }, [ready, user, auth, router, syncFromStorage]);

  if (!ready && !auth) {
    return (
      <div className="box-border flex h-screen w-full overflow-hidden bg-background p-2.5 text-secondary">
        <div className="flex flex-1 items-center justify-center rounded-lg border border-border bg-surface">
          <Spinner size="small" label="Loading" />
        </div>
      </div>
    );
  }

  if (ready && !user && !auth) {
    return null;
  }

  return <>{children}</>;
}
