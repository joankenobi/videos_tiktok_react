import React from 'react';
import { AbsoluteFill, staticFile, useCurrentFrame, OffthreadVideo, useVideoConfig } from 'remotion';
import { z } from "zod";

const videoSource = staticFile("God of war.mp4")

export const triviaSchema = z.object({
    pregunta: z.string(),
    answer: z.string(),
    videoStartOffset: z.number(),
});

export const TriviaComposition: React.FC<z.infer<typeof triviaSchema>> = ({ pregunta, videoStartOffset = 0 }) => {
    const frame = useCurrentFrame();
    const { fps, durationInFrames } = useVideoConfig();

    // Timing definitions
    const waitFrames = 20 * fps;
    const introFrames = 40 * fps;
    const giveawayStartFrame = durationInFrames - (20 * fps);

    // Phase identification
    let phase: 'waiting' | 'intro' | 'question' | 'giveaway' = 'waiting';
    if (frame >= giveawayStartFrame) phase = 'giveaway';
    else if (frame >= introFrames) phase = 'question';
    else if (frame >= waitFrames) phase = 'intro';

    // Content mapping
    const content = {
        waiting: { text: '', header: '', fontSize: '64px', visible: false },
        intro: { text: "Participa en la trivia y gana", header: "¡PREPÁRATE!", fontSize: '64px', visible: true },
        question: { text: pregunta, header: "Trivia God of War", fontSize: '64px', visible: true },
        giveaway: {
            text: "si fuiste el primero en responder correctamente y sigues el canal participas por un juego gratis",
            header: "¡AVISO IMPORTANTE!",
            fontSize: '48px',
            visible: true
        }
    };

    const currentContent = content[phase];

    // Initial animations (fade in when first appearing)
    const initialOpacity = Math.min(1, Math.max(0, (frame - waitFrames) / 30));
    const translateY = (1 - Math.min(1, Math.max(0, (frame - waitFrames) / 30))) * 50;

    // Transition logic for phase swaps (fades between messages)
    const transitionFrames = 10;
    const isTransitioning =
        Math.abs(frame - waitFrames) < transitionFrames ||
        Math.abs(frame - introFrames) < transitionFrames ||
        Math.abs(frame - giveawayStartFrame) < transitionFrames;

    const transitionOpacity = isTransitioning ? 0.3 : 1;
    const combinedOpacity = currentContent.visible ? (initialOpacity * transitionOpacity) : 0;

    return (
        <AbsoluteFill style={{ backgroundColor: 'black' }}>
            <style>
                {
                `@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;700;800&family=Quicksand:wght@400;700&display=swap');`}
            </style>
            {/* Background Video Layer */}
            <AbsoluteFill style={{ overflow: 'hidden' }}>
                <OffthreadVideo
                    src={videoSource}
                    trimBefore={videoStartOffset * fps}
                    style={{
                        height: '100%',
                        width: '100%',
                        objectFit: 'cover',
                    }}
                />
            </AbsoluteFill>

            {/* Dark overlay for better readability if needed, though the card is white */}
            {/* <AbsoluteFill style={{ backgroundColor: 'rgba(0,0,0,0.2)' }} /> */}

            {/* Trivia Question Card Design from public/stich/trivia question.html */}
            <AbsoluteFill
                style={{
                    justifyContent: 'center', // Center vertically for TikTok engagement
                    alignItems: 'center',
                    padding: '600px 40px 0px 20px',
                    opacity: combinedOpacity,
                    transform: `translateY(${translateY}px)`,
                }}
            >
                <div
                    style={{
                        width: '100%',
                        maxWidth: '800px', // Wider card for bigger text
                        background: 'rgba(255, 255, 255, 0.95)', // Slightly more opaque for readability
                        backdropFilter: 'blur(20px)',
                        border: '2px solid rgba(255, 255, 255, 0.5)',
                        borderRadius: '48px',
                        padding: '60px',
                        display: 'flex',
                        flexDirection: 'column',
                        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.2)',
                        fontFamily: '"Outfit", "Quicksand", "Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                    }}
                >
                    <span
                        style={{
                            fontSize: '24px', // Bigger header
                            fontWeight: 'bold',
                            color: '#c74a4aff', // mint-accent
                            textTransform: 'uppercase',
                            letterSpacing: '0.2em',
                            display: 'block',
                            marginBottom: '24px',
                            textAlign: 'center',
                        }}
                    >
                        {currentContent.header}
                    </span>
                    <h2
                        style={{
                            fontSize: currentContent.fontSize, // Significantly larger for TikTok
                            fontWeight: 800,
                            lineHeight: '1.2',
                            color: '#1e293b', // slate-800
                            margin: 0,
                            textAlign: 'center',
                        }}
                    >
                        {currentContent.text}
                    </h2>
                </div>
            </AbsoluteFill>

            {/* Answer reveals after 5 seconds? (Not requested but makes it a real trivia) */}
            {/* For now, just following the request to show the question with the design */}
        </AbsoluteFill>
    );
};
