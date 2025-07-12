@echo off
setlocal enabledelayedexpansion

set "ffmpeg=ffmpeg"
set "input_dir=clips"
set "output_dir=clips-watermarked"
set "landscape=assets\watermark-landscape.png"
set "portrait=assets\watermark-portrait.png"

if not exist "%output_dir%" mkdir "%output_dir%"

for %%F in (%input_dir%\*.mp4) do (
    for /f "tokens=1,2 delims=x" %%A in ('%ffmpeg% -i "%%F" 2^>^&1 ^| findstr /C:"Video:"') do (
        set "resolution=%%A"
        set "filename=%%~nxF"
        set "filename_noext=%%~nF"
        set "output=%output_dir%\!filename_noext!-watermarked.mp4"

        echo Processing !filename!

        if %%A GEQ %%B (
            %ffmpeg% -i "%%F" -i "%landscape%" -filter_complex "overlay=W-w-20:H-h-20" -c:a copy "!output!"
        ) else (
            %ffmpeg% -i "%%F" -i "%portrait%" -filter_complex "overlay=W-w-20:H-h-20" -c:a copy "!output!"
        )
    )
)

echo Done.
pause
