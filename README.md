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

## how to render one composition

```console
cmd /c npx remotion render TikTokVideo1 out/tiktok1_typed.mp4 --timeout 300000 --concurrency 4
```