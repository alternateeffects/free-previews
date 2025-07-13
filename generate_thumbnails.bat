@echo off
for %%F in (clips-watermarked\*.mp4) do (
  ffmpeg -y -ss 00:00:01 -i "%%F" -frames:v 1 -q:v 3 "thumbs-watermarked\%%~nF.jpg"
)