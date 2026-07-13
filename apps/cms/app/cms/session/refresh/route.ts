import { cookies } from "next/headers";

const sessionCookieName = "cms_session";

export async function POST() {
  const cookieStore = await cookies();

  if (cookieStore.get(sessionCookieName)?.value !== "ok") {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  cookieStore.set(sessionCookieName, "ok", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  });

  return Response.json({ ok: true });
}
