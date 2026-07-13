import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const sessionCookieName = "cms_session";

export async function POST() {
  const cookieStore = await cookies();

  cookieStore.delete(sessionCookieName);
  cookieStore.set(sessionCookieName, "", {
    expires: new Date(0),
    path: "/cms",
  });
  cookieStore.set(sessionCookieName, "", {
    expires: new Date(0),
    path: "/",
  });

  redirect("/cms");
}
