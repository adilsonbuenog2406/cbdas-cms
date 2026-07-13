import { isCmsAuthenticated } from "@/app/cms/_lib/auth";
import { rollbackDeployment } from "@/server/publishing/publisher";
import { DeploymentError } from "@/server/publishing/types";

type RollbackRouteContext = {
  params: Promise<{
    deploymentId: string;
  }>;
};

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(_request: Request, context: RollbackRouteContext) {
  if (!(await isCmsAuthenticated())) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const params = await context.params;

  try {
    await rollbackDeployment(params.deploymentId, "cms-admin");

    return Response.json({ ok: true });
  } catch (error) {
    return Response.json(
      {
        error: error instanceof Error ? error.message : "Rollback falhou.",
        errorCode: error instanceof DeploymentError ? error.code : "ROLLBACK_FAILED",
      },
      { status: error instanceof DeploymentError && error.code === "DEPLOYMENT_ALREADY_RUNNING" ? 409 : 400 },
    );
  }
}
