#!/usr/bin/env node
/**
 * CLI for rendering DanceCompilation composition
 * Usage: npx ts-node render-dance-compilation.ts --clips dance-clips.json [options]
 */

import { Command } from 'commander';
import { renderMedia, renderStill, selectComposition } from '@remotion/renderer';
import { bundle } from '@remotion/bundler';
import path from 'path';
import fs from 'fs';

const __dirname = path.resolve();

const CLIP_FIELDS = [
  'src', 'title', 'dancer', 'style', 'location', 'themeColor',
  'textDelay', 'featured', 'startFrom', 'trimBefore', 'trimAfter',
  'muted', 'volume', 'fit', 'backgroundColor', 'blurBackground',
  'blurAmount', 'opacity', 'playbackRate',
] as const;

const BOOLEAN_FIELDS = new Set([
  'featured', 'muted', 'blurBackground',
]);

const NUMBER_FIELDS = new Set([
  'textDelay', 'startFrom', 'trimBefore', 'trimAfter',
  'volume', 'blurAmount', 'opacity', 'playbackRate',
]);

function parseValue(value: string, field: string): unknown {
  if (BOOLEAN_FIELDS.has(field)) {
    return value === 'true';
  }
  if (NUMBER_FIELDS.has(field)) {
    return Number(value);
  }
  return value;
}

const program = new Command();

program
  .name('render-dance-compilation')
  .description('Render DanceCompilation video composition')
  .requiredOption('-c, --clips <path>', 'Path to JSON file with clips array')
  .option('-o, --output <path>', 'Output video path', 'out/dance-compilation.mp4')
  .option('-m, --background-music <path>', 'Background music file (in public/ folder)', 'background-music.mp3')
  .option('--music-volume <number>', 'Music volume (0-1)', '0.35')
  .option('--transition-style <style>', 'Transition style: crossfade|beat-snap|shader-wipe|zoom', 'crossfade')
  .option('--transition-duration <number>', 'Transition duration in frames', '15')
  .option('--compilation-title <text>', 'Compilation title', 'DANCE COMPILATION')
  .option('--compilation-subtitle <text>', 'Compilation subtitle', 'Best moves of the week')
  .option('--watermark <path>', 'Watermark image file (in public/ folder)')
  .option('--watermark-opacity <number>', 'Watermark opacity (0-1)', '0.3')
  .option('--primary-color <hex>', 'Primary color (hex)', '#fe2c55')
  .option('--secondary-color <hex>', 'Secondary color (hex)', '#3b82f6')
  .option('--show-progress-bar <boolean>', 'Show global progress bar', 'false')
  .option('--show-clip-counter <boolean>', 'Show clip counter', 'true')
  .option('--enable-particles <boolean>', 'Enable particle effects', 'true')
  .option('--still <boolean>', 'Render as still image instead of video', 'false')
  .option('--frame <number>', 'Frame number to render for still image', '0');

program.parse(process.argv);

const options = program.opts<Record<string, string>>();

function parseBool(val: string | undefined, fallback: boolean): boolean {
  if (val === undefined) return fallback;
  return val === 'true';
}

function parseNum(val: string | undefined, fallback: number): number {
  if (val === undefined) return fallback;
  const n = Number(val);
  return Number.isNaN(n) ? fallback : n;
}

async function main() {
  const publicDir = path.join(__dirname, 'public');

  // Load clips from JSON
  const clipsPath = path.resolve(options.clips);
  if (!fs.existsSync(clipsPath)) {
    console.error(`❌ Error: Clips file not found at ${clipsPath}`);
    process.exit(1);
  }

  const rawClips: unknown[] = JSON.parse(fs.readFileSync(clipsPath, 'utf-8'));
  if (!Array.isArray(rawClips) || rawClips.length < 1 || rawClips.length > 6) {
    console.error(`❌ Error: Clips JSON must be an array of 1-6 items (got ${Array.isArray(rawClips) ? rawClips.length : 'non-array'})`);
    process.exit(1);
  }

  for (let i = 0; i < rawClips.length; i++) {
    const clip = rawClips[i] as Record<string, unknown>;
    const missing = ['src', 'title', 'dancer', 'style'].filter((f) => !clip[f]);
    if (missing.length > 0) {
      console.error(`❌ Error: Clip at index ${i} is missing required fields: ${missing.join(', ')}`);
      process.exit(1);
    }
  }

  // Apply per-clip overrides from CLI flags
  const clips = rawClips.map((clip) => ({ ...(clip as Record<string, unknown>) }));
  for (let n = 1; n <= 6; n++) {
    for (const field of CLIP_FIELDS) {
      const flagName = `clip${n}-${field}`;
      if (options[flagName] !== undefined) {
        const idx = n - 1;
        if (idx < clips.length) {
          (clips[idx] as Record<string, unknown>)[field] = parseValue(options[flagName], field);
        }
      }
    }
  }

  // Validate clip sources exist
  for (let i = 0; i < clips.length; i++) {
    const clip = clips[i] as Record<string, unknown>;
    const srcPath = path.join(publicDir, clip.src as string);
    if (!fs.existsSync(srcPath)) {
      console.error(`❌ Error: Clip ${i + 1} source not found at ${srcPath}`);
      console.error(`   Make sure "${clip.src}" exists in the public/ folder`);
      process.exit(1);
    }
  }

  // Validate background music exists
  const musicPath = path.join(publicDir, options.backgroundMusic);
  if (!fs.existsSync(musicPath)) {
    console.error(`❌ Error: Background music not found at ${musicPath}`);
    console.error(`   Make sure "${options.backgroundMusic}" exists in the public/ folder`);
    process.exit(1);
  }

  // Log resolved clips summary
  console.log('\n📋 Clips to render:');
  clips.forEach((clip, i) => {
    const c = clip as Record<string, unknown>;
    console.log(`   [${i + 1}] ${c.src} — "${c.title}" by ${c.dancer} (${c.style})`);
  });
  console.log('');

  // Build input props
  const inputProps = {
    clips,
    backgroundMusic: options.backgroundMusic,
    musicVolume: parseNum(options.musicVolume, 0.35),
    transitionStyle: options.transitionStyle,
    transitionDuration: parseNum(options.transitionDuration, 15),
    showProgressBar: parseBool(options.showProgressBar, true),
    showClipCounter: parseBool(options.showClipCounter, true),
    compilationTitle: options.compilationTitle,
    compilationSubtitle: options.compilationSubtitle,
    watermark: options.watermark || undefined,
    watermarkOpacity: parseNum(options.watermarkOpacity, 0.3),
    enableParticles: parseBool(options.enableParticles, true),
    primaryColor: options.primaryColor,
    secondaryColor: options.secondaryColor,
  };

  console.log('📦 Bundling composition...');
  const bundleLocation = await bundle({
    entryPoint: path.join(__dirname, 'src', 'index.ts'),
    webpackOverride: (config) => config,
  });

  console.log('🎬 Selecting composition...');
  const composition = await selectComposition({
    serveUrl: bundleLocation,
    id: 'DanceCompilation',
    inputProps,
  });

  const isStill = options.still === 'true';
  const frameToRender = parseNum(options.frame, 0);
  const outputPath = path.join(__dirname, options.output);

  if (isStill) {
    console.log('🖼️  Rendering still image...');
    console.log(`   Output: ${options.output}`);
    console.log(`   Frame: ${frameToRender}`);
    console.log(`   Resolution: ${composition.width}x${composition.height}`);

    await renderStill({
      composition,
      serveUrl: bundleLocation,
      output: outputPath,
      inputProps,
      frame: frameToRender,
    });

    console.log('✅ Still render complete!');
    console.log(`   Image saved to: ${outputPath}`);
  } else {
    console.log('🎥 Rendering video...');
    console.log(`   Output: ${options.output}`);
    console.log(`   Duration: ${composition.durationInFrames} frames @ ${composition.fps}fps`);
    console.log(`   Resolution: ${composition.width}x${composition.height}`);

    await renderMedia({
      composition,
      serveUrl: bundleLocation,
      codec: 'h264',
      outputLocation: outputPath,
      inputProps,
      onProgress: (progress) => {
        const currentFrame = progress.renderedFrames;
        if (currentFrame % 30 === 0 || composition.durationInFrames - currentFrame < 30) {
          const percent = ((currentFrame / composition.durationInFrames) * 100).toFixed(1);
          console.log(`   Progress: ${percent}% (frame ${currentFrame}/${composition.durationInFrames})`);
        }
      },
    });

    console.log('✅ Render complete!');
    console.log(`   Video saved to: ${outputPath}`);
  }
}

main().catch((err) => {
  console.error('❌ Render failed:', err);
  process.exit(1);
});
