$indir = "clips-watermarked"
$outfile = "clips.json"

# Zdefiniuj tagi/klucze
$tagMap = @{
    "silhouette" = "silhouettes"
    "neon"       = "neon icons"
    "viral"      = "viral reels"
    "paper"      = "paper animations"
    "green"      = "green screen"
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

    $clipList += [PSCustomObject]@{
        title = $title
        file  = "$indir/$file"
        tags  = $tags
        thumbnail = ""
        orientation = $orientation
    }
}

$clipList | ConvertTo-Json -Depth 3 | Out-File -Encoding UTF8 $outfile
Write-Host "clips.json wygenerowano! ($($clipList.Count) plików)"