import { isCmsAuthenticated } from "@/app/cms/_lib/auth";
import { getDeploymentHistory } from "@/server/publishing/publisher";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isCmsAuthenticated())) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  return Response.json({ deployments: await getDeploymentHistory() });
}
