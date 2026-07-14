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
import { Star, GitFork, Terminal } from 'lucide-react';
import { DecryptedText, GradientText, Particles } from './ReactBitsForRemotion';

const { fontFamily } = loadFont();
const { fontFamily: bodyFont } = loadInter();

export const githubRepoSchema = z.object({
    repoName: z.string(),
    description: z.string(),
    stars: z.number(),
    forks: z.number(),
    language: z.string(),
    hook: z.string(),
    cta: z.string(),
    // react-bits props
    particlesCount: z.number().default(35),
    particlesColors: z.array(z.string()).default(['#1d4ed888', '#3b82f644', '#6366f133']),
    particlesSeed: z.number().default(7),
    gradientColors: z.array(z.string()).default(['#ffffff', '#93c5fd', '#3b82f6', '#ffffff']),
    gradientSpeed: z.number().default(180),
    decryptedEncryptedColor: z.string().default('#1d4ed8'),
    decryptedRevealedColor: z.string().default('#3b82f6'),
});

const StatItem: React.FC<{
    icon: React.ReactNode;
    label: string | number;
    value: number;
    delay: number;
}> = ({ icon, label, value, delay }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const entrance = spring({
        frame: frame - delay,
        fps,
        config: { damping: 12 },
    });

    const counter = interpolate(frame - delay - 10, [0, 30], [0, value], {
        extrapolateRight: 'clamp',
    });

    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                fontSize: '40px',
                color: 'white',
                opacity: entrance,
                transform: `translateX(${(1 - entrance) * -50}px)`,
                marginBottom: '20px',
            }}
        >
            <div style={{ color: '#3b82f6' }}>{icon}</div>
            <div style={{ fontWeight: 700, minWidth: '100px' }}>
                {Math.floor(counter).toLocaleString()}
            </div>
            <div style={{ fontSize: '24px', opacity: 0.7 }}>{label}</div>
        </div>
    );
};

export const GithubRepoVideo: React.FC<z.infer<typeof githubRepoSchema>> = ({
    repoName,
    description,
    stars,
    forks,
    language,
    hook,
    cta,
    particlesCount,
    particlesColors,
    particlesSeed,
    gradientColors,
    gradientSpeed,
    decryptedEncryptedColor,
    decryptedRevealedColor,
}) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const titleSpring = spring({
        frame: frame - 15,
        fps,
        config: { stiffness: 100 },
    });

    const descOpacity = interpolate(frame - 40, [0, 15], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
    });

    const ctaOpacity = interpolate(frame - 120, [0, 20], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
    });

    return (
        <AbsoluteFill
            style={{
                backgroundColor: '#0a0a0a',
                color: 'white',
                fontFamily: bodyFont,
                padding: '60px',
                overflow: 'hidden',
            }}
        >
            {/* ── react-bits: Particles Background ── */}
            <Particles count={particlesCount} colors={particlesColors} seed={particlesSeed} />

            {/* Animated Radial Gradient */}
            <div
                style={{
                    position: 'absolute',
                    top: '-20%',
                    left: '-20%',
                    width: '140%',
                    height: '140%',
                    background: `radial-gradient(circle at ${50 + Math.sin(frame / 60) * 20}% ${50 + Math.cos(frame / 60) * 20}%, #1d4ed822 0%, transparent 50%)`,
                    zIndex: 0,
                }}
            />

            <AbsoluteFill style={{ padding: '80px', zIndex: 1 }}>
                {/* ── react-bits: DecryptedText Hook ── */}
                <div style={{ fontSize: '28px', fontWeight: 500, marginBottom: '20px', minHeight: '40px' }}>
                    <DecryptedText
                        text={hook}
                        startFrame={0}
                        durationFrames={45}
                        encryptedColor={decryptedEncryptedColor}
                        revealedColor={decryptedRevealedColor}
                    />
                </div>

                {/* ── react-bits: GradientText Repo Name ── */}
                <div
                    style={{
                        fontFamily,
                        fontSize: '100px',
                        fontWeight: 800,
                        lineHeight: 1,
                        marginBottom: '40px',
                        opacity: titleSpring,
                        transform: `scale(${interpolate(titleSpring, [0, 1], [0.8, 1])})`,
                    }}
                >
                    <GradientText
                        colors={gradientColors}
                        speedFrames={gradientSpeed}
                        startFrame={15}
                    >
                        {repoName.split('/')[1]}
                    </GradientText>
                </div>

                {/* Description */}
                <div
                    style={{
                        fontSize: '32px',
                        lineHeight: 1.4,
                        opacity: descOpacity,
                        maxWidth: '800px',
                        marginBottom: '80px',
                        color: '#d4d4d4',
                    }}
                >
                    {description}
                </div>

                {/* Stats */}
                <div style={{ marginTop: 'auto' }}>
                    <StatItem icon={<Star size={40} />} label="Stars" value={stars} delay={60} />
                    <StatItem icon={<GitFork size={40} />} label="Forks" value={forks} delay={70} />
                    <StatItem icon={<Terminal size={40} />} label={language} value={100} delay={80} />
                </div>

                {/* CTA */}
                <div
                    style={{
                        marginTop: '60px',
                        padding: '24px',
                        borderTop: '1px solid #ffffff22',
                        fontSize: '28px',
                        fontWeight: 600,
                        color: '#3b82f6',
                        opacity: ctaOpacity,
                    }}
                >
                    {cta}
                </div>
            </AbsoluteFill>
        </AbsoluteFill>
    );
};
