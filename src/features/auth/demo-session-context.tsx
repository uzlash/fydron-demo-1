"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { DemoUser } from "@/features/auth/demo-accounts";

const STORAGE_KEY = "fydron-demo-user";

export function readDemoSessionUserFromStorage(): DemoUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as unknown;
    if (
      parsed &&
      typeof parsed === "object" &&
      "email" in parsed &&
      "firstName" in parsed &&
      typeof (parsed as DemoUser).email === "string" &&
      typeof (parsed as DemoUser).firstName === "string"
    ) {
      const u = parsed as DemoUser;
      return {
        email: u.email,
        firstName: u.firstName,
        lastName: typeof u.lastName === "string" ? u.lastName : "",
      };
    }
    return null;
  } catch {
    return null;
  }
}

type DemoSessionContextValue = {
  user: DemoUser | null;
  ready: boolean;
  signIn: (user: DemoUser) => void;
  signOut: () => void;
  syncFromStorage: () => void;
};

const DemoSessionContext = createContext<DemoSessionContextValue | null>(null);

export function DemoSessionProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<DemoUser | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setUser(readDemoSessionUserFromStorage());
    setReady(true);
  }, []);

  const syncFromStorage = useCallback(() => {
    setUser(readDemoSessionUserFromStorage());
  }, []);

  const signIn = useCallback((next: DemoUser) => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
            /* ignore */
    }
    setUser(next);
  }, []);

  const signOut = useCallback(() => {
    setUser(null);
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  }, []);

  const value = useMemo(
    () => ({ user, ready, signIn, signOut, syncFromStorage }),
    [user, ready, signIn, signOut, syncFromStorage],
  );

  return (
    <DemoSessionContext.Provider value={value}>
      {children}
    </DemoSessionContext.Provider>
  );
}

export function useDemoSession(): DemoSessionContextValue {
  const ctx = useContext(DemoSessionContext);
  if (!ctx) {
    throw new Error("useDemoSession must be used within DemoSessionProvider");
  }
  return ctx;
}
