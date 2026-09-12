import React from 'react';
import {
  AbsoluteFill,
  Html5Audio,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from 'remotion';
import { z } from 'zod';
import { FittedVideo, fittedVideoSchema } from './FittedVideo';
import { GradientText, ShinyText, Particles, StarBorder } from './ReactBitsForRemotion';
import { loadFont } from '@remotion/google-fonts/SpaceGrotesk';
import { loadFont as loadInter } from '@remotion/google-fonts/Inter';
import { loadFont as loadMontserrat } from '@remotion/google-fonts/Montserrat';
import { Music, Sparkles, Zap, Heart, Award } from 'lucide-react';

let fontFamily = 'system-ui, sans-serif';
let bodyFont = 'system-ui, sans-serif';
let displayFont = 'system-ui, sans-serif';

try {
  const loaded = loadFont();
  const loadedInter = loadInter();
  const loadedMontserrat = loadMontserrat();
  fontFamily = loaded.fontFamily;
  bodyFont = loadedInter.fontFamily;
  displayFont = loadedMontserrat.fontFamily;
} catch (error) {
  console.warn('Google Fonts failed to load, using system fonts:', error);
}

/**
 * Schema for individual dance clip configuration
 */
export const danceClipSchema = fittedVideoSchema.extend({
  /** Display title for this clip */
  title: z.string(),
  /** Dancer name/handle */
  dancer: z.string(),
  /** Dance style/category */
  style: z.string(),
  /** Location or vibe tag */
  location: z.string().optional(),
  /** Color theme for this clip's overlays */
  themeColor: z.string().default('#fe2c55'),
  /** Delay before this clip's text animations start (frames) */
  textDelay: z.number().default(0),
  /** Whether to show "Featured" badge */
  featured: z.boolean().default(false),
});

export type DanceClipProps = z.infer<typeof danceClipSchema>;

/**
 * Main compilation schema
 */
export const danceCompilationSchema = z.object({
  /** Array of dance clips (3-4 recommended) */
  clips: z.array(danceClipSchema).min(1).max(6),
  /** Background music track */
  backgroundMusic: z.string(),
  /** Music volume (0-1) */
  musicVolume: z.number().min(0).max(1).default(0.35),
  /** Transition style between clips */
  transitionStyle: z.enum(['crossfade', 'beat-snap', 'shader-wipe', 'zoom']).default('crossfade'),
  /** Transition duration in frames */
  transitionDuration: z.number().default(15),
  /** Show global progress bar */
  showProgressBar: z.boolean().default(true),
  /** Show clip counter (1/4, 2/4, etc.) */
  showClipCounter: z.boolean().default(true),
  /** Compilation title */
  compilationTitle: z.string().default('DANCE COMPILATION'),
  /** Compilation subtitle */
  compilationSubtitle: z.string().default('Best moves of the week'),
  /** Watermark */
  watermark: z.string().optional(),
  /** Watermark opacity */
  watermarkOpacity: z.number().min(0).max(1).default(0.3),
  /** Enable particle effects */
  enableParticles: z.boolean().default(true),
  /** Color scheme */
  primaryColor: z.string().default('#fe2c55'),
  secondaryColor: z.string().default('#3b82f6'),
});

export type DanceCompilationProps = z.infer<typeof danceCompilationSchema>;

/**
 * Individual dance clip with overlays
 */
const DanceClip: React.FC<DanceClipProps & {
  isActive: boolean;
  progress: number;
  index: number;
  total: number;
  globalProgress: number;
}> = ({
  src,
  title,
  dancer,
  style,
  location,
  themeColor,
  startFrom = 0,
  trimBefore,
  trimAfter,
  fit = 'cover',
  muted = true,
  volume = 1,
  backgroundColor = 'black',
  blurBackground = false,
  blurAmount = 40,
  opacity = 1,
  playbackRate = 1,
  textDelay = 0,
  featured = false,
  isActive,
  progress,
  index,
  total,
  globalProgress,
}) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    // Entrance animation for text overlays
    const textEntrance = spring({
      frame: frame - textDelay,
      fps,
      config: { damping: 18, stiffness: 150 },
    });

    const titleSlide = interpolate(textEntrance, [0, 1], [60, 0], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
    const titleOpacity = interpolate(textEntrance, [0, 0.3, 1], [0, 0.8, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });

    const dancerSlide = interpolate(textEntrance, [0, 1], [40, 0], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
    const dancerOpacity = interpolate(textEntrance, [0, 0.4, 1], [0, 0.7, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });

    const styleSlide = interpolate(textEntrance, [0, 1], [30, 0], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
    const styleOpacity = interpolate(textEntrance, [0, 0.5, 1], [0, 0.6, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });

    // Featured badge pulse
    const badgeScale = featured ? 1 + Math.sin(frame / 8) * 0.1 : 1;

    // Progress ring for this clip
    const clipProgressRing = progress * 360;

    return (
      <AbsoluteFill style={{ position: 'relative', overflow: 'hidden' }}>
        {/* Video Layer - normalized to 1080x1920 */}
        <FittedVideo
          src={src}
          startFrom={startFrom}
          trimBefore={trimBefore}
          trimAfter={trimAfter}
          fit={fit}
          muted={muted}
          volume={volume}
          backgroundColor={backgroundColor}
          blurBackground={blurBackground}
          blurAmount={blurAmount}
          opacity={opacity}
          playbackRate={playbackRate}
        />

        {/* Dark gradient overlay for text readability */}
        <AbsoluteFill
          style={{
            background: 'linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.3) 65%, rgba(0,0,0,0.7) 100%)',
            pointerEvents: 'none',
          }}
        />

        {/* Top: Clip counter & progress ring */}
        <AbsoluteFill
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'center',
            paddingTop: '60px',
            pointerEvents: 'none',
          }}
        >
          {/* Clip counter */}
          {isActive && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '16px',
                opacity: titleOpacity,
                transform: `translateY(${titleSlide * 0.5}px)`,
              }}
            >
              <div
                style={{
                  width: '68px',
                  height: '68px',
                  borderRadius: '50%',
                  border: `3px solid ${themeColor}`,
                  borderRightColor: 'transparent',
                  animation: 'spin 0.01s linear infinite',
                  transform: `rotate(${clipProgressRing*2}deg)`,
                }}
              />
              <div style={{ textAlign: 'left' }}>
                <GradientText
                  colors={[themeColor, '#ffffff', themeColor]}
                  speedFrames={120}
                  startFrame={textDelay}
                  style={{ fontFamily, fontSize: '42px', fontWeight: 700, display: 'block' }}
                >
                  CLIP {index + 1} / {total}
                </GradientText>
                <div
                  style={{ fontFamily: bodyFont, fontSize: '34px', color: 'rgb(255, 255, 255)', marginTop: '2px', WebkitTextStroke: '0.2px rgb(114, 114, 114)' }}
                >
                  {Math.round(progress * 100)}% COMPLETE
                </div>
              </div>
            </div>
          )}

          {/* Featured badge */}
          {featured && isActive && (
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 20px',
                background: `linear-gradient(135deg, ${themeColor}22, ${themeColor}44)`,
                border: `1px solid ${themeColor}66`,
                borderRadius: '50px',
                backdropFilter: 'blur(10px)',
                opacity: titleOpacity,
                transform: `translateY(${titleSlide * 0.5}px) scale(${badgeScale})`,
                marginBottom: '16px',
              }}
            >
              <StarBorder size={18} color={themeColor} />
              <span style={{ fontFamily, fontSize: '16px', fontWeight: 700, color: themeColor, textTransform: 'uppercase', letterSpacing: '2px' }}>
                FEATURED
              </span>
            </div>
          )}
        </AbsoluteFill>

        {/* Bottom: Title, Dancer, Style */}
        <AbsoluteFill
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            alignItems: 'center',
            paddingBottom: '100px',
            paddingLeft: '60px',
            paddingRight: '60px',
            pointerEvents: 'none',
            textAlign: 'center',
          }}
        >
          {/* Main Title */}
          <div
            style={{
              opacity: titleOpacity,
              transform: `translateY(${-titleSlide}px)`,
              marginBottom: '8px',
              textShadow: '0 4px 24px rgba(0,0,0,0.9)',
            }}
          >
            <ShinyText
              text={title}
              color="#ffffff"
              shineColor={themeColor}
              speedFrames={100}
              startFrame={textDelay}
              style={{ fontFamily, fontSize: '72px', fontWeight: 800, display: 'inline-block', lineHeight: 1.1 }}
            />
          </div>

          {/* Dancer handle */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              opacity: dancerOpacity,
              transform: `translateY(${dancerSlide}px)`,
              marginBottom: '6px',
              textShadow: '0 2px 12px rgba(0,0,0,0.8)',
            }}
          >
            {dancer !== '' && (
              <Music size={50} color={themeColor} />
            )}
            <GradientText
              colors={['#ffffff', themeColor, '#ffffff']}
              speedFrames={150}
              startFrame={textDelay + 10}
              style={{ fontFamily: bodyFont, fontSize: '84px', fontWeight: 600, display: 'inline-block' }}
            >
              {dancer !== '' && (dancer)}
            </GradientText>
          </div>

          {/* Style & Location */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              flexWrap: 'wrap',
              justifyContent: 'center',
              opacity: styleOpacity,
              transform: `translateY(${styleSlide}px)`,
              textShadow: '0 2px 10px rgba(0,0,0,0.7)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 16px', background: 'rgba(0,0,0,0.5)', borderRadius: '20px', border: `1px solid ${themeColor}44` }}>
              <Zap size={50} color={themeColor} />
              <span style={{ fontFamily: bodyFont, fontSize: '48px', fontWeight: 500, color: '#ffffff' }}>{style}</span>
            </div>
            {location && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 16px', background: 'rgba(0,0,0,0.5)', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.1)' }}>
                <Heart size={50} color={themeColor} />
                <span style={{ fontFamily: bodyFont, fontSize: '48px', fontWeight: 400, color: '#e0e0e0' }}>{location}</span>
              </div>
            )}
          </div>
        </AbsoluteFill>
      </AbsoluteFill>
    );
  };

/**
 * Global progress bar at top of compilation
 */
const GlobalProgressBar: React.FC<{
  progress: number;
  totalClips: number;
  currentClip: number;
  primaryColor: string;
  secondaryColor: string;
}> = ({ progress, totalClips, currentClip, primaryColor, secondaryColor }) => {
  // const frame = useCurrentFrame();
  // const { fps, durationInFrames } = useVideoConfig(); La Ia los creo pero no son usados

  // Overall progress
  const overallProgress = (currentClip + progress) / totalClips;

  // Segment progress for each clip
  const segmentWidth = 100 / totalClips;

  return (
    <AbsoluteFill
      style={{
        display: 'flex',
        justifyContent: 'center',
        paddingTop: '20px',
        pointerEvents: 'none',
        zIndex: 100,
      }}
    >
      <div style={{ width: '90%', maxWidth: '900px', height: '6px', background: 'rgba(0,0,0,0.5)', borderRadius: '3px', overflow: 'hidden', position: 'relative' }}>
        {/* Completed segments */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            height: '100%',
            width: `${overallProgress * 100}%`,
            background: `linear-gradient(90deg, ${primaryColor}, ${secondaryColor})`,
            borderRadius: '3px',
            transition: 'width 0.1s linear',
          }}
        />
        {/* Segment dividers */}
        {Array.from({ length: totalClips - 1 }).map((_, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              top: 0,
              left: `${(i + 1) * segmentWidth}%`,
              height: '100%',
              width: '2px',
              background: 'rgba(255,255,255,0.3)',
              transform: 'translateX(-50%)',
            }}
          />
        ))}
        {/* Current clip indicator */}
        <div
          style={{
            position: 'absolute',
            top: '-4px',
            left: `${(currentClip + progress) / totalClips * 100}%`,
            width: '14px',
            height: '14px',
            borderRadius: '50%',
            background: primaryColor,
            border: '3px solid white',
            boxShadow: `0 0 12px ${primaryColor}`,
            transform: 'translateX(-50%)',
            zIndex: 10,
          }}
        />
      </div>
    </AbsoluteFill>
  );
};

/**
 * Compilation title card (shown at start)
 */
const TitleCard: React.FC<{
  title: string;
  subtitle: string;
  primaryColor: string;
  secondaryColor: string;
  delay: number;
}> = ({ title, subtitle, primaryColor, secondaryColor, delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({ frame: frame - delay, fps, config: { damping: 15, stiffness: 100 } });
  const scale = interpolate(entrance, [0, 1], [0.8, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const opacity = interpolate(entrance, [0, 0.5, 1], [0, 0.8, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  const titleSlide = interpolate(entrance, [0, 1], [40, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const subtitleSlide = interpolate(entrance, [0, 1], [30, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        opacity,
        transform: `scale(${scale + (frame / 1000)})`, //zoom to the tittle
        pointerEvents: 'none',
        zIndex: 200,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          marginBottom: '24px',
          opacity: entrance,
          transform: `translateY(${titleSlide}px)`,
        }}
      >
        <div style={{ width: '160px', height: '14px', background: `linear-gradient(90deg, ${primaryColor}, ${secondaryColor})`, borderRadius: '2px' }} />
        <Sparkles style={{ fontSize: '58px' }} />
        <div style={{ width: '160px', height: '14px', background: `linear-gradient(90deg, ${secondaryColor}, ${primaryColor})`, borderRadius: '2px' }} />
      </div>
      <GradientText
        colors={[primaryColor, '#ffffff', secondaryColor, '#ffffff', primaryColor]}
        speedFrames={200}
        startFrame={delay}
        style={{ fontFamily, fontSize: '102px', fontWeight: 800, textAlign: 'center', lineHeight: 1.1, textShadow: '0 8px 32px rgba(0,0,0,0.8)' }}
      >
        {title}
      </GradientText>
      <div
        style={{
          marginTop: '24px',
          opacity: entrance,
          transform: `translateY(${subtitleSlide}px)`,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
          <ShinyText
            text={subtitle}
            color="#fcfcfc"
            shineColor={primaryColor}
            speedFrames={20}
            startFrame={delay + 20}
            style={{ fontFamily: displayFont, fontSize: '58px', fontWeight: 600, display: 'inline-block' }}
          />
          <span style={{ fontSize: '58px' }}>🔥🔥🔥</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/**
 * Main Dance Compilation Composition
 */
export const DanceCompilation: React.FC<DanceCompilationProps> = ({
  clips,
  backgroundMusic,
  musicVolume = 0.35,
  transitionStyle = 'crossfade',
  transitionDuration = 15,
  showProgressBar = true,
  showClipCounter = true,
  compilationTitle = 'DANCE COMPILATION',
  compilationSubtitle = 'Best moves of the week',
  watermark,
  watermarkOpacity = 0.3,
  enableParticles = true,
  primaryColor = '#fe2c55',
  secondaryColor = '#3b82f6',
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames, width, height } = useVideoConfig();

  const totalClips = clips.length;
  const clipDuration = Math.floor(durationInFrames / totalClips);
  const transitionFrames = transitionDuration;

  // Calculate which clip is active and transition progress
  let currentClipIndex = 0;
  let clipProgress = 0;
  let isTransitioning = false;
  let transitionProgress = 0;

  for (let i = 0; i < totalClips; i++) {
    const clipStart = i * clipDuration;
    const clipEnd = clipStart + clipDuration;

    if (frame >= clipStart && frame < clipEnd) {
      currentClipIndex = i;
      const elapsedInClip = frame - clipStart;

      // Check if in transition zone at end of clip
      if (elapsedInClip > clipDuration - transitionFrames && i < totalClips - 1) {
        isTransitioning = true;
        transitionProgress = (elapsedInClip - (clipDuration - transitionFrames)) / transitionFrames;
        clipProgress = 1 - transitionProgress; // Outgoing clip fades out
      } else {
        clipProgress = elapsedInClip / clipDuration;
      }
      break;
    }
  }

  // Handle last frame edge case
  if (frame >= durationInFrames) {
    currentClipIndex = totalClips - 1;
    clipProgress = 1;
  }

  const currentClip = clips[currentClipIndex];
  const nextClip = clips[currentClipIndex + 1];

  // Global progress for progress bar
  const globalProgress = (currentClipIndex + clipProgress) / totalClips;

  // Title card shows for first 2 seconds
  const titleCardDuration = 2 * fps;
  const showTitleCard = frame < titleCardDuration;

  return (
    <AbsoluteFill style={{ backgroundColor: 'black', position: 'relative' }}>
      {/* Background Music */}
      <Html5Audio src={staticFile(backgroundMusic)} volume={musicVolume} />

      {/* Particles ambient effect */}
      {enableParticles && (
        <AbsoluteFill style={{ pointerEvents: 'none', zIndex: 1 }}>
          <Particles
            count={30}
            ParticlesColors={[primaryColor]}
            size={2}
            speed={0.3}
            opacity={0.15}
            style={{ filter: 'blur(1px)' }}
          />
        </AbsoluteFill>
      )}

      {/* Video Clips with Transitions */}
      <AbsoluteFill style={{ position: 'relative', zIndex: 10 }}>
        {/* Current Clip */}
        <Sequence from={currentClipIndex * clipDuration} durationInFrames={clipDuration} layout="none">
          <DanceClip
            {...currentClip}
            isActive={true}
            progress={clipProgress}
            index={currentClipIndex}
            total={totalClips}
            globalProgress={globalProgress}
            themeColor={currentClip.themeColor || primaryColor}
            textDelay={isTransitioning ? 0 : 10}
          />
        </Sequence>

        {/* Next Clip (for crossfade transition) */}
        {isTransitioning && nextClip && (
          <Sequence from={currentClipIndex * clipDuration} durationInFrames={clipDuration} layout="none">
            <div style={{ opacity: transitionProgress }}>
              <DanceClip
                {...nextClip}
                isActive={false}
                progress={0}
                index={currentClipIndex + 1}
                total={totalClips}
                globalProgress={globalProgress}
                themeColor={nextClip.themeColor || primaryColor}
                textDelay={0}
              />
            </div>
          </Sequence>
        )}

        {/* Render all other clips (for seek/preview) - only when not transitioning */}
        {!isTransitioning && clips.map((clip, i) => (
          i !== currentClipIndex && (
            <Sequence key={i} from={i * clipDuration} durationInFrames={clipDuration} layout="none">
              <DanceClip
                {...clip}
                isActive={false}
                progress={i < currentClipIndex ? 1 : 0}
                index={i}
                total={totalClips}
                globalProgress={globalProgress}
                themeColor={clip.themeColor || primaryColor}
                textDelay={0}
              />
            </Sequence>
          )
        ))}
      </AbsoluteFill>

      {/* Global Progress Bar */}
      {showProgressBar && (
        <GlobalProgressBar
          progress={clipProgress}
          totalClips={totalClips}
          currentClip={currentClipIndex}
          primaryColor={primaryColor}
          secondaryColor={secondaryColor}
        />
      )}

      {/* Title Card Overlay */}
      {showTitleCard && (
        <TitleCard
          title={compilationTitle}
          subtitle={compilationSubtitle}
          primaryColor={primaryColor}
          secondaryColor={secondaryColor}
          delay={10}
        />
      )}

      {/* Watermark */}
      {watermark && (
        <AbsoluteFill
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'flex-end',
            padding: '40px',
            pointerEvents: 'none',
            zIndex: 1000,
          }}
        >
          <img
            src={staticFile(watermark)}
            style={{
              width: '100px',
              height: '100px',
              opacity: watermarkOpacity,
              filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.5))',
            }}
          />
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

export default DanceCompilation;