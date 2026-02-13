import { bundle } from "@remotion/bundler";
import { getCompositions, renderMedia, } from "@remotion/renderer";
import path from "path";
import fs from "fs";

const renderAll = async () => {
    const quotes = JSON.parse(fs.readFileSync("./src/quest.json", "utf-8"));
    let videoBacksUsed = JSON.parse(fs.readFileSync("./src/videobackused.json", "utf-8"));
    console.log(videoBacksUsed, "videoBacksUsed");
    console.log("Starting render bundle...");
    const bundleLocation = await bundle({
        entryPoint: path.resolve("src/index.ts"),
        // If you have a custom webpack config, add it here
    });

    const compositions = await getCompositions(bundleLocation);
    const quoteComps = compositions.filter((c) => c.id.startsWith("Trivia"));

    console.log(`Found ${quoteComps.length} compositions to render.`);

    for (const comp of quoteComps) {
        for (const quote of quotes){
            if (quote.id === 1 || quote.id > 4 ){
                continue;
            }
            const outputLocation = `out/${comp.id}-trivia${quote.id}.mp4`;
            console.log(`Rendering ${comp.id}-${quote.id} to ${outputLocation}...`);
            comp.props.pregunta = quote.pregunta;
            comp.props.videoStartOffset = videoBacksUsed.offsetseg;
            console.log(comp);

            await renderMedia({
                composition: comp,
                serveUrl: bundleLocation,
                codec: "h264",
                outputLocation,
                onProgress: ({ progress }) => {
                    process.stdout.write(`\rProgress: ${Math.round(progress * 100)}%`);
                },
            });

            videoBacksUsed.offsetseg += 120;
        }
        console.log(`\nFinished rendering ${comp.id}`);
    }

    console.log("All renders complete!");
    fs.writeFileSync("./src/videobackused.json", JSON.stringify(videoBacksUsed, null, 2));
};

renderAll().catch((err) => {
    console.error(err);
    process.exit(1);
});
