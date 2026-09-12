import { Composition, renderMedia, selectComposition } from 'remotion';
import { DanceCompilation, danceCompilationSchema } from './DanceCompilation';
import { TikTokJobOffer } from './TikTokJobOffer';

// Example configuration for a 4-clip dance compilation
// Replace these with your actual video files in the public/ folder
export const danceCompilationConfig = {
  // Compilation metadata
  compilationTitle: 'DANCE COMPILATION',
  compilationSubtitle: 'Best moves of the week 🔥',
  primaryColor: '#fe2c55',    // TikTok pink
  secondaryColor: '#3b82f6',  // Blue accent
  
  // Audio
  backgroundMusic: 'background-music.mp3',  // Add to public/
  musicVolume: 0.35,
  
  // Transitions
  transitionStyle: 'crossfade',
  transitionDuration: 15, // frames
  
  // UI
  showProgressBar: true,
  showClipCounter: true,
  enableParticles: true,
  watermark: 'watermark.png',  // Add to public/
  watermarkOpacity: 0.25,
  
  // Clips - replace with your actual video files
  clips: [
    {
      // Clip 1
      src: 'dance1.mp4',           // Add to public/
      title: 'VIRAL HIP HOP',
      dancer: 'sarah.moves',
      style: 'Hip Hop',
      location: 'LA Studio',
      themeColor: '#fe2c55',
      startFrom: 1.5,              // Start at 1.5s into source video
      trimBefore: 0,               // Or use trimBefore in frames
      fit: 'cover',
      blurBackground: true,
      textDelay: 10,
      featured: true,
    },
    {
      // Clip 2
      src: 'dance2.mp4',
      title: 'SMOOTH CONTEMPORARY',
      dancer: 'alex.flow',
      style: 'Contemporary',
      location: 'NYC Rooftop',
      themeColor: '#3b82f6',
      startFrom: 0.8,
      fit: 'cover',
      blurBackground: true,
      textDelay: 10,
      featured: false,
    },
    {
      // Clip 3
      src: 'dance3.mp4',
      title: 'LATIN FUSION FIRE',
      dancer: 'maria.baile',
      style: 'Latin Fusion',
      location: 'Miami Beach',
      themeColor: '#f59e0b', // Amber
      startFrom: 2.2,
      fit: 'cover',
      blurBackground: true,
      textDelay: 10,
      featured: true,
    },
    {
      // Clip 4
      src: 'dance4.mp4',
      title: 'K-POP PERFECTION',
      dancer: 'jin.dance',
      style: 'K-Pop Cover',
      location: 'Seoul Practice Room',
      themeColor: '#ec4899', // Pink
      startFrom: 0,
      fit: 'cover',
      blurBackground: true,
      textDelay: 10,
      featured: false,
    },
  ],
} as const;

// Validate config at compile time
const _validatedConfig = danceCompilationSchema.parse(danceCompilationConfig);

// Calculate duration: ~8 seconds per clip + transitions = ~35 seconds for 4 clips
// At 30fps = 1050 frames
export const DURATION_IN_FRAMES = 1050;
export const FPS = 30;
export const WIDTH = 1080;
export const HEIGHT = 1920;

// Composition registration
export const DanceCompilationComposition = () => (
  <Composition
    id="dance-compilation"
    component={DanceCompilation}
    props={danceCompilationConfig}
    durationInFrames={DURATION_IN_FRAMES}
    fps={FPS}
    width={WIDTH}
    height={HEIGHT}
    defaultProps={danceCompilationConfig}
  />
);

// Alternative: Job Offer style composition (from your existing code)
export const JobOfferComposition = () => (
  <Composition
    id="tiktok-job-offer"
    component={TikTokJobOffer}
    props={{
      jobTitle: 'Senior Frontend Developer',
      companyName: 'TechCorp',
      location: 'San Francisco, CA',
      salary: '$150k - $200k',
      contractType: 'Full-time',
      experienceLevel: 'Senior',
      requirements: [
        '5+ years React/TypeScript',
        'GraphQL & REST APIs',
        'Testing (Jest, Cypress)',
        'CI/CD pipelines',
      ],
      benefits: [
        'Remote-first culture',
        'Learning budget $2k/yr',
        'Health & dental',
        '401k matching',
      ],
      backgroundImage: 'job-background.jpg',
      backgroundType: 'image',
      backgroundMusic: 'background-music.mp3',
    }}
    durationInFrames={450}
    fps={30}
    width={1080}
    height={1920}
  />
);

export default DanceCompilationComposition;