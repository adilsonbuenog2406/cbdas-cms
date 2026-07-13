import { cookies } from "next/headers";

export const sessionCookieName = "cms_session";

export async function isCmsAuthenticated() {
  const cookieStore = await cookies();

  return cookieStore.get(sessionCookieName)?.value === "ok";
}
