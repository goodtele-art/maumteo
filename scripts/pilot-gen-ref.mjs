// Pilot asset generation via Gemini 2.5 Flash Image with reference image
// Sends an existing asset as style reference + text prompt
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const OUT_DIR = path.join(ROOT, "public/assets/_pilot");

const envText = await fs.readFile(path.join(ROOT, ".env.local"), "utf8");
const env = Object.fromEntries(
  envText.split(/\r?\n/).filter((l) => l && !l.startsWith("#") && l.includes("="))
    .map((l) => { const i = l.indexOf("="); return [l.slice(0, i).trim(), l.slice(i + 1).trim()]; }),
);
const KEY = env.GEMINI_API_KEY;
const MODEL = "gemini-2.5-flash-image";
if (!KEY) { console.error("GEMINI_API_KEY missing"); process.exit(1); }

// 4 pilot prompts with reference image paths (relative to public/assets/)
// Each pilot picks the closest-style existing asset as style anchor
const PILOTS = [
  {
    id: "asd_early_calm",
    out: "characters/patient-infant/asd_early_calm.png",
    ref: "characters/patient-child/child_anxiety_calm.webp",
    refMime: "image/webp",
    instruction:
      "Match the EXACT art style of the reference image: kawaii cartoon illustration, " +
      "cell-shaded anime style, bold clean black outlines, vivid pastel colors, flat shading, " +
      "soft glowing background halo, clean white background, 1:1 square composition. " +
      "DO NOT use watercolor texture. " +
      "Generate a NEW character: a calm toddler age 2-3 with round chubby features and oversized head, " +
      "making gentle eye contact with a slight smile, sitting and playing with a small wooden toy block, " +
      "cute light-blue onesie pajamas with star pattern, soft teal-green ambient glow background. " +
      "This represents an autism-spectrum toddler in a calm engaged state.",
  },
  {
    id: "infant_play",
    out: "facilities-infant/infant_play.png",
    ref: "facilities/individual_room.webp",
    refMime: "image/webp",
    instruction:
      "Match the EXACT art style of the reference image: kawaii cartoon illustration, " +
      "cell-shaded, bold clean black outlines, vivid colors, flat shading, " +
      "isometric 3/4 cutaway view of a small interior room with three visible walls, " +
      "clean white background outside the room, 4:3 aspect ratio. " +
      "DO NOT use watercolor texture. " +
      "Generate a NEW interior: an infant developmental play room with baby pink and mint pastel walls, " +
      "thick interlocking soft foam floor mat in pink and cream, low open shelving with stacking rings " +
      "and soft blocks, large round safety mirror on left wall, cloud-and-star mobile hanging from ceiling, " +
      "rounded wooden activity cube in center, hand-painted bunny mural on accent wall, " +
      "warm rice-paper pendant lamp, no people.",
  },
  {
    id: "infant_bloom",
    out: "floors-infant/infant_bloom.png",
    ref: "floors-child/child_garden.webp",
    refMime: "image/webp",
    instruction:
      "Match the EXACT art style of the reference image: kawaii cartoon illustration, " +
      "cell-shaded, bold clean black outlines, vivid pastel colors, flat shading, " +
      "wide panoramic horizontal background, 16:9 aspect ratio. " +
      "DO NOT use watercolor texture. " +
      "Generate a NEW scene: a blooming playroom for toddlers, soft sage-green walls with hand-painted " +
      "wildflower mural (daisies tulips dandelions) across the back wall, hanging colorful felt mobiles " +
      "(butterflies birds flowers) suspended from ceiling, thick interlocking soft foam mat floor in " +
      "pastel green and cream, large arched windows on right with warm morning sunlight through sheer " +
      "white curtains, potted nursery plants on low shelves, wooden Montessori climbing arch in corner, " +
      "ceiling painted as blue sky with small white clouds, magical garden-like atmosphere, no people.",
  },
  {
    id: "play_room",
    out: "facilities-child/play_room.png",
    ref: "facilities/individual_room.webp",
    refMime: "image/webp",
    instruction:
      "Match the EXACT art style of the reference image: kawaii cartoon illustration, " +
      "cell-shaded, bold clean black outlines, vivid colors, flat shading, " +
      "isometric 3/4 cutaway view of a small interior room with three visible walls, " +
      "clean white background outside the room, 4:3 aspect ratio. " +
      "DO NOT use watercolor texture. " +
      "Generate a NEW interior: a child play therapy room with warm yellow and sky-blue accent walls, " +
      "colorful wooden toy shelves along back wall with labeled bins (red blue yellow green), " +
      "sand tray therapy table with miniature figurines in center, Victorian-style dollhouse in corner, " +
      "art corner with crayons and finger paint in mason jars, soft cream carpet with rainbow hopscotch mat, " +
      "cloud-shaped ceiling lamp, hand-painted rabbit-fox-owl mural on left wall, no people.",
  },
];

async function generate(item) {
  const refPath = path.join(ROOT, "public/assets", item.ref);
  const refBuf = await fs.readFile(refPath);
  const refB64 = refBuf.toString("base64");

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${KEY}`;
  const body = {
    contents: [{
      parts: [
        { inline_data: { mime_type: item.refMime, data: refB64 } },
        { text: item.instruction },
      ],
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
    throw new Error(`HTTP ${res.status}: ${txt.slice(0, 300)}`);
  }
  const json = await res.json();
  const parts = json?.candidates?.[0]?.content?.parts ?? [];
  const imgPart = parts.find((p) => p.inlineData || p.inline_data);
  const b64 = imgPart?.inlineData?.data ?? imgPart?.inline_data?.data;
  if (!b64) throw new Error(`no image in response: ${JSON.stringify(json).slice(0, 400)}`);
  return Buffer.from(b64, "base64");
}

await fs.mkdir(OUT_DIR, { recursive: true });
console.log(`Model: ${MODEL} (with reference image)`);
console.log(`Output: ${OUT_DIR}\n`);

for (const item of PILOTS) {
  const outFile = path.join(OUT_DIR, item.out.replace(/\.png$/, "_ref.png"));
  await fs.mkdir(path.dirname(outFile), { recursive: true });
  process.stdout.write(`[${item.id}] ref=${path.basename(item.ref)} ... `);
  const t0 = Date.now();
  try {
    const buf = await generate(item);
    await fs.writeFile(outFile, buf);
    console.log(`OK ${(buf.length / 1024).toFixed(0)}KB ${((Date.now() - t0) / 1000).toFixed(1)}s`);
  } catch (e) {
    console.log(`FAIL`);
    console.error(`  ${e.message}\n`);
  }
}
console.log(`\nDone. Files in: public/assets/_pilot/ (with _ref suffix)`);
