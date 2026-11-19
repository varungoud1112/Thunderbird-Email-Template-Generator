import { getStore } from "@netlify/blobs";

export default async (req) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Cache-Control": "no-store, no-cache, must-revalidate",
    "Content-Type": "application/json"
  };

  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers });

  // IMPORTANT: if your old function used a different store name, put that name here
  const store = getStore({ name: "email-template-data", consistency: "strong" });
  const key = new URL(req.url).searchParams.get("key");
  if (!key) return new Response("Missing key", { status: 400, headers });

  try {
    if (req.method === "GET") {
      const val = await store.get(key);
      return new Response(val ?? "null", { status: 200, headers });
    }
    if (req.method === "POST") {
      await store.set(key, await req.text());
      return new Response(JSON.stringify({ ok: true }), { status: 200, headers });
    }
    return new Response("Method not allowed", { status: 405, headers });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), { status: 500, headers });
  }
};
