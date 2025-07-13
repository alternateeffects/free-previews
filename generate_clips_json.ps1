$indir = "clips-watermarked"
$outfile = "clips.json"

# Tag map
$tagMap = @{
    "silhouette" = "silhouettes"
    "neon"       = "neon icons"
    "viral"      = "viral reels"
    "paper"      = "paper animations"
    "green"      = "green screen"
	"satisfying" = "satisfying"
	"kinetic"    = "kinetic infographic"
	"maps"       = "maps bars"
	"space"      = "space clips"
    # dodawaj tu kolejne klucze/tagi według własnych zasad!
}

$clipList = @()

Get-ChildItem -Path $indir -Filter *.mp4 | ForEach-Object {
    $file = $_.Name
    $title = [System.IO.Path]::GetFileNameWithoutExtension($file)
    $tags = @()
    foreach ($key in $tagMap.Keys) {
        if ($file.ToLower().Contains($key)) { $tags += $tagMap[$key] }
    }
    if ($tags.Count -eq 0) { $tags = @("other") }

    # ---- ORIENTATION: rozpoznawanie za pomocą ffprobe ----
    $ffout = & ffprobe -v error -select_streams v:0 -show_entries stream=width,height `
                -of csv=s=x:p=0 "$indir\$file"
    $w,$h = $ffout -split "x"
    if (([int]$w) -ge ([int]$h)) { $orientation = "landscape" } else { $orientation = "portrait" }
    # ---- END ORIENTATION ----

    # ---- WATERMARK rozpoznaj po nazwie ----
    if ($file -like "*-watermarked-light.mp4")  { $watermark = "light";  $haswatermark = $true }
    elseif ($file -like "*-watermarked-strong.mp4") { $watermark = "strong"; $haswatermark = $true }
    elseif ($file -like "*-watermarked-none.mp4")   { $watermark = "none"; $haswatermark = $false }
    else { $watermark = "unknown"; $haswatermark = $false }

    # ---- THUMBNAIL: portrait/landscape ----
    if ($orientation -eq "landscape") {
        $thumbnail = "assets/thumbnail-landscape.png"
    } else {
        $thumbnail = "assets/thumbnail-portrait.png"
    }

    $clipList += [PSCustomObject]@{
        title = $title
        file  = "$indir/$file"
        tags  = $tags
        thumbnail = $thumbnail
        orientation = $orientation
        watermark = $watermark
        has_watermark = $haswatermark
    }
}

$clipList | ConvertTo-Json -Depth 3 | Out-File -Encoding UTF8 $outfile
Write-Host "clips.json wygenerowano! ($($clipList.Count) plików)"