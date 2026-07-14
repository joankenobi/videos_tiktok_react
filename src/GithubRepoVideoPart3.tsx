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
import { CheckCircle2 } from 'lucide-react';
import { ShinyText, Particles, GradientText } from './ReactBitsForRemotion';

const { fontFamily } = loadFont();
const { fontFamily: bodyFont } = loadInter();

export const githubRepoPart3Schema = z.object({
    uniqueFeatures: z.array(z.string()),
    hook: z.string(),
    closingLine: z.string(),
    cta: z.string(),
    // react-bits props
    particlesCount: z.number().default(30),
    particlesColors: z.array(z.string()).default(['#22c55e55', '#16a34a44', '#4ade8033']),
    particlesSeed: z.number().default(13),
    gradientHookColors: z.array(z.string()).default(['#22c55e', '#4ade80', '#86efac', '#22c55e']),
    gradientHookSpeed: z.number().default(120),
    shinyCtaColor: z.string().default('#dcfce7'),
    shineColor: z.string().default('#ffffff'),
    shinySpeed: z.number().default(60),
});

const FeatureCard: React.FC<{ text: string; delay: number }> = ({ text, delay }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const entrance = spring({ frame: frame - delay, fps, config: { stiffness: 90, damping: 14 } });

    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: '20px',
                padding: '28px 36px',
                backgroundColor: '#052e16',
                border: '1px solid #22c55e33',
                borderLeft: '4px solid #22c55e',
                borderRadius: '12px',
                opacity: entrance,
                transform: `translateX(${(1 - entrance) * -80}px)`,
            }}
        >
            <div style={{ color: '#22c55e', flexShrink: 0 }}>
                <CheckCircle2 size={36} />
            </div>
            <span style={{ fontSize: '30px', fontWeight: 600, color: '#f0fdf4', lineHeight: 1.3, fontFamily: bodyFont }}>
                {text}
            </span>
        </div>
    );
};

export const GithubRepoVideoPart3: React.FC<z.infer<typeof githubRepoPart3Schema>> = ({
    uniqueFeatures, hook, closingLine, cta,
    particlesCount, particlesColors, particlesSeed,
    gradientHookColors, gradientHookSpeed,
    shinyCtaColor, shineColor, shinySpeed,
}) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const hookSpring = spring({ frame: frame - 8, fps, config: { stiffness: 120, damping: 10 } });

    const closingOpacity = interpolate(frame - 170, [0, 25], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
    const closingX = interpolate(frame - 170, [0, 25], [-80, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

    const ctaOpacity = interpolate(frame - 210, [0, 20], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

    // Looping pulse for CTA container
    const pulse = 1 + Math.sin(frame / 12) * 0.04;

    return (
        <AbsoluteFill style={{ backgroundColor: '#030a05', color: 'white', fontFamily: bodyFont, overflow: 'hidden' }}>
            {/* ── react-bits: Green-tinted Particles ── */}
            <Particles count={particlesCount} colors={particlesColors} seed={particlesSeed} />

            {/* Green radial background */}
            <div
                style={{
                    position: 'absolute', top: '-30%', right: '-20%',
                    width: '120%', height: '120%',
                    background: 'radial-gradient(circle at 70% 30%, #14532d33 0%, transparent 55%)',
                    zIndex: 0,
                }}
            />

            <AbsoluteFill style={{ padding: '80px', zIndex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                {/* ── react-bits: GradientText Hook ── */}
                <div
                    style={{
                        fontFamily,
                        fontSize: '64px',
                        fontWeight: 800,
                        lineHeight: 1.1,
                        marginBottom: '50px',
                        opacity: hookSpring,
                        transform: `scale(${interpolate(hookSpring, [0, 1], [0.85, 1])})`,
                    }}
                >
                    <GradientText
                        colors={gradientHookColors}
                        speedFrames={gradientHookSpeed}
                        startFrame={0}
                    >
                        {hook}
                    </GradientText>
                </div>

                {/* Feature Cards */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '50px' }}>
                    {uniqueFeatures.slice(0, 3).map((feature, i) => (
                        <FeatureCard key={i} text={feature} delay={50 + i * 35} />
                    ))}
                </div>

                {/* Closing Line */}
                <div
                    style={{
                        fontFamily,
                        fontSize: '42px',
                        fontWeight: 800,
                        color: 'white',
                        lineHeight: 1.2,
                        opacity: closingOpacity,
                        transform: `translateX(${closingX}px)`,
                        marginBottom: '30px',
                    }}
                >
                    {closingLine}
                </div>

                {/* ── react-bits: ShinyText CTA ── */}
                <div
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '24px 48px',
                        background: 'linear-gradient(135deg, #16a34a, #22c55e)',
                        borderRadius: '100px',
                        boxShadow: `0 0 ${30 * pulse}px #22c55e88`,
                        transform: `scale(${pulse})`,
                        opacity: ctaOpacity,
                        fontSize: '28px',
                        fontWeight: 800,
                        maxWidth: '600px',
                    }}
                >
                    <ShinyText
                        text={cta}
                        color={shinyCtaColor}
                        shineColor={shineColor}
                        speedFrames={shinySpeed}
                        startFrame={210}
                    />
                </div>
            </AbsoluteFill>
        </AbsoluteFill>
    );
};
