import React from 'react';
import {
    AbsoluteFill,
    Audio,
    Img,
    OffthreadVideo,
    interpolate,
    spring,
    staticFile,
    useCurrentFrame,
    useVideoConfig,
} from 'remotion';
import { z } from 'zod';
import { loadFont } from '@remotion/google-fonts/SpaceGrotesk';
import { loadFont as loadInter } from '@remotion/google-fonts/Inter';
import { Briefcase, MapPin, DollarSign, CheckCircle, Star, Sparkles } from 'lucide-react';
import { GradientText, ShinyText, Particles, StarBorder } from './ReactBitsForRemotion';

const { fontFamily } = loadFont();
const { fontFamily: bodyFont } = loadInter();

export const tikTokJobOfferSchema = z.object({
    // Background media
    backgroundImage: z.string().default('job-background.jpg'),
    backgroundType: z.enum(['image', 'video']).default('image'),
    videoStartOffset: z.number().default(0),
    
    // Background zoom/pan controls (Ken Burns effect)
    // Use z.preprocess to handle string input from Remotion Studio and convert to number
    backgroundZoomStart: z.preprocess((val) => (typeof val === 'string' ? parseFloat(val) : val), z.number().min(0.5).max(3).default(1.0)),
    backgroundZoomEnd: z.preprocess((val) => (typeof val === 'string' ? parseFloat(val) : val), z.number().min(0.5).max(3).default(1.15)),
    backgroundPanXStart: z.preprocess((val) => (typeof val === 'string' ? parseFloat(val) : val), z.number().min(0).max(100).default(50)),
    backgroundPanXEnd: z.preprocess((val) => (typeof val === 'string' ? parseFloat(val) : val), z.number().min(0).max(100).default(55)),
    backgroundPanYStart: z.preprocess((val) => (typeof val === 'string' ? parseFloat(val) : val), z.number().min(0).max(100).default(50)),
    backgroundPanYEnd: z.preprocess((val) => (typeof val === 'string' ? parseFloat(val) : val), z.number().min(0).max(100).default(45)),
    backgroundRotationStart: z.preprocess((val) => (typeof val === 'string' ? parseFloat(val) : val), z.number().min(-10).max(10).default(0)),
    backgroundRotationEnd: z.preprocess((val) => (typeof val === 'string' ? parseFloat(val) : val), z.number().min(-10).max(10).default(2)),
    enableKenBurns: z.boolean().default(true),
    
    // Watermark
    watermarkImage: z.string().default('watermark.png'),
    watermarkPosition: z.enum(['bottom-right', 'top-right', 'bottom-left', 'top-left']).default('bottom-right'),
    // Use z.preprocess to handle string input from Remotion Studio and convert to number
    watermarkOpacity: z.preprocess((val) => (typeof val === 'string' ? parseFloat(val) : val), z.number().min(0).max(1).default(0.3)),
    watermarkSize: z.number().default(120),
    
    // Job Information
    jobTitle: z.string(),
    companyName: z.string(),
    location: z.string(),
    salary: z.string(),
    contractType: z.string().default('Full-time'),
    experienceLevel: z.string().default('Mid-level'),
    
    // Requirements & Benefits
    requirements: z.array(z.string()).default([]),
    benefits: z.array(z.string()).default([]),
    
    // CTA
    ctaText: z.string().default('Apply Now'),
    ctaLink: z.string().default(''),
    
    // Styling
    primaryColor: z.string().default('#3b82f6'),
    backgroundOverlayOpacity: z.number().min(0).max(1).default(0.6),
    
    // Audio
    backgroundMusic: z.string().optional(),
    musicVolume: z.number().min(0).max(1).default(0.3),
    
    // Display options
    showText: z.boolean().default(true),
    
    // Auto-fit image to video frame (calculates optimal zoom to show full image without cropping)
    autoFitImage: z.boolean().default(false),
    // Optional: provide image dimensions for auto-fit calculation (if not provided, assumes image matches video aspect ratio)
    imageWidth: z.number().positive().optional(),
    imageHeight: z.number().positive().optional(),
});

type TikTokJobOfferProps = z.infer<typeof tikTokJobOfferSchema>;

const SectionTitle: React.FC<{ 
    children: React.ReactNode; 
    icon?: React.ReactNode; 
    delay: number; 
    color?: string;
}> = ({ children, icon, delay, color = '#3b82f6' }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const entrance = spring({
        frame: frame - delay,
        fps,
        config: { damping: 15, stiffness: 120 },
    });

    const slideX = interpolate(entrance, [0, 1], [-60, 0], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
    });

    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                fontSize: '36px',
                fontWeight: 700,
                opacity: entrance,
                transform: `translateX(${slideX}px)`,
                marginBottom: '24px',
                marginTop: '32px',
                textShadow: '0 4px 20px rgba(0,0,0,0.8)',
            }}
        >
            {icon && <div style={{ color, fontSize: '32px' }}>{icon}</div>}
            <GradientText
                colors={['#ffffff', color, '#ffffff']}
                speedFrames={150}
                startFrame={delay}
                style={{ fontFamily, display: 'inline-block' }}
            >
                {children}
            </GradientText>
        </div>
    );
};

const InfoRow: React.FC<{ 
    icon: React.ReactNode; 
    label: string; 
    value: string; 
    delay: number; 
    iconColor?: string;
}> = ({ icon, label, value, delay, iconColor = '#3b82f6' }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const entrance = spring({
        frame: frame - delay,
        fps,
        config: { damping: 15, stiffness: 120 },
    });

    const slideX = interpolate(entrance, [0, 1], [-50, 0], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
    });

    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                fontSize: '28px',
                color: 'white',
                opacity: entrance,
                transform: `translateX(${slideX}px)`,
                marginBottom: '16px',
                textShadow: '0 2px 12px rgba(0,0,0,0.7)',
            }}
        >
            <div style={{ color: iconColor, fontSize: '26px', flexShrink: 0 }}>{icon}</div>
            <span style={{ fontWeight: 600, color: '#e0e0e0', minWidth: '140px' }}>{label}</span>
            <span style={{ fontWeight: 400, color: '#ffffff' }}>{value}</span>
        </div>
    );
};

const ListItem: React.FC<{ 
    text: string; 
    delay: number; 
    icon?: React.ReactNode;
    iconColor?: string;
}> = ({ text, delay, icon, iconColor = '#22c55e' }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const entrance = spring({
        frame: frame - delay,
        fps,
        config: { damping: 15, stiffness: 120 },
    });

    const slideX = interpolate(entrance, [0, 1], [-40, 0], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
    });
    const scale = interpolate(entrance, [0, 1], [0.85, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
    });

    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '14px',
                fontSize: '24px',
                color: '#e8e8e8',
                opacity: entrance,
                transform: `translateX(${slideX}px) scale(${scale})`,
                marginBottom: '12px',
                lineHeight: 1.5,
                textShadow: '0 2px 10px rgba(0,0,0,0.6)',
            }}
        >
            {icon && <div style={{ color: iconColor, fontSize: '22px', marginTop: '2px', flexShrink: 0 }}>{icon}</div>}
            <span style={{ fontWeight: 400 }}>{text}</span>
        </div>
    );
};

const CTAButton: React.FC<{ 
    text: string; 
    delay: number; 
    backgroundColor: string;
}> = ({ text, delay, backgroundColor }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const entrance = spring({
        frame: frame - delay,
        fps,
        config: { damping: 12, stiffness: 100 },
    });

    const scale = interpolate(entrance, [0, 1], [0.7, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
    });
    const opacity = interpolate(entrance, [0, 0.5, 1], [0, 0.8, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
    });

    // Pulse animation after entrance
    const pulseScale = 1 + Math.sin(frame / 10) * 0.02 * entrance;

    return (
        <div
            style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '20px 48px',
                backgroundColor,
                borderRadius: '50px',
                fontSize: '30px',
                fontWeight: 700,
                fontFamily,
                opacity,
                transform: `scale(${scale * pulseScale})`,
                boxShadow: `0 8px 32px ${backgroundColor}66`,
                textShadow: '0 2px 8px rgba(0,0,0,0.4)',
                marginTop: '20px',
            }}
        >
            <ShinyText
                text={text}
                color="#ffffff"
                shineColor="#ffffff"
                speedFrames={80}
                startFrame={delay}
                style={{ fontFamily, fontSize: '30px', fontWeight: 700, display: 'inline-block' }}
            />
            <Sparkles style={{ marginLeft: '12px', fontSize: '26px' }} />
        </div>
    );
};

const Watermark: React.FC<{ 
    src: string; 
    position: 'bottom-right' | 'top-right' | 'bottom-left' | 'top-left';
    opacity: number;
    size: number;
}> = ({ src, position, opacity, size }) => {
    const positions = {
        'bottom-right': { bottom: '40px', right: '40px' },
        'top-right': { top: '40px', right: '40px' },
        'bottom-left': { bottom: '40px', left: '40px' },
        'top-left': { top: '40px', left: '40px' },
    };

    const pos = positions[position];

    return (
        <Img
            src={staticFile(src)}
            style={{
                position: 'absolute',
                width: size,
                height: size,
                opacity,
                ...pos,
                pointerEvents: 'none',
                filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.5))',
                zIndex: 100,
            }}
        />
    );
};

export const TikTokJobOffer: React.FC<TikTokJobOfferProps> = ({
    backgroundImage,
    backgroundType,
    videoStartOffset,
    watermarkImage,
    watermarkPosition,
    watermarkOpacity,
    watermarkSize,
    jobTitle,
    companyName,
    location,
    salary,
    contractType,
    experienceLevel,
    requirements,
    benefits,
    ctaText,
    primaryColor,
    backgroundOverlayOpacity,
    backgroundMusic,
    musicVolume,
    // Ken Burns controls
    backgroundZoomStart,
    backgroundZoomEnd,
    backgroundPanXStart,
    backgroundPanXEnd,
    backgroundPanYStart,
    backgroundPanYEnd,
    backgroundRotationStart,
    backgroundRotationEnd,
    enableKenBurns,
    showText,
    // Auto-fit image
    autoFitImage,
    imageWidth,
    imageHeight,
}) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    // Title animation
    const titleSpring = spring({
        frame: frame - 10,
        fps,
        config: { damping: 12, stiffness: 100 },
    });

    const titleScale = interpolate(titleSpring, [0, 1], [0.8, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
    });

    // Company name animation
    const companyOpacity = interpolate(frame - 35, [0, 20], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
    });
    const companySlide = interpolate(companyOpacity, [0, 1], [40, 0], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
    });

    // Info rows animations
    const locationDelay = 55;
    const salaryDelay = 65;
    const contractDelay = 75;
    const experienceDelay = 85;

    // Requirements section
    const requirementsTitleDelay = 110;
    const requirementsListStartDelay = 130;

    // Benefits section
    const benefitsTitleDelay = 130 + requirements.length * 15 + 20;
    const benefitsListStartDelay = benefitsTitleDelay + 20;

    // CTA
    const ctaDelay = benefitsListStartDelay + benefits.length * 15 + 30;

    // Calculate total duration needed (used for reference, duration is set in Root.tsx)
    // const estimatedDuration = Math.max(360, ctaDelay + 60);

    // Background zoom animation for images (Ken Burns effect) - configurable via props
    const durationFrames = 450; // matches Root.tsx duration
    const bgScale = enableKenBurns ? interpolate(frame, [0, durationFrames], [backgroundZoomStart, backgroundZoomEnd], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
    }) : 1;
    
    // Subtle rotation for more dynamic feel
    const bgRotation = enableKenBurns ? interpolate(frame, [0, durationFrames], [backgroundRotationStart, backgroundRotationEnd], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
    }) : 0;

    // Auto-fit image calculation: if enabled and dimensions provided, calculate scale to fit image in frame
    // Video frame is 1080x1920 (TikTok vertical)
    const videoWidth = 1080;
    const videoHeight = 1920;
    
    // Calculate auto-fit scale if enabled and image dimensions provided
    const autoFitScale = (autoFitImage && imageWidth && imageHeight) 
        ? Math.min(videoWidth / imageWidth, videoHeight / imageHeight)
        : 1;
    
    // Apply auto-fit scale as base, then Ken Burns zoom on top
    const finalBgScale = autoFitScale * bgScale;

    return (
        <AbsoluteFill style={{ backgroundColor: '#050505', overflow: 'hidden' }}>
            {/* Background Layer */}
            <AbsoluteFill style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}>
                {backgroundType === 'video' ? (
                    <OffthreadVideo
                        src={staticFile(backgroundImage)}
                        startFrom={videoStartOffset}
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                        }}
                        muted
                    />
                ) : (
                    <Img
                        src={staticFile(backgroundImage)}
                        style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: `translate(-50%, -50%) scale(${finalBgScale}) rotate(${bgRotation}deg)`,
                            transformOrigin: 'center center',
                            maxWidth: '100%',
                            maxHeight: '100%',
                            objectFit: 'contain',
                            transition: 'none',
                        }}
                    />
                )}
                
                {/* ReactBits: Particles background effect */}
                <Particles 
                    count={40} 
                    colors={[primaryColor + '55', primaryColor + '88', '#ffffff33', '#22c55e44']} 
                    seed={7}
                />
                
                {/* Vignette effect for cinematic look */}
                <div
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.6) 100%)',
                        pointerEvents: 'none',
                    }}
                />
                
                {/* Dark overlay for text readability */}
                <div
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundColor: `rgba(0, 0, 0, ${backgroundOverlayOpacity})`,
                    }}
                />
                
                {/* Subtle gradient overlay for depth */}
                <div
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        background: `linear-gradient(180deg, rgba(0,0,0,0.3) 0%, transparent 40%, transparent 60%, rgba(0,0,0,0.4) 100%)`,
                    }}
                />
            </AbsoluteFill>

            {/* Watermark */}
            <Watermark
                src={watermarkImage}
                position={watermarkPosition}
                opacity={watermarkOpacity}
                size={watermarkSize}
            />

            {/* Background Music */}
            {backgroundMusic && (
                <Audio src={staticFile(backgroundMusic)} volume={musicVolume} />
            )}

            {/* Content Layer - only show if showText is true */}
            {showText && (
                <AbsoluteFill
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: '60px 50px',
                        zIndex: 10,
                    }}
                >
                {/* Job Title - with GradientText effect */}
                <div
                    style={{
                        textAlign: 'center',
                        opacity: titleSpring,
                        transform: `scale(${titleScale})`,
                        marginBottom: '8px',
                    }}
                >
                    <h1
                        style={{
                            fontFamily,
                            fontSize: '72px',
                            fontWeight: 800,
                            lineHeight: 1.1,
                            letterSpacing: '-1px',
                            textShadow: '0 6px 30px rgba(0,0,0,0.9)',
                        }}
                    >
                        <GradientText
                            colors={['#ffffff', primaryColor, '#a855f7', '#ffffff']}
                            speedFrames={180}
                            startFrame={10}
                            style={{ display: 'block' }}
                        >
                            {jobTitle}
                        </GradientText>
                    </h1>
                </div>

                {/* Company Name - with ShinyText effect */}
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '12px',
                        opacity: companyOpacity,
                        transform: `translateY(${companySlide}px)`,
                        marginBottom: '40px',
                    }}
                >
                    <Briefcase style={{ color: primaryColor, fontSize: '32px' }} />
                    <ShinyText
                        text={companyName}
                        color="#cccccc"
                        shineColor="#ffffff"
                        speedFrames={120}
                        startFrame={35}
                        style={{ fontFamily: bodyFont, fontSize: '34px', fontWeight: 500, textShadow: '0 2px 12px rgba(0,0,0,0.7)' }}
                    />
                </div>

                {/* Info Rows */}
                <div style={{ width: '100%', maxWidth: '700px', marginBottom: '30px' }}>
                    <InfoRow
                        icon={<MapPin size={26} />}
                        label="Location"
                        value={location}
                        delay={locationDelay}
                        iconColor={primaryColor}
                    />
                    <InfoRow
                        icon={<DollarSign size={26} />}
                        label="Salary"
                        value={salary}
                        delay={salaryDelay}
                        iconColor='#22c55e'
                    />
                    <InfoRow
                        icon={<Briefcase size={26} />}
                        label="Contract"
                        value={contractType}
                        delay={contractDelay}
                        iconColor='#f59e0b'
                    />
                    <InfoRow
                        icon={<Star size={26} />}
                        label="Level"
                        value={experienceLevel}
                        delay={experienceDelay}
                        iconColor='#a855f7'
                    />
                </div>

                {/* Divider */}
                <div
                    style={{
                        width: '100%',
                        maxWidth: '700px',
                        height: '1px',
                        background: `linear-gradient(90deg, transparent, ${primaryColor}44, ${primaryColor}, ${primaryColor}44, transparent)`,
                        marginBottom: '20px',
                        marginTop: '10px',
                    }}
                />

                {/* Requirements Section */}
                {requirements.length > 0 && (
                    <>
                        <SectionTitle
                            icon={<CheckCircle size={32} />}
                            delay={requirementsTitleDelay}
                            color={primaryColor}
                        >
                            Requirements
                        </SectionTitle>
                        {requirements.map((req, i) => (
                            <ListItem
                                key={i}
                                text={req}
                                delay={requirementsListStartDelay + i * 15}
                                icon={<CheckCircle size={22} />}
                                iconColor='#22c55e'
                            />
                        ))}
                    </>
                )}

                {/* Benefits Section */}
                {benefits.length > 0 && (
                    <>
                        <SectionTitle
                            icon={<Sparkles size={32} />}
                            delay={benefitsTitleDelay}
                            color='#f59e0b'
                        >
                            Benefits
                        </SectionTitle>
                        {benefits.map((benefit, i) => (
                            <ListItem
                                key={i}
                                text={benefit}
                                delay={benefitsListStartDelay + i * 15}
                                icon={<Star size={22} />}
                                iconColor='#f59e0b'
                            />
                        ))}
                    </>
                )}

                {/* CTA Button - with StarBorder effect */}
                <div style={{ opacity: 0 }}>
                    <CTAButton
                        text={ctaText}
                        delay={ctaDelay}
                        backgroundColor={primaryColor}
                    />
                </div>
                
                {/* Enhanced CTA with StarBorder */}
                <StarBorder
                    color={primaryColor}
                    speed={120}
                    borderRadius="50px"
                    padding="20px 48px"
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginTop: '20px',
                        opacity: 0,
                    }}
                >
                    <CTAButton
                        text={ctaText}
                        delay={ctaDelay}
                        backgroundColor={primaryColor}
                    />
                </StarBorder>
                </AbsoluteFill>
            )}
        </AbsoluteFill>
    );
};