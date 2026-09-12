import { Composition } from "remotion";
import { HelloWorld, myCompSchema } from "./HelloWorld";
import { Logo, myCompSchema2 } from "./HelloWorld/Logo";
import { TikTokComposition, tikTokSchema } from "./TikTokComposition";
import { TikTokVibe, tikTokVibeSchema } from "./TikTokVibe";
import { TikTokCinema, tikTokCinemaSchema } from "./TikTokCinema";
import { TikTokViral, tikTokViralSchema } from "./TikTokViral";
import { TikTokJobOffer, tikTokJobOfferSchema } from "./TikTokJobOffer";
import { DanceCompilation, danceCompilationSchema } from "./DanceCompilation";
import { TriviaComposition, triviaSchema } from "./TriviaComposition";
import { GithubRepoVideo, githubRepoSchema } from "./GithubRepoVideo";
import {
  GithubRepoVideoPart2,
  githubRepoPart2Schema,
} from "./GithubRepoVideoPart2";
import {
  GithubRepoVideoPart3,
  githubRepoPart3Schema,
} from "./GithubRepoVideoPart3";
import repoData from "../public/github-repo-data.json";

// Each <Composition> is an entry in the sidebar!

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        // You can take the "id" to render a video:
        // npx remotion render HelloWorld
        id="HelloWorld"
        component={HelloWorld}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
        // You can override these props for each render:
        // https://www.remotion.dev/docs/parametrized-rendering
        schema={myCompSchema}
        defaultProps={{
          titleText: "Hello User",
          titleColor: "#000000",
          logoColor1: "#91EAE4",
          logoColor2: "#86A8E7",
        }}
      />
      {/* Mount any React component to make it show up in the sidebar and work on it individually! */}
      <Composition
        id="OnlyLogo"
        component={Logo}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
        schema={myCompSchema2}
        defaultProps={{
          logoColor1: "#91dAE2" as const,
          logoColor2: "#86A8E7" as const,
        }}
      />
      <Composition
        key={`quote-${1}`}
        id={`QuoteVideo-${1}`}
        component={TikTokComposition}
        durationInFrames={300} // 10 seconds @ 30fps
        fps={30}
        width={1080}
        height={1920}
        schema={tikTokSchema}
        defaultProps={{
          quote: "item.text",
          videoStartOffset: 411, // Use the offset from the JSON
        }}
      />
      <Composition
        id="TikTokVideo2"
        component={TikTokComposition}
        durationInFrames={300}
        fps={30}
        width={1080}
        height={1920}
        schema={tikTokSchema}
        defaultProps={{
          quote: "Every drive tells a story the daylight never sees.",
          videoStartOffset: 300, // Start 10 seconds in
        }}
      />
      <Composition
        id="TikTokVideo3"
        component={TikTokComposition}
        durationInFrames={300}
        fps={30}
        width={1080}
        height={1920}
        schema={tikTokSchema}
        defaultProps={{
          quote: "Silence isn't empty, it's full of answers.",
          videoStartOffset: 600, // Start 20 seconds in
        }}
      />
      {/* New Aesthetic Variations */}
      <Composition
        id="TikTokVibe1"
        component={TikTokVibe}
        durationInFrames={300}
        fps={30}
        width={1080}
        height={1920}
        schema={tikTokVibeSchema}
        defaultProps={{
          quote: "Chill vibes only.",
          videoStartOffset: 1200,
        }}
      />
      <Composition
        id="TikTokCinema1"
        component={TikTokCinema}
        durationInFrames={300}
        fps={30}
        width={1080}
        height={1920}
        schema={tikTokCinemaSchema}
        defaultProps={{
          quote: "Life moves pretty fast.",
          videoStartOffset: 1500,
        }}
      />
      <Composition
        id="TikTokViral1"
        component={TikTokViral}
        durationInFrames={300}
        fps={30}
        width={1080}
        height={1920}
        schema={tikTokViralSchema}
        defaultProps={{
          quote: "THIS IS A VIRAL HOOK",
          videoStartOffset: 1800,
        }}
      />
      {/* ── TikTok Job Offer Video ─────────────────────────────────────
           Place your background image/video and watermark in public/ folder
           ─────────────────────────────────────────────────────────────── */}
      <Composition
        id="TikTokJobOffer"
        component={TikTokJobOffer}
        durationInFrames={450} // 15 seconds @ 30fps
        fps={30}
        width={1080}
        height={1920}
        schema={tikTokJobOfferSchema}
        defaultProps={{
          backgroundImage: "locations\\231373_20260909.jpg",
          backgroundType: "image" as const,
          videoStartOffset: 0,
          backgroundZoomStart: 1,
          backgroundZoomEnd: 1,
          backgroundPanXStart: 50,
          backgroundPanXEnd: 55,
          backgroundPanYStart: 50,
          backgroundPanYEnd: 45,
          backgroundRotationStart: 0,
          backgroundRotationEnd: 0,
          enableKenBurns: true,
          watermarkImage: "watermark.png",
          watermarkPosition: "bottom-right" as const,
          watermarkOpacity: 0.3,
          watermarkSize: 120,
          jobTitle: "Senior React Developer",
          companyName: "TechCorp Inc.",
          location: "Remote / San Francisco, CA",
          salary: "$140,000 - $180,000 / year",
          contractType: "Full-time",
          experienceLevel: "Senior (5+ years)",
          requirements: [
            "5+ years of React/TypeScript experience",
            "Strong knowledge of Next.js and modern React patterns",
            "Experience with state management (Redux, Zustand, Jotai)",
            "Familiarity with testing (Jest, React Testing Library)",
            "Good understanding of CI/CD pipelines",
          ],
          benefits: [
            "Competitive salary + equity package",
            "Fully remote with flexible hours",
            "Annual learning budget ($3,000)",
            "Health, dental & vision insurance",
            "401(k) matching + unlimited PTO",
          ],
          ctaText: "Apply Now →",
          ctaLink: "",
          primaryColor: "#3b82ff",
          backgroundOverlayOpacity: 0.1,
          musicVolume: 0.3,
          showText: false,
          autoFitImage: true,
          imageWidth: 1080,
          imageHeight: 1080,
        }}
      />
      {/* ── Dance Compilation ──────────────────────────────────────────
           Place your dance videos (dance1.mp4, dance2.mp4, etc.) and 
           background music in public/ folder
           ─────────────────────────────────────────────────────────────── */}
      <Composition
        id="DanceCompilation"
        component={DanceCompilation}
        durationInFrames={1050} // 35 seconds @ 30fps
        fps={30}
        width={1080}
        height={1920}
        schema={danceCompilationSchema}
        defaultProps={{
          compilationTitle: "DANCE COMPILATION",
          compilationSubtitle: "Best moves of the week",
          primaryColor: "#fe2c55",
          secondaryColor: "#3b82f6",
          backgroundMusic: "background-music.mp3",
          musicVolume: 0,
          transitionStyle: "crossfade" as const,
          transitionDuration: 15,
          showProgressBar: false,
          showClipCounter: true,
          enableParticles: true,
          watermark: "",
          watermarkOpacity: 0.25,
          clips: [
            {
              src: "dance1.mp4",
              title: "VIRAL HIP HOP",
              dancer: "Unknown",
              style: "Hip Hop",
              location: "LA Studio",
              themeColor: "#fe2c55",
              startFrom: 5,
              fit: "cover" as const,
              blurBackground: false,
              textDelay: 10,
              featured: false,
              muted: false,
              volume: 1,
              backgroundColor: "#000000",
              blurAmount: -196,
              opacity: 1,
              playbackRate: 1,
            },
            {
              src: "dance2.mp4",
              title: "SMOOTH CONTEMPORARY",
              dancer: "Unknown",
              style: "Contemporary",
              location: "NYC",
              themeColor: "#3b82f6",
              startFrom: 0.8,
              fit: "cover" as const,
              blurBackground: true,
              textDelay: 10,
              featured: false,
              muted: false,
              volume: 1,
              backgroundColor: "#000000",
              blurAmount: 10,
              opacity: 1,
              playbackRate: 1,
            },
            {
              src: "dance3.mp4",
              title: "LATIN FUSION FIRE",
              dancer: "Unknown",
              style: "Latin Fusion",
              location: "Miami",
              themeColor: "#f59e0b",
              startFrom: 2.2,
              fit: "cover" as const,
              blurBackground: true,
              textDelay: 10,
              featured: false,
              muted: false,
              volume: 1,
              backgroundColor: "#000000",
              blurAmount: 10,
              opacity: 1,
              playbackRate: 1,
            },
            {
              src: "dance4.mp4",
              title: "LATIN PERFECTION",
              dancer: "Unknown",
              style: "Latin Cover",
              location: "Practice Room",
              themeColor: "#ec4899",
              startFrom: 0,
              fit: "cover" as const,
              blurBackground: true,
              textDelay: 10,
              featured: false,
              muted: false,
              volume: 1,
              backgroundColor: "#000000",
              blurAmount: 10,
              opacity: 1,
              playbackRate: 1,
            },
            {
              src: "dance1.mp4",
              title: "VIRAL HIP HOP",
              dancer: "Unknown",
              style: "Hip Hop",
              location: "LA Studio",
              themeColor: "#fe2c55",
              startFrom: 6,
              fit: "cover" as const,
              blurBackground: false,
              textDelay: 10,
              featured: false,
              muted: false,
              volume: 1,
              backgroundColor: "#000000",
              blurAmount: -196,
              opacity: 1,
              playbackRate: 2,
            },
            {
              src: "dance4.mp4",
              title: "LATIN PERFECTION",
              dancer: "Unknown",
              style: "Latin Cover",
              location: "Practice Room",
              themeColor: "#ec4899",
              startFrom: 6,
              fit: "cover" as const,
              blurBackground: true,
              textDelay: 10,
              featured: false,
              muted: false,
              volume: 1,
              backgroundColor: "#000000",
              blurAmount: 10,
              opacity: 1,
              playbackRate: 0.5,
            },
          ],
        }}
      />
      <Composition
        id="TriviaVideo"
        component={TriviaComposition}
        durationInFrames={2700} // Increased to 90 seconds (30 * 90)
        fps={30}
        width={1080}
        height={1920}
        schema={triviaSchema}
        defaultProps={{
          pregunta: "¿Cómo se llama el hijo de Kratos?",
          answer: "Atreus",
          videoStartOffset: 0,
        }}
      />
      {/* ── GitHub Repo Video ──────────────────────────────────────────
           Props are driven by public/github-repo-data.json.
           Just regenerate that file with the skill and reload the studio.
      ─────────────────────────────────────────────────────────────── */}
      <Composition
        id="GithubRepoVideo"
        component={GithubRepoVideo}
        durationInFrames={300}
        fps={30}
        width={1080}
        height={1080}
        schema={githubRepoSchema}
        defaultProps={repoData.part1}
      />
      <Composition
        id="GithubRepoVideoPart2"
        component={GithubRepoVideoPart2}
        durationInFrames={300}
        fps={30}
        width={1080}
        height={1080}
        schema={githubRepoPart2Schema}
        defaultProps={repoData.part2}
      />
      <Composition
        id="GithubRepoVideoPart3"
        component={GithubRepoVideoPart3}
        durationInFrames={300}
        fps={30}
        width={1080}
        height={1080}
        schema={githubRepoPart3Schema}
        defaultProps={repoData.part3}
      />
    </>
  );
};
