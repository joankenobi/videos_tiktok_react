# Remotion video

<p align="center">
  <a href="https://github.com/remotion-dev/logo">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://github.com/remotion-dev/logo/raw/main/animated-logo-banner-dark.apng">
      <img alt="Animated Remotion Logo" src="https://github.com/remotion-dev/logo/raw/main/animated-logo-banner-light.gif">
    </picture>
  </a>
</p>

Welcome to your Remotion project!

## Commands

**Install Dependencies**

```console
npm install
```

**Start Preview**

```console
npm run dev
```

**Render video**

```console
npx remotion render
```

**Upgrade Remotion**

```console
npx remotion upgrade
```

## Docs

Get started with Remotion by reading the [fundamentals page](https://www.remotion.dev/docs/the-fundamentals).

## Help

We provide help on our [Discord server](https://discord.gg/6VzzNDwUwV).

## Issues

Found an issue with Remotion? [File an issue here](https://github.com/remotion-dev/remotion/issues/new).

## License

Note that for some entities a company license is needed. [Read the terms here](https://github.com/remotion-dev/remotion/blob/main/LICENSE.md).

## TikTok Job Offer CLI

A dedicated CLI for rendering the `TikTokJobOffer` composition with minimal required parameters.

### Quick Start

```console
# Minimal usage (only required parameters)
npm run render:job-offer -- --image "oferta de trabajo.jpg" --watermark "watermark.PNG"

# With auto-fit for landscape images
npm run render:job-offer -- --image "oferta de trabajo.jpg" --watermark "watermark.PNG" --auto-fit true --image-width 1920 --image-height 1080

# Full customization
npm run render:job-offer -- --image "job.jpg" --watermark "logo.png" --job-title "Frontend Engineer" --company-name "StartupXYZ" --salary "$100k-$150k" --primary-color "#ff6b35" --auto-fit true --image-width 1200 --image-height 800 --output "out/my-job-offer.mp4"
```

### Required Parameters

| Flag | Description |
|------|-------------|
| `-i, --image <path>` | Background image file (must be in `public/` folder) |
| `-w, --watermark <path>` | Watermark image file (must be in `public/` folder) |

### Optional Parameters

| Flag | Default | Description |
|------|---------|-------------|
| `-o, --output <path>` | `out/tiktok-job-offer.mp4` | Output video path |
| `--job-title <text>` | `Senior React Developer` | Job title |
| `--company-name <text>` | `TechCorp Inc.` | Company name |
| `--location <text>` | `Remote / San Francisco, CA` | Job location |
| `--salary <text>` | `$140,000 - $180,000 / year` | Salary range |
| `--contract-type <text>` | `Full-time` | Contract type |
| `--experience-level <text>` | `Senior (5+ years)` | Experience level |
| `--requirements <items...>` | Default list | Requirements (comma-separated) |
| `--benefits <items...>` | Default list | Benefits (comma-separated) |
| `--cta-text <text>` | `Apply Now →` | Call to action text |
| `--primary-color <hex>` | `#3b82f6` | Primary color |
| `--overlay-opacity <0-1>` | `0.6` | Background overlay opacity |
| `--music <path>` | none | Background music file (in `public/`) |
| `--music-volume <0-1>` | `0.3` | Music volume |
| `--show-text <boolean>` | `true` | Show text overlays |
| `--auto-fit <boolean>` | `false` | Auto-fit image to frame |
| `--image-width <number>` | - | Image width for auto-fit |
| `--image-height <number>` | - | Image height for auto-fit |
| `--zoom-start <number>` | `1.0` | Ken Burns zoom start |
| `--zoom-end <number>` | `1.15` | Ken Burns zoom end |
| `--rotation-start <deg>` | `0` | Ken Burns rotation start |
| `--rotation-end <deg>` | `2` | Ken Burns rotation end |
| `--ken-burns <boolean>` | `true` | Enable Ken Burns effect |
| `--watermark-position <pos>` | `bottom-right` | Watermark position |
| `--watermark-opacity <0-1>` | `0.3` | Watermark opacity |
| `--watermark-size <px>` | `120` | Watermark size |

### Auto-Fit Feature

The `--auto-fit` option automatically calculates the optimal zoom to show the **entire image** without cropping:

```console
npm run render:job-offer -- --image "landscape.jpg" --watermark "logo.png" --auto-fit true --image-width 1920 --image-height 1080
```

This works with any aspect ratio (landscape, portrait, square, ultra-wide).

### Standard Remotion Commands

**Install Dependencies**

```console
npm install
```

**Start Preview**

```console
npm run dev
```

**Render video (standard Remotion)**

```console
npx remotion render
```

**Upgrade Remotion**

```console
npx remotion upgrade
```

## Dance Compilation CLI

A dedicated CLI for rendering the `DanceCompilation` composition with 1-6 video clips plus overlays and music.

### Quick Start

```console
# Render the full video using the default 4-clip config
npm run render:dance

# Render with a custom clips JSON file
npx ts-node render-dance-compilation.ts --clips dance-clips.json -o out/my-compilation.mp4

# Override individual clip fields on top of the JSON (index is 1-based)
npx ts-node render-dance-compilation.ts --clips dance-clips.json \
  --clip-1-title "My Title" --clip-2-featured true --clip-3-muted false

# Render a still image for previews
npx ts-node render-dance-compilation.ts --clips dance-clips.json --still true --frame 60 -o out/dance-check.png
```

### Required Parameters

| Flag | Description |
|------|-------------|
| `-c, --clips <path>` | Path to a JSON file with an array of 1-6 clip objects |

Each clip object supports these fields:

| Field | Required | Default | Description |
|-------|----------|---------|-------------|
| `src` | yes | - | Video file (must be in `public/` folder) |
| `title` | yes | - | Display title for the clip |
| `dancer` | yes | - | Dancer name/handle |
| `style` | yes | - | Dance style/category |
| `location` | no | - | Location or vibe tag |
| `themeColor` | no | `#fe2c55` | Color theme for the clip's overlays |
| `textDelay` | no | `0` | Delay before text animations start (frames) |
| `featured` | no | `false` | Whether to show the "Featured" badge |
| `startFrom` | no | `0` | Start offset in seconds |
| `trimBefore` | no | - | Trim from start in frames |
| `trimAfter` | no | - | Trim from end in frames |
| `muted` | no | `true` | Mute the clip's own audio |
| `volume` | no | `1` | Clip volume (0-1) |
| `fit` | no | `cover` | `cover` fills frame (crops), `contain` shows all (letterboxes) |
| `backgroundColor` | no | `black` | Background color for letterboxing |
| `blurBackground` | no | `false` | Blur background when video doesn't fill the frame |
| `blurAmount` | no | `40` | Blur intensity |
| `opacity` | no | `1` | Video opacity |
| `playbackRate` | no | `1` | Playback rate |

### Optional Parameters

| Flag | Default | Description |
|------|---------|-------------|
| `-o, --output <path>` | `out/dance-compilation.mp4` | Output video or image path |
| `-m, --background-music <path>` | `background-music.mp3` | Background music file (in `public/`) |
| `--music-volume <0-1>` | `0.35` | Music volume |
| `--transition-style <style>` | `crossfade` | `crossfade`, `beat-snap`, `shader-wipe`, or `zoom` |
| `--transition-duration <frames>` | `15` | Transition duration in frames |
| `--compilation-title <text>` | `DANCE COMPILATION` | Compilation title |
| `--compilation-subtitle <text>` | `Best moves of the week` | Compilation subtitle |
| `--watermark <path>` | - | Watermark image file (in `public/`) |
| `--watermark-opacity <0-1>` | `0.3` | Watermark opacity |
| `--primary-color <hex>` | `#fe2c55` | Primary color |
| `--secondary-color <hex>` | `#3b82f6` | Secondary color |
| `--show-progress-bar <boolean>` | `true` | Show the global progress bar |
| `--show-clip-counter <boolean>` | `true` | Show the clip counter (1/4, 2/4, ...) |
| `--enable-particles <boolean>` | `true` | Enable particle effects |
| `--still <boolean>` | `false` | Render a still image instead of a video |
| `--frame <number>` | `0` | Frame to render when `--still true` |

### Per-Clip Overrides

Any clip field can be overridden from the CLI on top of the JSON file using the `--clip-<n>-<field>` pattern (index is 1-based, max 6):

```console
npm run render:dance -- --clips dance-clips.json \
  --clip-1-title "VIRAL HIP HOP" \
  --clip-2-dancer "@luna.dances" \
  --clip-3-featured true
```

### Batch Helper

`render-dance-clips.js` regenerates `dance-clips.json` with the 4 default clips (using `dance1.mp4`-`dance4.mp4`) and renders the full video:

```console
node render-dance-clips.js
```

> Note: running the batch helper overwrites `dance-clips.json` with the default storyboard config.

## How to Render One Composition

```console
cmd /c npx remotion render TikTokVideo1 out/tiktok1_typed.mp4 --timeout 300000 --concurrency 4
```