const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const REPO_ROOT = __dirname;

const CLIPS = [
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
  {
    src: "dance2.mp4",
    title: "Clip 2",
    dancer: "Dancer 2",
    style: "Style 2",
    location: "Location 2",
    themeColor: "#3b82f6",
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
  {
    src: "dance3.mp4",
    title: "Clip 3",
    dancer: "Dancer 3",
    style: "Style 3",
    location: "Location 3",
    themeColor: "#f59e0b",
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
  {
    src: "dance4.mp4",
    title: "Clip 4",
    dancer: "Dancer 4",
    style: "Style 4",
    location: "Location 4",
    themeColor: "#ec4899",
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

const clipsJsonPath = path.join(REPO_ROOT, "dance-clips.json");
fs.writeFileSync(clipsJsonPath, JSON.stringify(CLIPS, null, 2));
console.log(`✅ Wrote clips JSON to: ${clipsJsonPath}`);
console.log(`   ${CLIPS.length} clips configured\n`);

const cmd = `npm run render:dance -- --clips dance-clips.json --music-volume 0 --show-progress-bar false -o out/dance-compilation.mp4`;
console.log(`Command: ${cmd}\n`);

try {
  execSync(cmd, {
    stdio: "inherit",
    cwd: REPO_ROOT,
  });

  console.log("\n✅ Dance compilation rendered successfully!");
} catch (e) {
  console.error(`\n❌ Render failed: ${e.message}`);
  process.exit(1);
}

console.log("\n🎉 All done!");
const playSong =
  'powershell -c "(New-Object Media.SoundPlayer \'C:\\Windows\\Media\\tada.wav\').PlaySync()"';
execSync(playSong);
execSync(playSong);
execSync(playSong);

// for run node render-dance-clips.js