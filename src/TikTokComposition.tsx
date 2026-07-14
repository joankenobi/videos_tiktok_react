
import React from 'react';
import { AbsoluteFill, staticFile, useCurrentFrame, useVideoConfig, OffthreadVideo, Html5Audio } from 'remotion';
import { z } from "zod";

export const tikTokSchema = z.object({
    quote: z.string(),
    videoStartOffset: z.number(),
});

export const TikTokComposition: React.FC<z.infer<typeof tikTokSchema>> = ({ quote, videoStartOffset }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    // Typing effect
    const charsShown = Math.floor(frame / 2);
    const textToShow = quote.slice(0, charsShown);
    const cursorVisible = frame % 20 < 10;

    return (
        <AbsoluteFill style={{ backgroundColor: 'black' }}>
            {/* Background Video Layer */}
            <AbsoluteFill style={{ overflow: 'hidden' }}>
                <OffthreadVideo
                    src={staticFile("nightdrive.mp4")}
                    // startFrom={videoStartOffset * fps}
                    trimBefore={videoStartOffset * fps}
                    style={{
                        height: '100%',
                        // Assuming 1080x1920 output. Source is likely landscape.
                        // We want to fill height, which makes width >>> 1080.
                        // "1/3 from left" means we want to shift the video.
                        // Let's scale it to fit height, then shift.
                        minWidth: '177.78vh', // 16/9 aspect ratio roughly
                        position: 'absolute',
                        // Shift to show the "1/3" mark.
                        // If width is ~3413px, 1/3 is ~1137px.
                        // 0 would be left edge. -1137 would show from 1/3 mark.
                        left: '-60vh',
                        objectFit: 'cover',
                    }}
                    muted
                // volume={0} // Ensure muting if the file has audio
                />
            </AbsoluteFill>

            {/* Audio Layer */}
            <Html5Audio src={staticFile("nightdrive.m4a")} volume={0.3} />
            {frame < quote.length * 2 && <Html5Audio src={staticFile("typing.m4a")} volume={0.5} />}

            {/* Text Overlay Layer */}
            <AbsoluteFill
                style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: 80,
                }}
            >
                <div
                    style={{
                        fontFamily: '"SF Pro Text", "Helvetica Neue", Helvetica, Arial, sans-serif',
                        fontSize: 60,
                        fontWeight: 'bold',
                        color: 'white',
                        textAlign: 'center',
                        textShadow: '0px 2px 10px rgba(0,0,0,0.8)',
                        WebkitTextStroke: '20px black',
                        paintOrder: 'stroke',
                        lineHeight: 1.3,
                        whiteSpace: 'pre-wrap',
                    }}
                >
                    {textToShow}
                    <span style={{ opacity: cursorVisible ? 1 : 0, color: '#fe2c55' }}>|</span>
                </div>
            </AbsoluteFill>
        </AbsoluteFill>
    );
};
