import sharp from "sharp";

const config = {
  jpeg: { quality: 80 },
  webp: { quality: 80 },
  png: { compressionLevel: 8 },
};

export async function imageResize(buffer: Buffer, imageFormat: string) {
  const format = imageFormat.toLowerCase();
  let transformer = sharp(buffer).resize(1200, null, { withoutEnlargement: true });

  if (format === "jpeg") {
    transformer = transformer.jpeg(config.jpeg);
  } else if (format === "png") {
    transformer = transformer.png(config.png);
  } else if (format === "webp") {
    transformer = transformer.webp(config.webp);
  }

  return await transformer.toBuffer();
}
