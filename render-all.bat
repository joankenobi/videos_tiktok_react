@echo off
set comps=1 2 3
for %%i in (%comps%) do (
    echo Rendering QuoteVideo-%%i...
    npx remotion render QuoteVideo-%%i out/video-%%i.mp4 --timeout 120000 --concurrency 4
)
echo All renders finished!

@REM {
@REM   id: 'TikTokVideo3',
@REM   width: 1080,
@REM   height: 1920,
@REM   fps: 30,
@REM   durationInFrames: 300,
@REM   props: {
@REM     quote: "Silence isn't empty, it's full of answers.",
@REM     videoStartOffset: 600
@REM   },
@REM   defaultProps: {
@REM     quote: "Silence isn't empty, it's full of answers.",
@REM     videoStartOffset: 600
@REM   },
@REM   defaultCodec: null,
@REM   defaultOutName: null,
@REM   defaultVideoImageFormat: null,
@REM   defaultPixelFormat: null,
@REM   defaultProResProfile: null
@REM }