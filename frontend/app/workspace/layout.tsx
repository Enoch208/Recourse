import type { ReactNode } from "react";
import { getCurrentUser } from "@/lib/auth/server";
import { UserProvider } from "@/components/workspace/UserContext";

export default async function WorkspaceLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await getCurrentUser();
  return <UserProvider user={user}>{children}</UserProvider>;
}
