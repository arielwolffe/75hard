import fs from "fs";
import path from "path";

const photosDir = path.join(process.env.DATA_PATH || "./data", "photos");

export async function uploadPhoto(
  buffer: Buffer,
  key: string
): Promise<string> {
  const filePath = path.join(photosDir, key);
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, buffer);
  return `/api/photos/${key}`;
}

export async function deletePhoto(key: string): Promise<void> {
  const filePath = path.join(photosDir, key);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
}
