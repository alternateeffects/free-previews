$baseDir = "clips"
$outDir = "clips-watermarked"

$wm_light_landscape = "assets\watermark-light-landscape.png"
$wm_light_portrait = "assets\watermark-light-portrait.png"
$wm_strong_landscape = "assets\watermark-strong-landscape.png"
$wm_strong_portrait = "assets\watermark-strong-portrait.png"

if (!(Test-Path $outDir)) { New-Item -ItemType Directory -Path $outDir }

foreach ($variant in @("light", "strong", "none")) {
    $indir = Join-Path $baseDir $variant
    Get-ChildItem -Path $indir -Filter *.mp4 | ForEach-Object {
        $file = $_.FullName
        $basename = [System.IO.Path]::GetFileNameWithoutExtension($file)
        $outfile = "$outDir\$basename-watermarked-$variant.mp4"

        if (!(Test-Path $outfile)) {
            # Rozpoznaj rozmiar
            $stream = & ffprobe -v error -select_streams v:0 -show_entries stream=width,height `
                -of csv=p=0:s=x $file
            $w,$h = $stream -split "x"

            if ([int]$w -ge [int]$h) { $orientation = "landscape" } else { $orientation = "portrait" }

            if ($variant -eq "light") {
                if ($orientation -eq "landscape") {
                    Write-Host "Light LANDSCAPE: $file"
                    & ffmpeg -i $file -i $wm_light_landscape -filter_complex "overlay=0:0" -c:a copy $outfile
                } else {
                    Write-Host "Light PORTRAIT: $file"
                    & ffmpeg -i $file -i $wm_light_portrait -filter_complex "overlay=0:0" -c:a copy $outfile
                }
            } elseif ($variant -eq "strong") {
                if ($orientation -eq "landscape") {
                    Write-Host "Strong LANDSCAPE: $file"
                    & ffmpeg -i $file -i $wm_strong_landscape -filter_complex "overlay=0:0" -c:a copy $outfile
                } else {
                    Write-Host "Strong PORTRAIT: $file"
                    & ffmpeg -i $file -i $wm_strong_portrait -filter_complex "overlay=0:0" -c:a copy $outfile
                }
            } else {
                Write-Host "NONE (no watermark): $file"
                & ffmpeg -i $file -c:a copy $outfile
            }
        } else {
            Write-Host "[SKIP] $outfile already exists."
        }
    }
}
Write-Host "Done."
Pause