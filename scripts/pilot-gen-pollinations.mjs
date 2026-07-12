// Pilot asset generation via Pollinations.ai (no key required)
// Usage: node scripts/pilot-gen-pollinations.mjs
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const OUT_DIR = path.join(ROOT, "public/assets/_pilot");

const STYLE_INFANT_CHAR =
  "soft watercolor illustration, ultra kawaii style, very round features, oversized head, " +
  "chubby cheeks, soft dreamy pastel palette, toddler age 1-5, clean white background, no text, no watermark";
const STYLE_INFANT_FAC =
  "soft watercolor illustration, soft dreamy pastel palette, nurturing infant-safe interior, " +
  "baby pink and mint accents, rounded furniture, gentle diffused light, no text, no watermark";
const STYLE_CHILD_FAC =
  "soft watercolor illustration, bright cheerful pastel palette, child-friendly interior, " +
  "warm yellow and sky-blue accents, natural light, playful safe atmosphere, no text, no watermark";

// Pollinations supports w/h params; use Flux model
const PILOTS = [
  { id: "asd_early_calm", out: "characters/patient-infant/asd_early_calm.png", w: 512, h: 512,
    prompt: `${STYLE_INFANT_CHAR}, toddler age 2-4 making gentle eye contact slight smile playing with toy, soft teal ambient lighting, infant developmental center patient` },
  { id: "infant_play", out: "facilities-infant/infant_play.png", w: 768, h: 576,
    prompt: `${STYLE_INFANT_FAC}, infant developmental play room, thick soft foam mat floor in pastel pink and cream, baby-safe developmental toys on low open shelving, large safety mirror at toddler height, cloud-and-star mobile from ceiling, hand-painted bunny mural on wall, no people` },
  { id: "infant_bloom", out: "floors-infant/infant_bloom.png", w: 1024, h: 576,
    prompt: `wide panoramic watercolor illustration, soft dreamy pastel palette, blooming playroom for toddlers, sage-green walls with hand-painted wildflower mural daisies tulips, hanging colorful felt mobiles butterflies birds flowers, thick foam mat floor pastel green, large arched windows on right with morning sunlight, wooden Montessori climbing arch, ceiling painted as blue sky, magical garden atmosphere, no people` },
  { id: "play_room", out: "facilities-child/play_room.png", w: 768, h: 576,
    prompt: `${STYLE_CHILD_FAC}, child play therapy room, colorful wooden toy shelves with labeled bins, sand tray therapy table with miniature figurines, Victorian-style dollhouse in corner, art corner with crayons, soft cream carpet with rainbow hopscotch mat, cloud-shaped ceiling lamp, hand-painted animal mural rabbit fox owl, no people` },
];

async function generate(item) {
  // Pollinations API: /prompt/{encoded}?width=X&height=Y&model=flux&nologo=true&seed=N
  const seed = 42;
  const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(item.prompt)}` +
    `?width=${item.w}&height=${item.h}&model=flux&nologo=true&seed=${seed}&enhance=true`;
  const res = await fetch(url, { method: "GET" });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < 1000) throw new Error(`tiny response ${buf.length}b`);
  return buf;
}

await fs.mkdir(OUT_DIR, { recursive: true });
console.log(`Service: Pollinations.ai (Flux)`);
console.log(`Output: ${OUT_DIR}\n`);

for (const item of PILOTS) {
  const outFile = path.join(OUT_DIR, item.out);
  await fs.mkdir(path.dirname(outFile), { recursive: true });
  process.stdout.write(`[${item.id}] (${item.w}x${item.h}) generating... `);
  const t0 = Date.now();
  try {
    const buf = await generate(item);
    await fs.writeFile(outFile, buf);
    console.log(`OK ${(buf.length / 1024).toFixed(0)}KB ${((Date.now() - t0) / 1000).toFixed(1)}s`);
  } catch (e) {
    console.log(`FAIL ${e.message}`);
  }
}
console.log(`\nDone. Files in: public/assets/_pilot/`);
