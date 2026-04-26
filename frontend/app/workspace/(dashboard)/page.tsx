import { getCurrentUser } from "@/lib/auth/server";
import { dashboardDataForUser } from "@/lib/db/audits";
import { SummaryClient } from "@/components/workspace/SummaryClient";

export default async function WorkspacePage() {
  const user = await getCurrentUser();
  const data = user ? await dashboardDataForUser(user.id) : null;
  return <SummaryClient data={data} />;
}
