import { cookies } from "next/headers";
import { uploadEditorImage } from "@/server/cms-storage";

const sessionCookieName = "cms_session";
const maxUploadBytes = 12 * 1024 * 1024;

export async function POST(request: Request) {
  const cookieStore = await cookies();

  if (cookieStore.get(sessionCookieName)?.value !== "ok") {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File) || !file.type.startsWith("image/")) {
    return Response.json({ error: "Envie um arquivo de imagem valido." }, { status: 400 });
  }

  if (file.size > maxUploadBytes) {
    return Response.json({ error: "A imagem deve ter no maximo 12 MB." }, { status: 413 });
  }

  let src: string;

  try {
    src = await uploadEditorImage(file);
  } catch (error) {
    const message =
      error instanceof Error && error.message ? error.message : "Nao foi possivel enviar a imagem.";

    return Response.json(
      {
        error: message,
      },
      { status: message.includes("Formato de imagem") ? 400 : 500 },
    );
  }

  return Response.json({
    src,
  });
}
