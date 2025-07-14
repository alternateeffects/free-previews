@echo off
set input_folder=clips-watermarked
set output_folder=thumbs-watermarked

if not exist "%output_folder%" mkdir "%output_folder%"

for %%F in (%input_folder%\*.mp4) do (
    set name=%%~nF
    if not exist "%output_folder%\%%~nF.jpg" (
        echo Generuję miniaturkę do: %%~nxF
        ffmpeg -y -ss 00:00:01.0 -i "%%F" -frames:v 1 -q:v 3 "%output_folder%\%%~nF.jpg"
    )
)
echo Gotowe!
pause