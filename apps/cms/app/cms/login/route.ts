import { readFile } from "node:fs/promises";
import path from "node:path";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const sessionCookieName = "cms_session";
const rootEnvPath = path.resolve(process.cwd(), "../..", ".env");

function parseEnv(content: string) {
  const values: Record<string, string> = {};

  for (const line of content.split(/\r?\n/)) {
    const trimmedLine = line.trim();

    if (!trimmedLine || trimmedLine.startsWith("#")) {
      continue;
    }

    const separatorIndex = trimmedLine.indexOf("=");

    if (separatorIndex === -1) {
      continue;
    }

    const key = trimmedLine.slice(0, separatorIndex).trim();
    let value = trimmedLine.slice(separatorIndex + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    values[key] = value;
  }

  return values;
}

async function getExpectedCredentials() {
  try {
    const rootEnv = parseEnv(await readFile(rootEnvPath, "utf8"));

    return {
      login: process.env.LOGIN ?? rootEnv.LOGIN ?? "",
      password: process.env.PASSWORD ?? rootEnv.PASSWORD ?? "",
    };
  } catch {
    return {
      login: process.env.LOGIN ?? "",
      password: process.env.PASSWORD ?? "",
    };
  }
}

export function GET() {
  redirect("/cms");
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const login = String(formData.get("login") ?? "");
  const password = String(formData.get("password") ?? "");
  const expectedCredentials = await getExpectedCredentials();

  if (login !== expectedCredentials.login || password !== expectedCredentials.password) {
    redirect("/cms?error=1");
  }

  const cookieStore = await cookies();

  cookieStore.set(sessionCookieName, "ok", {
    httpOnly: true,
    sameSite: "lax",
    path: "/cms",
  });

  redirect("/cms");
}
