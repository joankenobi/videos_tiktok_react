import React from 'react';
import { AbsoluteFill, OffthreadVideo, staticFile, useVideoConfig } from 'remotion';
import { z } from 'zod';

/**
 * Schema for video fitting options
 */
export const fittedVideoSchema = z.object({
  /** Video file path (relative to public/) or URL */
  src: z.string(),
  /** Start offset in seconds */
  startFrom: z.number().default(0),
  /** Trim from start in frames */
  trimBefore: z.number().optional(),
  /** Trim from end in frames */
  trimAfter: z.number().optional(),
  /** Whether to mute the video */
  muted: z.boolean().default(true),
  /** Volume (0-1) */
  volume: z.number().min(0).max(1).default(1),
  /** How to fit the video: 'cover' fills frame (crops), 'contain' shows all (letterboxes) */
  fit: z.enum(['cover', 'contain']).default('cover'),
  /** Background color for letterboxing when fit='contain' */
  backgroundColor: z.string().default('black'),
  /** Blur background when fit='cover' and video doesn't fill */
  blurBackground: z.boolean().default(false),
  /** Blur intensity */
  blurAmount: z.number().default(40),
  /** Opacity of the video */
  opacity: z.number().min(0).max(1).default(1),
  /** Custom className for styling */
  className: z.string().optional(),
  /** Playback rate */
  playbackRate: z.number().default(1),
});

export type FittedVideoProps = z.infer<typeof fittedVideoSchema>;

/**
 * FittedVideo - Normalizes any video to the composition's aspect ratio (1080x1920 for TikTok)
 * 
 * Handles:
 * - Portrait videos (9:16, 10:16, etc.) - fills height, centers horizontally
 * - Landscape videos (16:9, 4:3, etc.) - fills width, centers vertically  
 * - Square videos (1:1) - centers with letterboxing or crops to fill
 * - Slight aspect ratio variations - seamlessly adapts
 * 
 * @example
 * ```tsx
 * <FittedVideo 
 *   src="dance1.mp4" 
 *   fit="cover" 
 *   startFrom={2.5}
 *   trimBefore={30}
 * />
 * ```
 */
export const FittedVideo: React.FC<FittedVideoProps> = ({
  src,
  startFrom = 0,
  trimBefore,
  trimAfter,
  muted = true,
  volume = 1,
  fit = 'cover',
  backgroundColor = 'black',
  blurBackground = false,
  blurAmount = 40,
  opacity = 1,
  className,
  playbackRate = 1,
}) => {
  const { width, height } = useVideoConfig();
  const targetAspectRatio = width / height; // 1080/1920 = 0.5625 for TikTok

  // Container styles - always fills the composition
  const containerStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor,
    opacity,
  };

  // Video styles - objectFit handles the aspect ratio normalization
  const videoStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    objectFit: fit,
    objectPosition: 'center center',
  };

  // Blur background layer (for cover mode when video doesn't fully fill)
  const BlurBackground = blurBackground && fit === 'cover' ? (
    <AbsoluteFill
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        filter: `blur(${blurAmount}px)`,
        transform: 'scale(1.1)', // Slightly larger to avoid edge artifacts
      }}
    >
      <OffthreadVideo
        src={staticFile(src)}
        startFrom={startFrom}
        trimBefore={trimBefore}
        trimAfter={trimAfter}
        muted
        playbackRate={playbackRate}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center center',
        }}
      />
    </AbsoluteFill>
  ) : null;

  return (
    <AbsoluteFill style={containerStyle} className={className}>
      {BlurBackground}
      <OffthreadVideo
        src={staticFile(src)}
        startFrom={startFrom}
        trimBefore={trimBefore}
        trimAfter={trimAfter}
        muted={muted}
        volume={volume}
        playbackRate={playbackRate}
        style={videoStyle}
      />
    </AbsoluteFill>
  );
};

/**
 * Helper: Calculate video dimensions for debugging
 */
// export const getVideoFitInfo = (videoWidth: number, videoHeight: number, targetWidth: number, targetHeight: number) => {
//   const videoAR = videoWidth / videoHeight;
//   const targetAR = targetWidth / targetHeight;
  
//   if (fit === 'cover') {
//     // Video covers entire target, may be cropped
//     if (videoAR > targetAR) {
//       // Video is wider - height matches, width crops
//       return {
//         scale: targetHeight / videoHeight,
//         displayWidth: videoWidth * (targetHeight / videoHeight),
//         displayHeight: targetHeight,
//         cropped: 'horizontal',
//       };
//     } else {
//       // Video is taller - width matches, height crops
//       return {
//         scale: targetWidth / videoWidth,
//         displayWidth: targetWidth,
//         displayHeight: videoHeight * (targetWidth / videoWidth),
//         cropped: 'vertical',
//       };
//     }
//   } else {
//     // Contain - entire video visible, letterboxed
//     if (videoAR > targetAR) {
//       return {
//         scale: targetWidth / videoWidth,
//         displayWidth: targetWidth,
//         displayHeight: videoHeight * (targetWidth / videoWidth),
//         letterboxed: 'vertical',
//       };
//     } else {
//       return {
//         scale: targetHeight / videoHeight,
//         displayWidth: videoWidth * (targetHeight / videoHeight),
//         displayHeight: targetHeight,
//         letterboxed: 'horizontal',
//       };
//     }
//   }
// };

export default FittedVideo;