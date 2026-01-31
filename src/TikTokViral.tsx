
import {
    AbsoluteFill,
    Audio,
    interpolate,
    OffthreadVideo,
    staticFile,
    useCurrentFrame,
} from 'remotion';
import { z } from 'zod';

const audioSource = staticFile('nightdrive.m4a');
const videoSource = staticFile('nightdrive.mp4');

export const tikTokViralSchema = z.object({
    quote: z.string(),
    videoStartOffset: z.number(),
});

const Word = ({ word, index, startFrame }: { word: string, index: number, startFrame: number }) => {
    const frame = useCurrentFrame();

    // Each word lights up sequentially every 10 frames
    const wordStart = startFrame + (index * 8);

    const opacity = interpolate(frame, [wordStart, wordStart + 5], [0.3, 1], {
        extrapolateRight: 'clamp',
        extrapolateLeft: 'clamp'
    });

    const scale = interpolate(frame, [wordStart, wordStart + 5, wordStart + 10], [1, 1.1, 1], {
        extrapolateRight: 'clamp',
        extrapolateLeft: 'clamp'
    });

    const color = interpolate(frame, [wordStart, wordStart + 5], [0, 1], {
        extrapolateRight: 'clamp'
    }) > 0.5 ? '#FE2C55' : 'white'; // TikTok Red bounce

    return (
        <span style={{
            opacity,
            transform: `scale(${scale})`,
            display: 'inline-block',
            margin: '0 8px',
            color: 'white',
            textShadow: '3px 3px 0px #000',
        }}>
            {word}
        </span>
    );
};

export const TikTokViral: React.FC<z.infer<typeof tikTokViralSchema>> = ({
    quote,
    videoStartOffset,
}) => {
    const words = quote.split(' ');

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
                        left: '-60vh',
                        height: '100%',
                        minWidth: '177.78vh',
                        objectFit: 'cover',
                    }}
                />
                {/* Heavy Dark Overlay for max readability */}
                <div
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'rgba(0, 0, 0, 0.6)',
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
                <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                    fontFamily: 'Montserrat, sans-serif',
                    fontSize: '65px',
                    fontWeight: 900,
                    textTransform: 'uppercase',
                    textAlign: 'center',
                    lineHeight: '1.2'
                }}>
                    {words.map((w, i) => (
                        <Word key={i} word={w} index={i} startFrame={30} />
                    ))}
                </div>
            </AbsoluteFill>

            <Audio src={audioSource} />
        </AbsoluteFill>
    );
};
