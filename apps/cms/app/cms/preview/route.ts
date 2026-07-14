import { isCmsAuthenticated } from "@/app/cms/_lib/auth";
import { readPublishedLandingHtml } from "@/server/cms-storage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isCmsAuthenticated())) {
    return new Response(null, {
      status: 302,
      headers: {
        location: "/cms",
      },
    });
  }

  try {
    return new Response(await readPublishedLandingHtml(), {
      headers: {
        "cache-control": "no-store",
        "content-type": "text/html; charset=utf-8",
      },
    });
  } catch (error) {
    console.error("CMS_PREVIEW_FAILED", error);

    return new Response("Nenhuma versao salva foi encontrada. Salve pelo editor antes do preview.", {
      status: 404,
      headers: {
        "cache-control": "no-store",
        "content-type": "text/plain; charset=utf-8",
      },
    });
  }
}
