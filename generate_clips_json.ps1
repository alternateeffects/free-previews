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
    $clipList += [PSCustomObject]@{
        title = $title
        file  = "$indir/$file"
        tags  = $tags
        thumbnail = ""
    }
}

$clipList | ConvertTo-Json -Depth 3 | Out-File -Encoding UTF8 $outfile
Write-Host "clips.json wygenerowano! ($($clipList.Count) plików)"