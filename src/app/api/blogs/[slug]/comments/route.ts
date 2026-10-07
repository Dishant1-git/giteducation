const CMS_API_URL = process.env.CMS_API_URL?.replace(/\/$/, "");

type Context = { params: Promise<{ slug: string }> };

async function forward(request: Request, slug: string, method: "GET" | "POST"): Promise<Response> {
  if (!CMS_API_URL) {
    return Response.json({ message: "Comments are temporarily unavailable." }, { status: 503 });
  }

  try {
    const upstream = await fetch(
      `${CMS_API_URL}/api/public/blogs/${encodeURIComponent(slug)}/comments`,
      {
        method,
        headers: {
          ...(method === "POST" ? { "Content-Type": request.headers.get("content-type") ?? "application/json" } : {}),
          ...(request.headers.get("x-forwarded-for")
            ? { "X-Forwarded-For": request.headers.get("x-forwarded-for")! }
            : {}),
          ...(request.headers.get("user-agent")
            ? { "User-Agent": request.headers.get("user-agent")! }
            : {}),
        },
        ...(method === "POST" ? { body: await request.text() } : {}),
        cache: "no-store",
        signal: AbortSignal.timeout(10000),
      },
    );
    const body = await upstream.text();
    return new Response(body, {
      status: upstream.status,
      headers: { "Content-Type": upstream.headers.get("content-type") ?? "application/json" },
    });
  } catch (error) {
    console.error("[api/blog-comments] CMS request failed:", error);
    return Response.json({ message: "Comments are temporarily unavailable." }, { status: 502 });
  }
}

export async function GET(request: Request, { params }: Context) {
  const { slug } = await params;
  return forward(request, slug, "GET");
}

export async function POST(request: Request, { params }: Context) {
  const { slug } = await params;
  return forward(request, slug, "POST");
}
