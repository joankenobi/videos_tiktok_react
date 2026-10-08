const fs = require("fs");
const path = require("path");
const { execSync, execFileSync } = require("child_process");

class ImageToWork {
  constructor(relPath, name, width, height, fileSizeBytes, sizeOnDisk) {
    this.relPath = relPath;
    this.name = name;
    this.width = width;
    this.height = height;
    this.fileSizeBytes = fileSizeBytes;
    this.sizeOnDisk = sizeOnDisk;
  }

  getRelPath() {
    return this.relPath;
  }
  getName() {
    return this.name;
  }
  getWidth() {
    return this.width;
  }
  getHeight() {
    return this.height;
  }
  getSize() {
    return this.fileSizeBytes;
  }
  getSizeOnDisk() {
    return this.sizeOnDisk;
  }
}

function collectJpgFiles(dir, found = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      collectJpgFiles(full, found);
    } else if (entry.isFile() && entry.name.toLowerCase().endsWith(".jpg")) {
      found.push(full);
    }
  }
  return found;
}

function toPosix(p) {
  return p.split(path.sep).join("/");
}

function getUniqueBy(arr, keyFn) {
  return [...new Map(arr.map((item) => [keyFn(item), item])).values()];
}

let imageToWork = [];
let imageTofilter = [];

const publicDir = path.join(__dirname, "public");
const basePath = "locations\\jobsencaracas";
const tiktokChannel = "@warc1233";
const dir = path.join(publicDir, basePath);

if (!fs.existsSync(dir)) {
  console.error(`❌ Base folder not found: ${dir}`);
  process.exit(1);
}

const files = collectJpgFiles(dir).sort();

if (files.length === 0) {
  console.error(`❌ No .jpg files found (recursively) under: ${dir}`);
  process.exit(1);
}

console.log(`📂 Found ${files.length} .jpg file(s) under ${basePath}`);

files.forEach((filepath) => {
  const name = path.basename(filepath);
  const relPath = toPosix(path.relative(publicDir, filepath));
  try {
    const result = execFileSync("magick", ["identify", "-format", "%w %h %b", filepath], {
      encoding: "utf8",
    })
      .trim()
      .split(" ", 3);
    const width = result[0];
    const height = result[1];
    const fileSizeBytes = result[2];
    const stats = fs.statSync(filepath);
    const fileSizeBytes2 = stats.size; // logical size (same as %b)
    // If you need size on disk:
    const blockSize = stats.blksize || 4096;
    const sizeOnDisk = Math.ceil(stats.size / blockSize) * blockSize;
    console.log(fileSizeBytes);
    console.log(blockSize);
    console.log(fileSizeBytes2);

    imageToWork.push(
      new ImageToWork(relPath, name, width, height, fileSizeBytes, sizeOnDisk),
    );
    console.log(result);
  } catch (e) {
    console.log(relPath + ": ERROR - " + e.message);
  }
});

const uniqueByDimensionsSize = getUniqueBy(
  imageToWork,
  (img) => `${img.getWidth()}x${img.getHeight()}x${img.getSize()}`,
);

console.log(imageToWork.length);
console.log(uniqueByDimensionsSize.length);
const duplicatesSkipped = imageToWork.length - uniqueByDimensionsSize.length;
if (duplicatesSkipped > 0) {
  console.log(`♻️  Skipped ${duplicatesSkipped} duplicate(s) (same WxH + byte size)`);
}
// console.log(uniqueByDimensionsSize);
// imageToWork.forEach((img) => {

//   console.log(imageToWork.length)
//   console.log(imageToWork[0].name)

// })

let ok = 0;
let failed = 0;

uniqueByDimensionsSize.forEach((img, index) => {
  const relPath = img.getRelPath();
  const outputRelPath = relPath.replace(/\.jpg$/i, ".png");
  const cmd = `npm run render:job-offer -- --still true --frame 0 --image "${relPath}" --hide-watermark --auto-fit true --image-width ${img.width} --image-height ${img.height} --show-text false -o "out/${outputRelPath}" --company-name "${tiktokChannel}"`;

  console.log(
    `\n[${index + 1}/${uniqueByDimensionsSize.length}] Rendering ${relPath} (${img.width}x${img.height}) as still image...`,
  );
  console.log(`Command: ${cmd}\n`);

  try {
    execSync(cmd, {
      stdio: "inherit",
      cwd: __dirname,
    });

    /* stdio: 'inherit'
    Por defecto, cuando ejecutas un comando desde Node.js, los resultados y los errores ocurren "en silencio" dentro del proceso. Al poner 'inherit' (heredar), le estás diciendo: "Muestra la salida y los errores de este comando directamente en la misma pantalla/terminal donde ejecuté mi script de Node". Si el comando muestra una barra de progreso o texto en la consola, lo verás en tiempo real.*/

    /*cwd: __dirname
    cwd significa Current Working Directory (Directorio de Trabajo Actual). __dirname es la carpeta donde vive este script, así que el comando se ejecuta siempre desde la raíz del proyecto, sin importar desde dónde lo llames.*/

    ok++;
    console.log(`\n✅ Completed: ${outputRelPath}`);
  } catch (e) {
    failed++;
    console.error(`\n❌ Failed: ${relPath} - ${e.message}`);
  }
});

console.log(
  `\n${failed === 0 ? "🎉" : "⚠️"}  ${ok} rendered, ${failed} failed, ${duplicatesSkipped} duplicate(s) skipped, ${imageToWork.length} image(s) scanned.`,
);

if (ok > 0) {
  const playSong = String.raw`powershell -c "(New-Object Media.SoundPlayer 'C:\Windows\Media\tada.wav').PlaySync()"`;
  try {
    execSync(playSong);
    execSync(playSong);
    execSync(playSong);
  } catch {
    // audio is cosmetic; never abort the batch
  }
}

process.exitCode = failed === 0 ? 0 : 1;

// for run node get-dimensions.js

// Error con god of war:

// > template-helloworld@1.0.0 render:job-offer
// > ts-node render-tiktok-job-offer.ts --still true --frame 0 --image 20260720/219591_20260720.jpg --watermark watermark.PNG --auto-fit true --image-width 905 --image-height 1280 --show-text false -o out/20260720/219591_20260720.png

// (node:28552) [MODULE_TYPELESS_PACKAGE_JSON] Warning: Module type of file:///c:/Users/Public/Documents/Programacion/remotion-video/render-tiktok-job-offer.ts is not specified and it doesn't parse as CommonJS.
// Reparsing as ES module because module syntax was detected. This incurs a performance overhead.
// To eliminate this warning, add "type": "module" to c:\Users\Public\Documents\Programacion\remotion-video\package.json.
// (Use `node --trace-warnings ...` to show where the warning was created)
// 📦 Bundling composition...
// ❌ Render failed: Error: ENOSPC: no space left on device, copyfile 'c:\Users\Public\Documents\Programacion\remotion-video\public\God of war.mp4' -> 'C:\Users\joan\AppData\Local\Temp\remotion-webpack-bundle-S14Acr\public\God of war.mp4'
//     at async Object.copyFile (node:internal/fs/promises:622:10)
//     at async Promise.all (index 0)
//     at async copyDir (c:\Users\Public\Documents\Programacion\remotion-video\node_modules\@remotion\bundler\dist\copy-dir.js:31:34)
//     at async internalBundle (c:\Users\Public\Documents\Programacion\remotion-video\node_modules\@remotion\bundler\dist\bundle.js:203:9)
//     at async bundle (c:\Users\Public\Documents\Programacion\remotion-video\node_modules\@remotion\bundler\dist\bundle.js:265:20)
//     at async main (file:///c:/Users/Public/Documents/Programacion/remotion-video/render-tiktok-job-offer.ts:179:15) {
//   errno: -4055,
//   code: 'ENOSPC',
//   syscall: 'copyfile',
//   path: 'c:\\Users\\Public\\Documents\\Programacion\\remotion-video\\public\\God of war.mp4',
//   dest: 'C:\\Users\\joan\\AppData\\Local\\Temp\\remotion-webpack-bundle-S14Acr\\public\\God of war.mp4'
// }

// ❌ Failed: 219591_20260720.jpg - Command failed: npm run render:job-offer -- --still true --frame 0 --image "20260720/219591_20260720.jpg" --watermark "watermark.PNG" --auto-fit true --image-width 905 --image-height 1280 --show-text false -o out/20260720/219591_20260720.png

// [59/123] Rendering 219592_20260720.jpg (905x1280) as still image...
// Command: npm run render:job-offer -- --still true --frame 0 --image "20260720/219592_20260720.jpg" --watermark "watermark.PNG" --auto-fit true --image-width 905 --image-height 1280 --show-text false -o out/20260720/219592_20260720.png
