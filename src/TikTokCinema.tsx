
import {
    AbsoluteFill,
    Audio,
    interpolate,
    OffthreadVideo,
    random,
    staticFile,
    useCurrentFrame,
} from 'remotion';
import { z } from 'zod';

const audioSource = staticFile('nightdrive.m4a');
const videoSource = staticFile('nightdrive.mp4');

export const tikTokCinemaSchema = z.object({
    quote: z.string(),
    videoStartOffset: z.number(),
});

// Film Grain Component
const FilmGrain = () => {
    const frame = useCurrentFrame();

    // Create random noise pattern that changes every frame
    const noiseX = random(frame) * 100;
    const noiseY = random(frame + 1) * 100;

    return (
        <AbsoluteFill
            style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.4'/%3E%3C/svg%3E")`,
                opacity: 0.15,
                transform: `translate(${noiseX % 10}px, ${noiseY % 10}px)`,
                pointerEvents: 'none',
                mixBlendMode: 'overlay',
            }}
        />
    );
};

export const TikTokCinema: React.FC<z.infer<typeof tikTokCinemaSchema>> = ({
    quote,
    videoStartOffset,
}) => {
    const frame = useCurrentFrame();

    // Text Blur Animation
    const blur = interpolate(frame, [20, 80], [20, 0], {
        extrapolateRight: 'clamp',
    });
    const opacity = interpolate(frame, [20, 80], [0, 1], {
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
                        left: '-60vh',
                        height: '100%',
                        minWidth: '177.78vh',
                        objectFit: 'cover',
                        filter: 'contrast(1.1) saturation(0.8)', // Cinematic look
                    }}
                />

                {/* Vignette */}
                <AbsoluteFill
                    style={{
                        background: 'radial-gradient(circle, transparent 40%, black 100%)',
                        opacity: 0.7,
                    }}
                />

                <FilmGrain />

                {/* Letterbox Bars */}
                <div style={{ position: 'absolute', top: 0, width: '100%', height: '100px', background: 'black', zIndex: 10 }} />
                <div style={{ position: 'absolute', bottom: 0, width: '100%', height: '100px', background: 'black', zIndex: 10 }} />

            </AbsoluteFill>

            <AbsoluteFill
                style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: '0 50px',
                    zIndex: 20
                }}
            >
                <h1
                    style={{
                        fontFamily: 'Georgia, serif', // Serif font for cinematic feel
                        fontSize: '55px',
                        fontStyle: 'italic',
                        color: 'white',
                        textAlign: 'center',
                        textShadow: '0 2px 10px rgba(0,0,0,0.8)',
                        filter: `blur(${blur}px)`,
                        opacity,
                    }}
                >
                    "{quote}"
                </h1>
            </AbsoluteFill>

            <Audio src={audioSource} />
        </AbsoluteFill>
    );
};
