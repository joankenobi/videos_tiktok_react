#!/usr/bin/env node
/**
 * CLI for rendering TikTokJobOffer composition
 * Usage: npx ts-node render-tiktok-job-offer.ts --image "oferta de trabajo.jpg" --watermark "watermark.png" [options]
 */

import { Command } from 'commander';
import { renderMedia, renderStill, selectComposition } from '@remotion/renderer';
import { bundle } from '@remotion/bundler';
import path from 'path';

// Get __dirname equivalent for ES modules
const __dirname = path.resolve();

interface RenderOptions {
  image: string;
  watermark: string;
  output?: string;
  jobTitle?: string;
  companyName?: string;
  location?: string;
  salary?: string;
  contractType?: string;
  experienceLevel?: string;
  requirements?: string[];
  benefits?: string[];
  ctaText?: string;
  primaryColor?: string;
  overlayOpacity?: string;
  music?: string;
  musicVolume?: string;
  showText?: string;
  autoFit?: string;
  imageWidth?: string;
  imageHeight?: string;
  zoomStart?: string;
  zoomEnd?: string;
  rotationStart?: string;
  rotationEnd?: string;
  kenBurns?: string;
  watermarkPosition?: string;
  watermarkOpacity?: string;
  watermarkSize?: string;
  still?: string;
  frame?: string;
}

const program = new Command();

program
  .name('render-tiktok-job-offer')
  .description('Render TikTok Job Offer video composition')
  .requiredOption('-i, --image <path>', 'Background image file (in public/ folder)')
  .requiredOption('-w, --watermark <path>', 'Watermark image file (in public/ folder)')
  .option('-o, --output <path>', 'Output video path', 'out/tiktok-job-offer.mp4')
  .option('--job-title <text>', 'Job title', 'Senior React Developer')
  .option('--company-name <text>', 'Company name', 'TechCorp Inc.')
  .option('--location <text>', 'Job location', 'Remote / San Francisco, CA')
  .option('--salary <text>', 'Salary range', '$140,000 - $180,000 / year')
  .option('--contract-type <text>', 'Contract type', 'Full-time')
  .option('--experience-level <text>', 'Experience level', 'Senior (5+ years)')
  .option('--requirements <items...>', 'Requirements list (comma-separated)', [])
  .option('--benefits <items...>', 'Benefits list (comma-separated)', [])
  .option('--cta-text <text>', 'Call to action text', 'Apply Now →')
  .option('--primary-color <hex>', 'Primary color (hex)', '#3b82f6')
  .option('--overlay-opacity <number>', 'Background overlay opacity (0-1)', '0')
  .option('--music <path>', 'Background music file (in public/ folder)')
  .option('--music-volume <number>', 'Music volume (0-1)', '0.3')
  .option('--show-text <boolean>', 'Show text overlays', 'true')
  .option('--auto-fit <boolean>', 'Auto-fit image to frame', 'false')
  .option('--image-width <number>', 'Image width for auto-fit')
  .option('--image-height <number>', 'Image height for auto-fit')
  .option('--zoom-start <number>', 'Ken Burns zoom start', '1')
  .option('--zoom-end <number>', 'Ken Burns zoom end', '1')
  .option('--rotation-start <number>', 'Ken Burns rotation start (deg)', '0')
  .option('--rotation-end <number>', 'Ken Burns rotation end (deg)', '0')
  .option('--ken-burns <boolean>', 'Enable Ken Burns effect', 'true')
  .option('--watermark-position <position>', 'Watermark position', 'bottom-right')
  .option('--watermark-opacity <number>', 'Watermark opacity (0-1)', '0.029')
  .option('--watermark-size <number>', 'Watermark size (px)', '800')
  .option('--still <boolean>', 'Render as still image instead of video', 'false')
  .option('--frame <number>', 'Frame number to render for still image', '0');

program.parse(process.argv);

const options = program.opts<RenderOptions>();

async function main() {
  // Validate required files exist in public folder
  const publicDir = path.join(__dirname, 'public');
  const imagePath = path.join(publicDir, options.image);
  const watermarkPath = path.join(publicDir, options.watermark);

  // Check if files exist
  const fs = await import('fs');
  if (!fs.existsSync(imagePath)) {
    console.error(`❌ Error: Background image not found at ${imagePath}`);
    console.error(`   Make sure "${options.image}" exists in the public/ folder`);
    process.exit(1);
  }
  if (!fs.existsSync(watermarkPath)) {
    console.error(`❌ Error: Watermark not found at ${watermarkPath}`);
    console.error(`   Make sure "${options.watermark}" exists in the public/ folder`);
    process.exit(1);
  }

  // Parse requirements and benefits from comma-separated strings if provided
  const reqArray = options.requirements || [];
  const benArray = options.benefits || [];
  
  const requirements = reqArray.length > 0 
    ? reqArray.flatMap(r => r.split(',').map(s => s.trim())).filter(Boolean)
    : [
        '5+ years of React/TypeScript experience',
        'Strong knowledge of Next.js and modern React patterns',
        'Experience with state management (Redux, Zustand, Jotai)',
        'Familiarity with testing (Jest, React Testing Library)',
        'Good understanding of CI/CD pipelines',
      ];

  const benefits = benArray.length > 0
    ? benArray.flatMap(b => b.split(',').map(s => s.trim())).filter(Boolean)
    : [
        'Competitive salary + equity package',
        'Fully remote with flexible hours',
        'Annual learning budget ($3,000)',
        'Health, dental & vision insurance',
        '401(k) matching + unlimited PTO',
      ];

  // Build input props for the composition
  const inputProps = {
    backgroundImage: options.image,
    backgroundType: 'image' as const,
    videoStartOffset: 0,
    backgroundZoomStart: parseFloat(options.zoomStart || '1.0'),
    backgroundZoomEnd: parseFloat(options.zoomEnd || '1.15'),
    backgroundPanXStart: 50,
    backgroundPanXEnd: 55,
    backgroundPanYStart: 50,
    backgroundPanYEnd: 45,
    backgroundRotationStart: parseFloat(options.rotationStart || '0'),
    backgroundRotationEnd: parseFloat(options.rotationEnd || '2'),
    enableKenBurns: options.kenBurns !== 'false',
    watermarkImage: options.watermark,
    watermarkPosition: (options.watermarkPosition as any) || 'bottom-right',
    watermarkOpacity: parseFloat(options.watermarkOpacity || '0.3'),
    watermarkSize: parseInt(options.watermarkSize || '120', 10),
    jobTitle: options.jobTitle,
    companyName: options.companyName,
    location: options.location,
    salary: options.salary,
    contractType: options.contractType,
    experienceLevel: options.experienceLevel,
    requirements,
    benefits,
    ctaText: options.ctaText,
    ctaLink: '',
    primaryColor: options.primaryColor,
    backgroundOverlayOpacity: parseFloat(options.overlayOpacity || '0.6'),
    backgroundMusic: options.music,
    musicVolume: parseFloat(options.musicVolume || '0.3'),
    showText: options.showText !== 'false',
    autoFitImage: options.autoFit === 'true',
    imageWidth: options.imageWidth ? parseInt(options.imageWidth, 10) : undefined,
    imageHeight: options.imageHeight ? parseInt(options.imageHeight, 10) : undefined,
  };

  console.log('📦 Bundling composition...');
  const bundleLocation = await bundle({
    entryPoint: path.join(__dirname, 'src', 'index.ts'),
    webpackOverride: (config) => config,
  });

  console.log('🎬 Selecting composition...');
  const composition = await selectComposition({
    serveUrl: bundleLocation,
    id: 'TikTokJobOffer',
    inputProps,
  });

  const isStill = options.still === 'true';
  const frameToRender = parseInt(options.frame || '0', 10);

  if (isStill) {
    console.log('🖼️  Rendering still image...');
    console.log(`   Output: ${options.output}`);
    console.log(`   Frame: ${frameToRender}`);
    console.log(`   Resolution: ${composition.width}x${composition.height}`);

    await renderStill({
      composition,
      serveUrl: bundleLocation,
      output: path.join(__dirname, options.output || 'out/tiktok-job-offer.png'),
      inputProps,
      frame: frameToRender,
    });

    console.log('✅ Still render complete!');
    console.log(`   Image saved to: ${path.join(__dirname, options.output || 'out/tiktok-job-offer.png')}`);
  } else {
    console.log('🎥 Rendering video...');
    console.log(`   Output: ${options.output}`);
    console.log(`   Duration: ${composition.durationInFrames} frames @ ${composition.fps}fps`);
    console.log(`   Resolution: ${composition.width}x${composition.height}`);

    await renderMedia({
      composition,
      serveUrl: bundleLocation,
      codec: 'h264',
      outputLocation: path.join(__dirname, options.output || 'out/tiktok-job-offer.mp4'),
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
    console.log(`   Video saved to: ${path.join(__dirname, options.output || 'out/tiktok-job-offer.mp4')}`);
  }
}

main().catch((err) => {
  console.error('❌ Render failed:', err);
  process.exit(1);
});

        