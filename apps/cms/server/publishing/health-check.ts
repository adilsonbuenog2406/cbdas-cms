import { setTimeout as delay } from "node:timers/promises";
import { DeploymentError } from "./types";

function buildHealthCheckUrl(publicUrl: string, deploymentId: string) {
  const url = new URL(publicUrl);
  url.searchParams.set("deployment", deploymentId);
  url.searchParams.set("cacheBust", Date.now().toString());

  return url.toString();
}

export async function runHealthCheck(publicUrl: string, deploymentId: string) {
  const targetUrl = buildHealthCheckUrl(publicUrl, deploymentId);
  let lastMessage = "Health check falhou.";

  for (let attempt = 1; attempt <= 5; attempt += 1) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    try {
      const response = await fetch(targetUrl, {
        cache: "no-store",
        signal: controller.signal,
      });
      const html = await response.text();

      if (
        response.status === 200 &&
        html.trim().length > 0 &&
        html.includes(`name="cms-deployment-id" content="${deploymentId}"`) &&
        !html.toLowerCase().includes("index of /") &&
        !html.toLowerCase().includes("hostinger")
      ) {
        clearTimeout(timeout);
        return;
      }

      lastMessage = `Health check retornou HTTP ${response.status} sem o deployment esperado.`;
    } catch (error) {
      lastMessage = error instanceof Error ? error.message : "Health check falhou.";
    } finally {
      clearTimeout(timeout);
    }

    await delay(attempt * 1500);
  }

  throw new DeploymentError("HEALTH_CHECK_FAILED", lastMessage);
}
