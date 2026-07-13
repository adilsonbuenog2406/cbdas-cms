import { isCmsAuthenticated } from "@/app/cms/_lib/auth";
import { createDeployment } from "@/server/publishing/publisher";
import { DeploymentError } from "@/server/publishing/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST() {
  if (!(await isCmsAuthenticated())) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const record = await createDeployment("cms-admin");

    return Response.json({
      deploymentId: record.id,
      status: record.status,
    });
  } catch (error) {
    if (error instanceof DeploymentError && error.code === "DEPLOYMENT_ALREADY_RUNNING") {
      return Response.json(
        {
          error: error.message,
          errorCode: error.code,
        },
        { status: 409 },
      );
    }

    return Response.json(
      {
        error: error instanceof Error ? error.message : "Nao foi possivel iniciar a publicacao.",
        errorCode: error instanceof DeploymentError ? error.code : "RELEASE_BUILD_FAILED",
      },
      { status: 400 },
    );
  }
}
