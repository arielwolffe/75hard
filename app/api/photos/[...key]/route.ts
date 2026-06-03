import fs from "fs";
import path from "path";

const photosDir = path.join(process.env.DATA_PATH || "./data", "photos");

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ key: string[] }> }
) {
  const { key } = await params;
  const filePath = path.join(photosDir, ...key);

  // Prevent path traversal
  const resolved = path.resolve(filePath);
  const base = path.resolve(photosDir);
  if (!resolved.startsWith(base)) {
    return new Response("Forbidden", { status: 403 });
  }

  if (!fs.existsSync(resolved)) {
    return new Response("Not found", { status: 404 });
  }

  const ext = path.extname(resolved).toLowerCase();
  const contentType = ext === ".png" ? "image/png" : "image/jpeg";
  const buffer = fs.readFileSync(resolved);

  return new Response(buffer, {
    headers: { "Content-Type": contentType, "Cache-Control": "public, max-age=31536000" },
  });
}
