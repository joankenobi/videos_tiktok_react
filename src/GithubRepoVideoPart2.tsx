import React from 'react';
import {
    AbsoluteFill,
    interpolate,
    spring,
    useCurrentFrame,
    useVideoConfig,
} from 'remotion';
import { z } from 'zod';
import { loadFont } from '@remotion/google-fonts/SpaceGrotesk';
import { loadFont as loadInter } from '@remotion/google-fonts/Inter';
import { Bot, ScrollText, MessageSquareQuote } from 'lucide-react';
import { StarBorder, DecryptedText } from './ReactBitsForRemotion';

const { fontFamily } = loadFont();
const { fontFamily: bodyFont } = loadInter();

export const githubRepoPart2Schema = z.object({
    agents: z.number(),
    instructions: z.number(),
    prompts: z.number(),
    hook: z.string(),
    methodology: z.string(),
    cta: z.string(),
    // react-bits props
    starBorderColor: z.string().default('#3b82f6'),
    starBorderSpeed: z.number().default(120),
    decryptedCtaColor: z.string().default('#60a5fa'),
});

const GridBackground: React.FC = () => {
    const frame = useCurrentFrame();
    return (
        <AbsoluteFill>
            <div
                style={{
                    position: 'absolute',
                    top: '-50%', left: '-50%',
                    width: '200%', height: '200%',
                    backgroundImage: `
                        linear-gradient(to right, #1d4ed822 1px, transparent 1px),
                        linear-gradient(to bottom, #1d4ed822 1px, transparent 1px)
                    `,
                    backgroundSize: '40px 40px',
                    transform: `translateY(${frame % 40}px) perspective(500px) rotateX(60deg)`,
                    transformOrigin: 'top center',
                    opacity: 0.3,
                    zIndex: 0,
                }}
            />
        </AbsoluteFill>
    );
};

const MethodologySteps: React.FC<{ methodology: string }> = ({ methodology }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const steps = methodology.split(/,|;| and | → /).map(s => s.trim()).filter(Boolean);

    return (
        <div style={{ display: 'flex', gap: '16px', marginBottom: '40px', flexWrap: 'wrap' }}>
            {steps.map((step, i) => {
                const stepSpring = spring({
                    frame: frame - (40 + i * 15),
                    fps,
                    config: { damping: 12 },
                });
                return (
                    <div
                        key={step}
                        style={{
                            padding: '12px 24px',
                            backgroundColor: '#1e3a8a',
                            borderRadius: '8px',
                            fontSize: '24px',
                            fontWeight: 'bold',
                            border: '1px solid #3b82f6',
                            transform: `scale(${stepSpring})`,
                            opacity: stepSpring,
                            color: '#bfdbfe',
                        }}
                    >
                        {step}
                    </div>
                );
            })}
        </div>
    );
};

// ── react-bits: StarBorder wrapping stat cards ──
const StatCard: React.FC<{
    icon: React.ReactNode;
    value: number;
    label: string;
    delay: number;
    color: string;
    speed: number;
}> = ({ icon, value, label, delay, color, speed }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const entrance = spring({ frame: frame - delay, fps, config: { stiffness: 100 } });
    const counter = interpolate(frame - delay - 10, [0, 30], [0, value], { extrapolateRight: 'clamp' });

    return (
        <div style={{
            transform: `scale(${interpolate(entrance, [0, 1], [0.8, 1])}) translateY(${(1 - entrance) * 50}px)`,
            opacity: entrance,
        }}>
            <StarBorder color={color} speed={speed} borderRadius='14px' padding='22px 28px'>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div style={{ color: color }}>{icon}</div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontSize: '48px', fontWeight: 'bold', color: 'white', lineHeight: 1 }}>
                            {Math.floor(counter)}
                        </span>
                        <span style={{ fontSize: '20px', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '2px' }}>
                            {label}
                        </span>
                    </div>
                </div>
            </StarBorder>
        </div>
    );
};

export const GithubRepoVideoPart2: React.FC<z.infer<typeof githubRepoPart2Schema>> = ({
    agents, instructions, prompts, hook, methodology, cta,
    starBorderColor, starBorderSpeed, decryptedCtaColor,
}) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const hookSpring = spring({ frame: frame - 10, fps, config: { damping: 14 } });
    const hookParts = hook.split(' is ');
    const hookStart = hookParts[0] + ' is ';
    const hookHighlight = hookParts[1] ?? '';

    return (
        <AbsoluteFill style={{ backgroundColor: '#050505', color: 'white', fontFamily: bodyFont, padding: '60px' }}>
            <GridBackground />

            <AbsoluteFill style={{ padding: '80px', zIndex: 1, display: 'flex', flexDirection: 'column' }}>
                {/* Hook with GradientText highlight */}
                <div
                    style={{
                        fontFamily,
                        fontSize: '70px',
                        fontWeight: 800,
                        lineHeight: 1.1,
                        marginBottom: '40px',
                        maxWidth: '800px',
                        opacity: hookSpring,
                        transform: `translateX(${(1 - hookSpring) * -100}px)`,
                    }}
                >
                    {hookStart}
                    <span style={{ color: starBorderColor }}>{hookHighlight}</span>
                </div>

                <MethodologySteps methodology={methodology} />

                <div style={{ fontSize: '32px', color: '#d1d5db', marginBottom: '30px', opacity: interpolate(frame - 80, [0, 20], [0, 1]) }}>
                    A refined collection of components:
                </div>

                {/* ── react-bits: StarBorder stat cards ── */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: 'auto', marginBottom: '50px' }}>
                    <StatCard icon={<Bot size={50} />} value={agents} label="Specialized Agents" delay={100} color={starBorderColor} speed={starBorderSpeed} />
                    <StatCard icon={<ScrollText size={50} />} value={instructions} label="Skills & Commands" delay={115} color={starBorderColor} speed={starBorderSpeed} />
                    <StatCard icon={<MessageSquareQuote size={50} />} value={prompts} label="Content Workflows" delay={130} color={starBorderColor} speed={starBorderSpeed} />
                </div>

                {/* CTA with DecryptedText */}
                <div
                    style={{
                        padding: '24px',
                        borderTop: '1px solid #374151',
                        fontSize: '28px',
                        fontWeight: 600,
                        opacity: interpolate(frame - 180, [0, 20], [0, 1]),
                    }}
                >
                    <DecryptedText
                        text={cta}
                        startFrame={180}
                        durationFrames={40}
                        encryptedColor='#374151'
                        revealedColor={decryptedCtaColor}
                    />
                </div>
            </AbsoluteFill>
        </AbsoluteFill>
    );
};
