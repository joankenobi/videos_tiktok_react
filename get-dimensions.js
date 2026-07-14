const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class ImageToWork{

  constructor( name, width, height) {
    this.name = name;
    this.width = width;
    this.height = height;
  }

  getName(){
    return this.name
  }
  getWidth(){
    return this.width
  }
  getHeight(){
    return this.height
  }

};

let imageToWork = [];

const basePath = '20260714';
const dir = `c:\\Users\\Public\\Documents\\Programacion\\remotion-video\\public\\${basePath}`;
const files = fs.readdirSync(dir).filter(f => f.endsWith('.jpg'));

files.forEach(file => {
  const filepath = path.join(dir, file);
  try {
    const result = execSync('magick identify -format "%w %h" "' + filepath + '"', { encoding: 'utf8' }).trim().split(" ", 2);
    const width = result[0];
    const height = result[1];
    console.log(result);
    console.log(width);
    imageToWork.push(new ImageToWork(file, width, height))
  } catch (e) {
    console.log(file + ': ERROR - ' + e.message);
  }
});

// imageToWork.forEach((img) => {

//   console.log(imageToWork.length)
//   console.log(imageToWork[0].name)

// })

imageToWork.forEach((img, index) => {
  const outputName = img.name.replace('.jpg', '.png');
  const cmd = `npm run render:job-offer -- --still true --frame 0 --image "${basePath}/${img.name}" --watermark "watermark.PNG" --auto-fit true --image-width ${img.width} --image-height ${img.height} --show-text false -o out/${basePath}/${outputName}`;
  
  console.log(`\n[${index + 1}/${imageToWork.length}] Rendering ${img.name} (${img.width}x${img.height}) as still image...`);
  console.log(`Command: ${cmd}\n`);
  
  try {
    execSync(cmd, { stdio: 'inherit', cwd: 'c:\\Users\\Public\\Documents\\Programacion\\remotion-video' });
    
    /* stdio: 'inherit'
    Por defecto, cuando ejecutas un comando desde Node.js, los resultados y los errores ocurren "en silencio" dentro del proceso. Al poner 'inherit' (heredar), le estás diciendo: "Muestra la salida y los errores de este comando directamente en la misma pantalla/terminal donde ejecuté mi script de Node". Si el comando muestra una barra de progreso o texto en la consola, lo verás en tiempo real.*/
    
    /*cwd: 'c:\\Users\\Public\\Documents\\...'
    cwd significa Current Working Directory (Directorio de Trabajo Actual). Le indica a Node.js en qué carpeta exacta de tu disco duro debe pararse antes de ejecutar el comando cmd. Es el equivalente a hacer un cd c:\Users\Public\... en la terminal antes de correr tu comando. (Nota cómo usa doble barra invertida \\ para escapar el carácter en Windows).*/
    
    console.log(`\n✅ Completed: ${outputName}`);
    
  } catch (e) {
    console.error(`\n❌ Failed: ${img.name} - ${e.message}`);
  }
});

console.log('\n🎉 All renders completed!');

// for run node get-dimensions.js   