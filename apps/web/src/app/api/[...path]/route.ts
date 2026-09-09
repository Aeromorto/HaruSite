import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";

/** Proxy same-origin: segredo de sessão fica em cookie HttpOnly, sem CORS amplo. */
async function proxy(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  const { path } = await context.params;
  const route = path.join("/");
  // Lista fechada: evita transformar o frontend em proxy para endpoints internos futuros.
  if (
    !/^(health|products(?:\/[a-z0-9-]+)?|cart(?:\/items)?|postal\/\d{8})$/.test(
      route,
    )
  ) {
    return NextResponse.json(
      { message: "Endpoint inexistente" },
      { status: 404 },
    );
  }
  const headers = new Headers({
    "content-type": "application/json",
    "x-haru-request": request.headers.get("x-haru-request") || "",
  });
  for (const name of ["cookie", "origin"]) {
    const value = request.headers.get(name);
    if (value) headers.set(name, value);
  }
  try {
    const response = await fetch(
      `${process.env.API_URL || "http://127.0.0.1:3001"}/api/${route}`,
      {
        method: request.method,
        headers,
        cache: "no-store",
        signal: AbortSignal.timeout(8000),
        body: ["GET", "HEAD"].includes(request.method)
          ? undefined
          : await request.text(),
        redirect: "error",
      },
    );
    const result = new NextResponse(await response.text(), {
      status: response.status,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store",
      },
    });
    const cookie = response.headers.get("set-cookie");
    if (cookie) result.headers.set("set-cookie", cookie);
    return result;
  } catch {
    return NextResponse.json(
      { message: "Serviço temporariamente indisponível" },
      { status: 503 },
    );
  }
}
export { proxy as GET, proxy as PUT };
