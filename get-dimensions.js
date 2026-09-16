const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

class ImageToWork {
  constructor(name, width, height, fileSizeBytes, sizeOnDisk) {
    this.name = name;
    this.width = width;
    this.height = height;
    this.fileSizeBytes = fileSizeBytes;
    this.sizeOnDisk = sizeOnDisk;
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

function getUniqueBy(arr, keyFn) {
  return [...new Map(arr.map((item) => [keyFn(item), item])).values()];
}

let imageToWork = [];
let imageTofilter = [];

const basePath = "locations";
const dir = `c:\\Users\\Public\\Documents\\Programacion\\remotion-video\\public\\${basePath}`;
const files = fs.readdirSync(dir).filter((f) => f.endsWith(".jpg"));

files.forEach((file) => {
  const filepath = path.join(dir, file);
  try {
    const result = execSync(
      'magick identify -format "%w %h %b" "' + filepath + '"',
      { encoding: "utf8" },
    )
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
      new ImageToWork(file, width, height, fileSizeBytes, sizeOnDisk),
    );
    console.log(result);
  } catch (e) {
    console.log(file + ": ERROR - " + e.message);
  }
});

const uniqueByDimensionsSize = getUniqueBy(
  imageToWork,
  (img) => `${img.getWidth()}x${img.getHeight()}x${img.getSize()}`,
);

console.log(imageToWork.length);
console.log(uniqueByDimensionsSize.length);
// console.log(uniqueByDimensionsSize);
// imageToWork.forEach((img) => {

//   console.log(imageToWork.length)
//   console.log(imageToWork[0].name)

// })

uniqueByDimensionsSize.forEach((img, index) => {
  const outputName = img.name.replace(".jpg", ".png");
  const cmd = `npm run render:job-offer -- --still true --frame 0 --image "${basePath}/${img.name}" --watermark "watermark.PNG" --auto-fit true --image-width ${img.width} --image-height ${img.height} --show-text false -o out/${basePath}/${outputName}`;

  console.log(
    `\n[${index + 1}/${uniqueByDimensionsSize.length}] Rendering ${img.name} (${img.width}x${img.height}) as still image...`,
  );
  console.log(`Command: ${cmd}\n`);

  try {
    execSync(cmd, {
      stdio: "inherit",
      cwd: "c:\\Users\\Public\\Documents\\Programacion\\remotion-video",
    });

    /* stdio: 'inherit'
    Por defecto, cuando ejecutas un comando desde Node.js, los resultados y los errores ocurren "en silencio" dentro del proceso. Al poner 'inherit' (heredar), le estás diciendo: "Muestra la salida y los errores de este comando directamente en la misma pantalla/terminal donde ejecuté mi script de Node". Si el comando muestra una barra de progreso o texto en la consola, lo verás en tiempo real.*/

    /*cwd: 'c:\\Users\\Public\\Documents\\...'
    cwd significa Current Working Directory (Directorio de Trabajo Actual). Le indica a Node.js en qué carpeta exacta de tu disco duro debe pararse antes de ejecutar el comando cmd. Es el equivalente a hacer un cd c:\Users\Public\... en la terminal antes de correr tu comando. (Nota cómo usa doble barra invertida \\ para escapar el carácter en Windows).*/

    console.log(`\n✅ Completed: ${outputName}`);
  } catch (e) {
    console.error(`\n❌ Failed: ${img.name} - ${e.message}`);
  }
});

console.log("\n🎉 All renders completed!");
playSong = "powershell -c \"(New-Object Media.SoundPlayer 'C:\Windows\Media\tada.wav').PlaySync()\""
execSync(playSong)
execSync(playSong)
execSync(playSong)

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
