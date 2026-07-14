import { readUploadedAsset } from "@/server/cms-storage";

type UploadRouteContext = {
  params: Promise<{
    path: string[];
  }>;
};

export async function GET(_request: Request, context: UploadRouteContext) {
  const params = await context.params;
  const requestedPath = params.path.join("/");

  try {
    const asset = await readUploadedAsset(requestedPath);

    return new Response(asset.body, {
      headers: {
        "cache-control": "public, max-age=31536000, immutable",
        "content-type": asset.contentType,
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
