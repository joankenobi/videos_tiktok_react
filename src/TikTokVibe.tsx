
import { useAudioData, visualizeAudio } from '@remotion/media-utils';
import {
    AbsoluteFill,
    Audio,
    interpolate,
    OffthreadVideo,
    staticFile,
    Sequence,
    useCurrentFrame,
    useVideoConfig,
} from 'remotion';
import { z } from 'zod';

const audioSource = staticFile('nightdrive.m4a');
const musicSource = staticFile('piano_relajante.mp3');
const videoSource = staticFile('nightdrive.mp4');

export const tikTokVibeSchema = z.object({
    quote: z.string(),
    videoStartOffset: z.number(),
});

const AudioBar = ({ volume }: { volume: number }) => {
    return (
        <div
            style={{
                height: interpolate(volume, [0, 0.5], [10, 100], {
                    extrapolateRight: 'clamp',
                }),
                width: 10,
                backgroundColor: 'white',
                borderRadius: 5,
                margin: '0 2px',
                opacity: 0.8,
            }}
        />
    );
};

export const TikTokVibe: React.FC<z.infer<typeof tikTokVibeSchema>> = ({
    quote,
    videoStartOffset,
}) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const audioData = useAudioData(musicSource);

    if (!audioData) {
        return null;
    }

    const visualization = visualizeAudio({
        fps,
        frame,
        audioData,
        numberOfSamples: 16, // Number of bars
    });

    // Fade in text
    const opacity = interpolate(frame, [30, 90], [0, 1], {
        extrapolateRight: 'clamp',
    });

    return (
        <AbsoluteFill style={{ backgroundColor: 'black' }}>
            <AbsoluteFill
                style={{
                    height: '100%',
                    width: '100%',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                }}
            >
                <OffthreadVideo
                    src={videoSource}
                    startFrom={videoStartOffset}
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: '-60vh', // Center the 16:9 video horizontally in the 9:16 frame
                        height: '100%',
                        minWidth: '177.78vh', // 16/9 * 100vh
                        objectFit: 'cover',
                    }}
                />
                {/* Darker Overlay for Vibe */}
                <div
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'rgba(0, 0, 0, 0.4)',
                    }}
                />
            </AbsoluteFill>

            <AbsoluteFill
                style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: '0 40px',
                }}
            >
                <h1
                    style={{
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '60px',
                        fontWeight: 300, // Thinner font for "chill" vibe
                        color: 'white',
                        textAlign: 'center',
                        opacity,
                        textShadow: '0px 0px 10px rgba(255, 255, 255, 0.5)',
                        letterSpacing: '2px',
                    }}
                >
                    {quote}
                </h1>
            </AbsoluteFill>

            {/* Audio Visualization at the bottom */}
            <AbsoluteFill
                style={{
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                    paddingBottom: 150,
                }}
            >
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end', height: 100 }}>
                    {visualization.map((v) => (
                        <AudioBar key={v} volume={v} />
                    ))}
                </div>
            </AbsoluteFill>

            <Audio src={audioSource} volume={0.3} />
            <Audio src={musicSource} volume={0.7} />
        </AbsoluteFill>
    );
};
