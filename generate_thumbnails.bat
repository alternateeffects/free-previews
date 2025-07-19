@echo off
set input_folder=clips-watermarked
set output_folder=thumbs-watermarked

if not exist "%output_folder%" mkdir "%output_folder%"

for /R "%input_folder%" %%F in (*.mp4) do (
    set "name=%%~nF"
    setlocal enabledelayedexpansion
    if not exist "%output_folder%\%%~nF.jpg" (
        echo Generuję miniaturkę do: %%~nxF
        ffmpeg -y -ss 00:00:03.0 -i "%%F" -frames:v 1 -q:v 3 "%output_folder%\%%~nF.jpg"
    )
    endlocal
)
echo Gotowe!
pause