---
name: react-bits-remotion
description: Guía de integración de react-bits (reactbits.dev) con Remotion — qué componentes son compatibles, cómo portarlos y cómo usar ReactBitsForRemotion.tsx
---

# Integración react-bits + Remotion

## 🚫 El problema central

Los componentes originales de [react-bits](https://reactbits.dev) usan tecnologías **incompatibles** con el renderizado determinístico de Remotion:

| react-bits usa | Problema en Remotion |
|---|---|
| `framer-motion` / `useAnimationFrame` | No sincroniza con `useCurrentFrame()` → flickering |
| `setInterval` / timers | No determinístico en renderizado headless |
| WebGL / OGL / Canvas APIs | Render asíncrono → frames en blanco |
| Mouse/scroll events | No existen en renderizado headless |

**Regla de oro:** En Remotion, TODO el tiempo de animación debe derivar de `useCurrentFrame()`. Cualquier componente que use tiempo real del browser producirá flickering o frames incoherentes.

---

## ✅ Cómo usar react-bits en Remotion

### Opción A: Usar `ReactBitsForRemotion.tsx`

El proyecto incluye `/src/ReactBitsForRemotion.tsx` con 5 componentes ya portados:

```tsx
import {
  DecryptedText,  // Efecto descifrado letra a letra
  ShinyText,      // Brillo deslizante (gradiente)
  GradientText,   // Gradiente multi-color animado
  StarBorder,     // Borde con estrella orbitando
  Particles,      // Partículas flotantes (CSS puro)
  TypeWriter,     // Typewriter con cursor parpadeante
} from './ReactBitsForRemotion';
```

Todos los componentes aceptan `startFrame` para retrasar la animación.

### Opción B: Portar manualmente un componente nuevo

**Patrón de port:**

```tsx
// ❌ Original (incompatible)
useEffect(() => {
  const interval = setInterval(() => setProgress(p => p + 1), 16);
  return () => clearInterval(interval);
}, []);

// ✅ Remotion port
const frame = useCurrentFrame();
const { fps } = useVideoConfig();
const progress = interpolate(frame - startFrame, [0, durationFrames], [0, 100], {
  extrapolateRight: 'clamp',
});
```

---

## 📦 Catálogo de compatibilidad

### ✅ Compatible / Port fácil (solo CSS/SVG)

| Componente | Categoría | Dónde usarlo |
|---|---|---|
| `DecryptedText` | TextAnimation | Hook/CTA reveal dramático |
| `ShinyText` | TextAnimation | CTA final brillante |
| `GradientText` | TextAnimation | Títulos/repo names |
| `SplitText` | TextAnimation | Entrada por palabras |
| `GlitchText` | TextAnimation | Efecto tech/hacker |
| `StarBorder` | Animation | Cards con borde orbitante |
| `ElectricBorder` | Animation | Cards tech |
| `DotGrid` | Background | Fondo grid de puntos |
| `Squares` | Background | Fondo cuadrícula |
| `Particles` | Background | Partículas CSS (portado) |

### ⚠️ Compatible con adaptación media (framer-motion → interpolate)

| Componente | Requiere |
|---|---|
| `BlurText` | De `useSpring` → `spring()` de Remotion |
| `FadeContent` | De `motion` → `interpolate` |
| `GradualBlur` | `blur` + `interpolate` |
| `CountUp` | De `useState` → `interpolate` |

### ❌ Incompatible (requiere WebGL / physics / events)

| Componente | Por qué |
|---|---|
| `Particles` (original) | WebGL/OGL renderer |
| `Aurora`, `Silk`, `Iridescence` | WebGL shaders |
| `Ballpit`, `Galaxy` | Physics engine |
| `SplashCursor`, `BlobCursor` | Mouse tracking |
| `ScrollVelocity`, `ScrollFloat` | Scroll events |

---

## 📐 Regla obligatoria: Props editables para componentes react-bits

> [!IMPORTANT]
> **Siempre que se use un componente de `ReactBitsForRemotion.tsx` en una composición, sus propiedades visuales importantes DEBEN estar expuestas como props en el Zod schema de la composición**, para que puedan configurarse desde `github-repo-data.json` sin tocar el código del componente.

### Qué props exponer por componente

| Componente | Props requeridas en schema |
|---|---|
| `DecryptedText` | `decryptedEncryptedColor`, `decryptedRevealedColor`, `decryptedDuration` |
| `ShinyText` | `shinyColor`, `shineColor`, `shinySpeed` |
| `GradientText` | `gradientColors` (array), `gradientSpeed` |
| `StarBorder` | `starBorderColor`, `starBorderSpeed` |
| `Particles` | `particlesCount`, `particlesColors` (array), `particlesSeed` |

### Patrón de implementación

```tsx
// 1. Añade al schema Zod:
export const mySchema = z.object({
  // ... props de contenido ...
  // react-bits
  particlesCount: z.number().default(35),
  particlesColors: z.array(z.string()).default(['#1d4ed888', '#3b82f644']),
  gradientColors: z.array(z.string()).default(['#ffffff', '#93c5fd', '#3b82f6']),
  decryptedEncryptedColor: z.string().default('#1d4ed8'),
  decryptedRevealedColor: z.string().default('#3b82f6'),
});

// 2. Desestructura en el componente:
export const MyComposition: React.FC<z.infer<typeof mySchema>> = ({
  // ... props de contenido ...
  particlesCount, particlesColors,
  gradientColors,
  decryptedEncryptedColor, decryptedRevealedColor,
}) => {
  // 3. Pasa los props al componente:
  return (
    <>
      <Particles count={particlesCount} colors={particlesColors} />
      <GradientText colors={gradientColors}>Título</GradientText>
      <DecryptedText
        encryptedColor={decryptedEncryptedColor}
        revealedColor={decryptedRevealedColor}
        text="Hook text"
      />
    </>
  );
};
```

```json
// 4. Configura desde github-repo-data.json:
{
  "part1": {
    "particlesCount": 35,
    "particlesColors": ["#1d4ed888", "#3b82f644", "#6366f133"],
    "gradientColors": ["#ffffff", "#93c5fd", "#3b82f6", "#ffffff"],
    "decryptedEncryptedColor": "#1d4ed8",
    "decryptedRevealedColor": "#3b82f6"
  }
}
```

---

## Componentes en uso (por composición)

| Video | Componentes activos | Props editables en JSON |
|---|---|---|
| `GithubRepoVideo` (Part 1) | `Particles`, `DecryptedText`, `GradientText` | `particlesCount/Colors/Seed`, `gradientColors/Speed`, `decryptedEncryptedColor`, `decryptedRevealedColor` |
| `GithubRepoVideoPart2` | `StarBorder`, `DecryptedText` | `starBorderColor`, `starBorderSpeed`, `decryptedCtaColor` |
| `GithubRepoVideoPart3` | `Particles`, `GradientText`, `ShinyText` | `particlesCount/Colors/Seed`, `gradientHookColors`, `shinyCtaColor`, `shineColor` |
