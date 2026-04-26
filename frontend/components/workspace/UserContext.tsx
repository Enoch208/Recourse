"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { PublicUser } from "@/lib/db/users";

export type WorkspaceIdentity = {
  user: PublicUser | null; // null = guest
  isGuest: boolean;
  displayName: string;
  initials: string;
  email: string;
};

const Ctx = createContext<WorkspaceIdentity | null>(null);

function deriveInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function UserProvider({
  user,
  children,
}: {
  user: PublicUser | null;
  children: ReactNode;
}) {
  const identity: WorkspaceIdentity = user
    ? {
        user,
        isGuest: false,
        displayName: user.name,
        initials: deriveInitials(user.name),
        email: user.email,
      }
    : {
        user: null,
        isGuest: true,
        displayName: "J. Ramirez",
        initials: "JR",
        email: "guest@recourse.io",
      };

  return <Ctx.Provider value={identity}>{children}</Ctx.Provider>;
}

export function useIdentity(): WorkspaceIdentity {
  const v = useContext(Ctx);
  if (!v) {
    return {
      user: null,
      isGuest: true,
      displayName: "J. Ramirez",
      initials: "JR",
      email: "guest@recourse.io",
    };
  }
  return v;
}
