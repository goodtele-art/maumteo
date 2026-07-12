// Pilot asset generation via Gemini Imagen 4
// Usage: node scripts/pilot-gen.mjs
// Requires: .env.local with GEMINI_API_KEY
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const OUT_DIR = path.join(ROOT, "public/assets/_pilot");

// Load .env.local
const envText = await fs.readFile(path.join(ROOT, ".env.local"), "utf8");
const env = Object.fromEntries(
  envText.split(/\r?\n/).filter((l) => l && !l.startsWith("#") && l.includes("="))
    .map((l) => { const i = l.indexOf("="); return [l.slice(0, i).trim(), l.slice(i + 1).trim()]; }),
);
const KEY = env.GEMINI_API_KEY;
const MODEL = env.GEMINI_IMAGE_MODEL || "imagen-4.0-generate-001";
if (!KEY) { console.error("GEMINI_API_KEY missing in .env.local"); process.exit(1); }

const STYLE_INFANT_CHAR =
  "soft watercolor illustration, ultra kawaii style, very round features, oversized head, " +
  "chubby cheeks, soft dreamy pastel palette, toddler/infant age 1-5, cute onesie or soft clothing, " +
  "clean white background, 1:1 square composition, no text, no watermark";
const STYLE_INFANT_FAC =
  "soft watercolor illustration, soft dreamy pastel palette, nurturing infant-safe interior design, " +
  "baby pink/mint/lavender accents, rounded furniture, ultra-soft atmosphere, gentle diffused light, " +
  "no text, no watermark";
const STYLE_CHILD_FAC =
  "soft watercolor illustration, bright cheerful pastel palette, child-friendly interior design, " +
  "warm yellow/orange/sky-blue accents, colorful but organized, natural light, playful safe atmosphere, " +
  "no text, no watermark";
const NEG = "text, watermark, signature, logo, realistic photo, 3d render, scary, horror, violence, " +
  "blood, deformed, blurry, low quality, multiple views, comic panels, speech bubbles";

// 4 pilot prompts — one per missing category
const PILOTS = [
  {
    id: "asd_early_calm",
    out: "characters/patient-infant/asd_early_calm.webp",
    aspect: "1:1",
    prompt:
      `${STYLE_INFANT_CHAR}, toddler age 2-4, making gentle eye contact, slight smile, ` +
      `playing with toy functionally, round chubby features, soft teal ambient lighting, ` +
      `infant developmental center patient, connected and engaged`,
  },
  {
    id: "infant_play",
    out: "facilities-infant/infant_play.webp",
    aspect: "4:3",
    prompt:
      `${STYLE_INFANT_FAC}, an infant developmental play room, thick interlocking soft foam mat floor ` +
      `in pastel pink and cream, baby-safe developmental toys (stacking rings nesting cups soft blocks) ` +
      `arranged on low open shelving, large safety mirror at toddler height on left wall, ` +
      `whimsical cloud-and-star mobile hanging from ceiling, rounded wooden activity cube in center, ` +
      `pastel pink accent wall with hand-painted bunny and bear mural, gentle diffused warm light from ` +
      `overhead rice-paper lantern, safe nurturing environment for ages 1-5, 4:3 aspect ratio, no people`,
  },
  {
    id: "infant_bloom",
    out: "floors-infant/infant_bloom.webp",
    aspect: "16:9",
    prompt:
      `wide panoramic watercolor illustration, 16:9 aspect ratio, soft dreamy pastel palette, ` +
      `a blooming playroom for toddlers (EM 0-25), soft sage-green walls with hand-painted wildflower ` +
      `mural — daisies tulips and dandelion puffs stretching across the entire back wall, ` +
      `hanging colorful felt mobiles (butterflies birds flowers) suspended from ceiling at different heights, ` +
      `thick interlocking soft foam mat floor in pastel green and cream, large arched windows on right ` +
      `flooding the room with warm morning sunlight through sheer white curtains, potted nursery plants ` +
      `on low safe shelves, wooden Montessori climbing arch in corner, ceiling painted as a blue sky with ` +
      `small white clouds, magical garden-like atmosphere, no people, no text`,
  },
  {
    id: "play_room",
    out: "facilities-child/play_room.webp",
    aspect: "4:3",
    prompt:
      `${STYLE_CHILD_FAC}, a child play therapy room, colorful wooden toy shelves neatly organized along ` +
      `back wall with labeled bins, sand tray therapy table with miniature figurines in center, ` +
      `Victorian-style dollhouse in corner, art corner with crayons colored pencils and finger paint in ` +
      `mason jars, soft cream carpet floor with rainbow hopscotch mat, cloud-shaped ceiling lamp casting ` +
      `warm even light, hand-painted animal mural (rabbit fox owl) on left wall, child-safe rounded ` +
      `furniture edges, inviting atmosphere for ages 7-12, 4:3 aspect ratio, no people, no text`,
  },
];

async function generate(item) {
  const isImagen = MODEL.startsWith("imagen");
  const url = isImagen
    ? `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:predict?key=${KEY}`
    : `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${KEY}`;
  const body = isImagen
    ? {
        instances: [{ prompt: item.prompt }],
        parameters: { sampleCount: 1, aspectRatio: item.aspect, negativePrompt: NEG },
      }
    : {
        contents: [{
          parts: [{
            text: `${item.prompt}\n\nAspect ratio: ${item.aspect}. Avoid: ${NEG}.`,
          }],
        }],
        generationConfig: { responseModalities: ["IMAGE"] },
      };
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`HTTP ${res.status}: ${txt}`);
  }
  const json = await res.json();
  const b64 = isImagen
    ? json?.predictions?.[0]?.bytesBase64Encoded
    : json?.candidates?.[0]?.content?.parts?.find((p) => p.inlineData || p.inline_data)?.inlineData?.data
      ?? json?.candidates?.[0]?.content?.parts?.find((p) => p.inline_data)?.inline_data?.data;
  if (!b64) throw new Error(`no image in response: ${JSON.stringify(json).slice(0, 400)}`);
  return Buffer.from(b64, "base64");
}

await fs.mkdir(OUT_DIR, { recursive: true });
console.log(`Model: ${MODEL}`);
console.log(`Output: ${OUT_DIR}\n`);

for (const item of PILOTS) {
  const outFile = path.join(OUT_DIR, item.out);
  await fs.mkdir(path.dirname(outFile), { recursive: true });
  process.stdout.write(`[${item.id}] (${item.aspect}) generating... `);
  const t0 = Date.now();
  try {
    const buf = await generate(item);
    // Imagen returns PNG; save as .png alongside .webp planned name
    const pngPath = outFile.replace(/\.webp$/, ".png");
    await fs.writeFile(pngPath, buf);
    console.log(`OK ${(buf.length / 1024).toFixed(0)}KB ${((Date.now() - t0) / 1000).toFixed(1)}s`);
  } catch (e) {
    console.log(`FAIL`);
    console.error(`  ${e.message}\n`);
  }
}

console.log(`\nDone. Files in: public/assets/_pilot/`);
