const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const REPO_ROOT = __dirname;

const colors = [  "#fe2c55", "#3b82f6", "#f59e0b", "#ec4899",
  "#10b981", "#8b5cf6", "#f97316", "#06b6d4", "#eab308", "#ef4444",
  "#22c55e", "#a855f7", "#f43f5e", "#14b8a6", "#fbbf24", "#fb923c",
  "#6366f1", "#d946ef", "#0ea5e9", "#84cc16", "#f472b6", "#34d399",
  "#f87171", "#60a5fa", "#fcd34d", "#c084fc", "#fca5a5", "#93c5fd",
  "#fde047", "#a78bfa", "#fdba74", "#bfdbfe", "#fecaca", "#dbeafe",
  "#fef08a", "#e9d5ff", "#ffedd5", "#dcfce7", "#fce7f3", "#fef3c7",
  "#f3e8ff", "#ecfdf5", "#fdf4ff", "#fff7ed", "#f0fdf4", "#faf5ff",
  "#fefce8", "#f5f3ff", "#ecfeff", "#fef2f2", "#f0f9ff", "#f7fee7"]

const FunnyWords = [
  "Ravishing", "Enticing", "Bewitching", "Enthralling", "Spellbinding", "Irresistible", "Magnetic", "Charismatic", "Charming", "Winsome",
  "Delightful", "Delectable", "Scrumptious", "Luscious", "Succulent", "Mouthwatering", "Tantalizing", "Appetizing", "Savory", "Zestful",
  "Vivacious", "Bubbly", "Effervescent", "Sparkling", "Shimmering", "Gleaming", "Radiant", "Luminous", "Incandescent", "Brilliant",
  "Stunning", "Striking", "Arresting", "Commanding", "Dominant", "Powerful", "Potent", "Forceful", "Compelling", "Gripping",
  "Riveting", "Absorbing", "Engrossing", "Fascinating", "Captivating", "Enchanting", "Mesmerizing", "Hypnotic", "Bewildering", "Dizzying",
  "Head-spinning", "Heart-racing", "Pulse-pounding", "Breathless", "Weak-kneed", "Swooning", "Fluttering", "Trembling", "Quivering", "Shivering",
  "Electric", "Voltaic", "Galvanic", "Sparking", "Crackling", "Sizzling", "Fizzing", "Bubbling", "Simmering", "Boiling",
  "Sizzling", "Steamy", "Sensual", "Smoldering", "Seductive", "Alluring", "Flirty", "Vampy", "Sassy", "Chic",
  "Daring", "Sleek", "Vixen", "Mischief", "Siren", "Provoke", "Velvet", "Glow", "Radiant", "Magnetic",
  "Captivating", "Enchanting", "Breathtaking", "Fierce", "Wild", "Bold", "Playful", "Teasing", "Lush", "Slinky",
  "Seduce", "Bliss", "Dreamy", "Hypnotic", "Intense", "Striking", "Beguiling", "Tempting", "Mesmerizing", "Dazzling",
  "Glamour", "Piquant", "Zesty", "Spicy", "Juicy", "Seductive", "Alluring", "Vixen", "Sultry", "Provocative",
  "Velvety", "Glossy", "Lustrous", "Dapper", "Swank", "Posh", "Opulent", "Silky", "Supple", "Smooth",
  "Fiery", "Passionate", "Desire", "Burning", "Hot", "Blazing", "Stealthy", "Smoothie", "Foxy", "Stunning",
  "Divine", "Gorgeous", "Exotic", "Pulsing", "Thumping", "Throb", "Rhythmic", "Groovy", "Funkadelic", "Electric",
  "Voltage", "Charged", "Dynamic", "Vibrant", "Exhilarating", "Thrilling", "Sensational", "Peerless", "Sublime", "Heavenly",
  "Audacious", "Reckless", "Untamed", "Fearless", "Unstoppable", "Effervescent", "Spirited", "Vigorous", "Bouncing", "Jubilant"
];
class Clip {
  constructor(src, title) {
    this.src = src,
    this.title = title,
    this.dancer = FunnyWords[Math.floor(Math.random() * colors.length)],
    this.style= "Follow",
    this.location= "Me",
    this.themeColor= colors[Math.floor(Math.random() * colors.length)],
    this.textDelay= 10,
    this.featured= false,
    this.startFrom= 0,
    this.muted= false,
    this.volume= 1,
    this.fit= "cover",
    this.backgroundColor= "black",
    this.blurBackground= false,
    this.blurAmount= 40,
    this.opacity= 1,
    this.playbackRate= 1
  }
}

const basePath = "puveb";
const tiktokChannel = "@trabajosvenezuela";
const dir = `c:\\Users\\Public\\Documents\\Programacion\\remotion-video\\public\\${basePath}`;
const getFilesRecursive = (folder) => {
  let results = [];
  const list = fs.readdirSync(folder, { withFileTypes: true });
  list.forEach((file) => {
    const filePath = path.join(folder, file.name);
    if (file.isDirectory()) {
      results = results.concat(getFilesRecursive(filePath));
    } else if (file.name.endsWith(".mp4")) {
      results.push(filePath);
    }
  });
  return results;
};
const files = getFilesRecursive(dir);

console.log(files);
let allClipGroups = [];

for (let i = 0; i < files.length; i += 4) {
  let chunk = files.slice(i, i + 4);
  let group = chunk.map((file, index) => {
    // Usar ruta relativa respecto a public o solo el nombre relativo si se requiere
    let relativePath = path.relative(path.join(REPO_ROOT, "public"), file).replace(/\\/g, "/");
    return new Clip(relativePath, `I love Dance ${i + index + 1}`);
  });
  allClipGroups.push(group);
}

allClipGroups=shuffleArrayImmutable(allClipGroups)

console.log(`Total de grupos creados: ${allClipGroups.length}`);
console.log(`Total de grupos creados: ${allClipGroups}`);

// Usamos el primer grupo o aplanamos según convenga para la renderización
const CLIPS = allClipGroups.length > 0 ? allClipGroups[0] : [
  {
    src: "dance1.mp4",
    title: "Clip 1",
    dancer: "Dancer 1",
    style: "Style 1",
    location: "Location 1",
    themeColor: "#fe2c55",
    textDelay: 10,
    featured: false,
    startFrom: 0,
    muted: false,
    volume: 1,
    fit: "cover",
    backgroundColor: "black",
    blurBackground: false,
    blurAmount: 40,
    opacity: 1,
    playbackRate: 1,
  },
];

console.log("🎬 Dance Compilation — Batch Render");
console.log("====================================\n");

i=0

allClipGroups.forEach((CLIPS) =>{

  const clipsJsonPath = path.join(REPO_ROOT, "dance-clips.json");
  fs.writeFileSync(clipsJsonPath, JSON.stringify(CLIPS, null, 2));
  console.log(`✅ Wrote clips JSON to: ${clipsJsonPath}`);
  console.log(`   ${CLIPS.length} clips configured\n`);
  
  const cmd = `npm run render:dance -- --clips dance-clips.json --music-volume 0 --show-progress-bar false -o out/dance-compilation${i}.mp4`;
  console.log(`Command: ${cmd}\n`);
  
  try {
    execSync(cmd, {
      stdio: "inherit",
      cwd: REPO_ROOT,
    });
    
    console.log("\n✅ Dance compilation rendered successfully!");
  } catch (e) {
    console.error(`\n❌ Render failed: ${e.message}`);
  }
  
  i=i+1
})
console.log("\n🎉 All done!");
const playSong =
  'powershell -c "(New-Object Media.SoundPlayer \'C:\\Windows\\Media\\tada.wav\').PlaySync()"';
execSync(playSong);
execSync(playSong);
execSync(playSong);

// for run node render-dance-clips.js

function shuffleArrayImmutable(array) {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}