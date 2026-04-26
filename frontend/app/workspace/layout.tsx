import type { ReactNode } from "react";
import { getCurrentUser } from "@/lib/auth/server";
import { auditStatsForUser } from "@/lib/db/audits";
import { UserProvider } from "@/components/workspace/UserContext";

export default async function WorkspaceLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await getCurrentUser();
  const stats = user ? await auditStatsForUser(user.id) : null;
  return (
    <UserProvider user={user} stats={stats}>
      {children}
    </UserProvider>
  );
}
