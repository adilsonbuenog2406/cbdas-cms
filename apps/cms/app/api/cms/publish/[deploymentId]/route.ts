import { isCmsAuthenticated } from "@/app/cms/_lib/auth";
import { getDeployment } from "@/server/publishing/publisher";

type DeploymentRouteContext = {
  params: Promise<{
    deploymentId: string;
  }>;
};

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(_request: Request, context: DeploymentRouteContext) {
  if (!(await isCmsAuthenticated())) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const params = await context.params;
  const record = await getDeployment(params.deploymentId);

  if (!record) {
    return Response.json({ error: "Deployment not found" }, { status: 404 });
  }

  return Response.json({ deployment: record });
}
