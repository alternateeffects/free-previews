@echo off
setlocal enabledelayedexpansion

set "ffmpeg=ffmpeg"
set "input_dir=clips"
set "output_dir=clips-watermarked"
set "landscape=assets\watermark-landscape.png"
set "portrait=assets\watermark-portrait.png"

if not exist "%output_dir%" mkdir "%output_dir%"

for %%F in (%input_dir%\*.mp4) do (
    set "filename=%%~nxF"
    set "filename_noext=%%~nF"
    set "output=%output_dir%\!filename_noext!-watermarked.mp4"

    if not exist "!output!" (
        for /f "tokens=1,2 delims=x" %%A in ('%ffmpeg% -i "%%F" 2^>^&1 ^| findstr /C:"Video:"') do (
            echo Processing !filename!

            rem LANDSCAPE
            if %%A GEQ %%B (
                %ffmpeg% -i "%%F" -i "%landscape%" -filter_complex "overlay=0:0" -c:a copy "!output!"
            ) else (
                rem PORTRAIT - zostaw scale2ref jeśli watermark może być inny niż 720x1280
                %ffmpeg% -i "%%F" -i "%portrait%" -filter_complex "[1][0]scale2ref=iw:ih[wm][vid];[vid][wm]overlay=0:0" -c:a copy "!output!"
            )
        )
    ) else (
        echo [SKIP] !output! already exists.
    )
)

echo Done.
pause