/**
 * ReactBitsForRemotion.tsx
 * ─────────────────────────────────────────────────────────────────
 * Portado de react-bits (reactbits.dev) para Remotion.
 *
 * Los componentes originales usan framer-motion, setInterval,
 * requestAnimationFrame y WebGL — incompatibles con el renderizado
 * determinístico de Remotion (headless Chrome, frame a frame).
 *
 * Estos son reimplementaciones que replican el efecto visual usando
 * SOLO useCurrentFrame() + interpolate() + spring() de Remotion.
 *
 * Componentes incluidos:
 *  - DecryptedText   → Efecto de descifrado de texto letra a letra
 *  - ShinyText       → Texto con brillo deslizante (gradiente animado)
 *  - GradientText    → Texto con gradiente animado multi-color
 *  - Particles       → Partículas flotantes (canvas CSS puro)
 *  - StarBorder      → Borde con estrella orbitando (para cards)
 * ─────────────────────────────────────────────────────────────────
 */

import React from 'react';
import { useCurrentFrame, interpolate } from 'remotion';

// ─── 1. DecryptedText ─────────────────────────────────────────────────────────
// Inspirado en: reactbits.dev/text-animations/decrypted-text
// Original usa: setInterval + useState — incompatible con Remotion
// Puerto: Calcula el estado del texto en función del frame actual

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';

/**
 * Genera un carácter "cifrado" determinístico basado en seed + frame.
 * Determinístico = mismo frame siempre produce mismo resultado (crucial para Remotion).
 */
function seededChar(seed: number, frame: number): string {
    const idx = Math.abs(Math.sin(seed * 9301 + frame * 49297) * 233280) % CHARS.length;
    return CHARS[Math.floor(idx)];
}

interface DecryptedTextProps {
    text: string;
    /** Frame en el que empieza la animación */
    startFrame?: number;
    /** Frames que tarda en revelar TODO el texto */
    durationFrames?: number;
    style?: React.CSSProperties;
    encryptedColor?: string;
    revealedColor?: string;
}

export const DecryptedText: React.FC<DecryptedTextProps> = ({
    text,
    startFrame = 0,
    durationFrames = 60,
    style = {},
    encryptedColor = '#3b82f6',
    revealedColor = 'white',
}) => {
    const frame = useCurrentFrame();
    const elapsed = Math.max(0, frame - startFrame);
    const revealedCount = Math.floor(interpolate(elapsed, [0, durationFrames], [0, text.length], {
        extrapolateRight: 'clamp',
    }));

    return (
        <span style={{ display: 'inline-block', whiteSpace: 'pre', ...style }}>
            {text.split('').map((char, i) => {
                if (char === ' ') return <span key={i}>&nbsp;</span>;
                const isRevealed = i < revealedCount;
                return (
                    <span
                        key={i}
                        style={{
                            color: isRevealed ? revealedColor : encryptedColor,
                            transition: 'none',
                            fontVariantNumeric: 'tabular-nums',
                        }}
                    >
                        {isRevealed ? char : seededChar(i, frame)}
                    </span>
                );
            })}
        </span>
    );
};

// ─── 2. ShinyText ─────────────────────────────────────────────────────────────
// Inspirado en: reactbits.dev/text-animations/shiny-text
// Original usa: framer-motion useAnimationFrame + useMotionValue
// Puerto: Gradiente con backgroundPosition calculado desde useCurrentFrame()

interface ShinyTextProps {
    text: string;
    style?: React.CSSProperties;
    color?: string;
    shineColor?: string;
    speedFrames?: number; // frames para completar un ciclo
    startFrame?: number;
}

export const ShinyText: React.FC<ShinyTextProps> = ({
    text,
    style = {},
    color = '#9ca3af',
    shineColor = '#ffffff',
    speedFrames = 60,
    startFrame = 0,
}) => {
    const frame = useCurrentFrame();
    const elapsed = Math.max(0, frame - startFrame);
    // 0 → 200 looping
    const progress = (elapsed % speedFrames) / speedFrames;
    const bgPos = `${150 - progress * 200}% center`;

    return (
        <span
            style={{
                backgroundImage: `linear-gradient(120deg, ${color} 0%, ${color} 35%, ${shineColor} 50%, ${color} 65%, ${color} 100%)`,
                backgroundSize: '200% auto',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundPosition: bgPos,
                display: 'inline-block',
                ...style,
            }}
        >
            {text}
        </span>
    );
};

// ─── 3. GradientText ─────────────────────────────────────────────────────────
// Inspirado en: reactbits.dev/text-animations/gradient-text
// Original usa: framer-motion useAnimationFrame
// Puerto: backgroundPosition animado vía interpolate desde frame

interface GradientTextProps {
    children: React.ReactNode;
    colors?: string[];
    speedFrames?: number;
    style?: React.CSSProperties;
    startFrame?: number;
}

export const GradientText: React.FC<GradientTextProps> = ({
    children,
    colors = ['#3b82f6', '#8b5cf6', '#ec4899', '#3b82f6'],
    speedFrames = 120,
    style = {},
    startFrame = 0,
}) => {
    const frame = useCurrentFrame();
    const elapsed = Math.max(0, frame - startFrame);
    const progress = (elapsed % speedFrames) / speedFrames; // 0 → 1 loop

    const gradientColors = colors.join(', ');
    const bgPos = `${progress * 100}% 50%`;

    return (
        <span
            style={{
                backgroundImage: `linear-gradient(to right, ${gradientColors})`,
                backgroundSize: '300% 100%',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundPosition: bgPos,
                display: 'inline-block',
                ...style,
            }}
        >
            {children}
        </span>
    );
};

// ─── 4. StarBorder (card border) ─────────────────────────────────────────────
// Inspirado en: reactbits.dev/animations/star-border
// Original usa: CSS @keyframes — portado a inline style animado por frame

interface StarBorderProps {
    children: React.ReactNode;
    color?: string;
    speed?: number; // frames per full rotation
    style?: React.CSSProperties;
    borderRadius?: string;
    padding?: string;
}

export const StarBorder: React.FC<StarBorderProps> = ({
    children,
    color = '#22c55e',
    speed = 90,
    style = {},
    borderRadius = '12px',
    padding = '20px 28px',
}) => {
    const frame = useCurrentFrame();
    const angle = ((frame % speed) / speed) * 360;

    return (
        <div
            style={{
                position: 'relative',
                borderRadius,
                padding: '2px',
                background: `conic-gradient(from ${angle}deg, transparent 70%, ${color} 85%, transparent 100%)`,
                ...style,
            }}
        >
            <div
                style={{
                    borderRadius,
                    padding,
                    backgroundColor: '#111827',
                    position: 'relative',
                    zIndex: 1,
                }}
            >
                {children}
            </div>
        </div>
    );
};

// ─── 5. Particles (CSS-only, sin WebGL) ──────────────────────────────────────
// Inspirado en: reactbits.dev/backgrounds/particles
// Original usa: WebGL (OGL renderer) — completamente incompatible con Remotion
// Puerto: Partículas simuladas con divs CSS, posición calculada por frame con sin/cos

interface ParticleData {
    x: number;
    y: number;
    size: number;
    speedX: number;
    speedY: number;
    opacity: number;
    color: string;
}

function generateParticles(count: number, colors: string[], seed: number): ParticleData[] {
    const particles: ParticleData[] = [];
    for (let i = 0; i < count; i++) {
        const r1 = Math.abs(Math.sin(seed + i * 7.3));
        const r2 = Math.abs(Math.sin(seed + i * 13.7));
        const r3 = Math.abs(Math.sin(seed + i * 5.1));
        const r4 = Math.abs(Math.sin(seed + i * 11.3));
        const r5 = Math.abs(Math.sin(seed + i * 3.7));
        particles.push({
            x: r1 * 100,
            y: r2 * 100,
            size: 1 + r3 * 3,
            speedX: (r4 - 0.5) * 0.3,
            speedY: (r5 - 0.5) * 0.3,
            opacity: 0.3 + r1 * 0.7,
            color: colors[i % colors.length],
        });
    }
    return particles;
}

interface ParticlesProps {
    count?: number;
    colors?: string[];
    seed?: number;
}

export const Particles: React.FC<ParticlesProps> = ({
    count = 40,
    colors = ['#3b82f6', '#8b5cf6', '#22c55e'],
    seed = 42,
}) => {
    const frame = useCurrentFrame();
    const particles = React.useMemo(() => generateParticles(count, colors, seed), [count, colors, seed]);

    return (
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
            {particles.map((p, i) => {
                // Sinusoidal movement driven by frame (deterministic)
                const dx = Math.sin(frame * 0.02 * (1 + p.speedX) + i) * 3;
                const dy = Math.cos(frame * 0.015 * (1 + p.speedY) + i * 1.3) * 3;
                const x = ((p.x + dx + (frame * p.speedX * 0.05)) % 100 + 100) % 100;
                const y = ((p.y + dy + (frame * p.speedY * 0.05)) % 100 + 100) % 100;

                return (
                    <div
                        key={i}
                        style={{
                            position: 'absolute',
                            left: `${x}%`,
                            top: `${y}%`,
                            width: `${p.size}px`,
                            height: `${p.size}px`,
                            borderRadius: '50%',
                            backgroundColor: p.color,
                            opacity: p.opacity * interpolate(frame, [0, 30], [0, 1], { extrapolateRight: 'clamp' }),
                        }}
                    />
                );
            })}
        </div>
    );
};

// ─── TypeWriter (bonus) ───────────────────────────────────────────────────────
// Efecto typewriter puro con cursor parpadeante — sin dependencias externas

interface TypeWriterProps {
    text: string;
    startFrame?: number;
    charsPerFrame?: number;
    style?: React.CSSProperties;
    showCursor?: boolean;
}

export const TypeWriter: React.FC<TypeWriterProps> = ({
    text,
    startFrame = 0,
    charsPerFrame = 0.5, // chars per frame (< 1 = slower)
    style = {},
    showCursor = true,
}) => {
    const frame = useCurrentFrame();
    const elapsed = Math.max(0, frame - startFrame);
    const charCount = Math.min(text.length, Math.floor(elapsed * charsPerFrame));
    const cursorVisible = Math.floor(frame / 15) % 2 === 0; // blink every 15 frames

    return (
        <span style={{ display: 'inline-block', ...style }}>
            {text.slice(0, charCount)}
            {showCursor && charCount < text.length && (
                <span style={{ opacity: cursorVisible ? 1 : 0 }}>|</span>
            )}
        </span>
    );
};
