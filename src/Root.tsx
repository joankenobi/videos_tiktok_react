import { Composition } from "remotion";
import { HelloWorld, myCompSchema } from "./HelloWorld";
import { Logo, myCompSchema2 } from "./HelloWorld/Logo";
import { TikTokComposition, tikTokSchema } from './TikTokComposition';
import { TikTokVibe, tikTokVibeSchema } from './TikTokVibe';
import { TikTokCinema, tikTokCinemaSchema } from './TikTokCinema';
import { TikTokViral, tikTokViralSchema } from './TikTokViral';
import { TriviaComposition, triviaSchema } from './TriviaComposition';


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
          quote: 'Every drive tells a story the daylight never sees.',
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
          quote: 'Silence isn\'t empty, it\'s full of answers.',
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
          quote: 'Chill vibes only.',
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
          quote: 'Life moves pretty fast.',
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
          quote: 'THIS IS A VIRAL HOOK',
          videoStartOffset: 1800,
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

    </>
  );
};
