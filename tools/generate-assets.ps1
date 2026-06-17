$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $PSScriptRoot
$dataDir = Join-Path $root "mock-data"
New-Item -ItemType Directory -Force -Path $dataDir | Out-Null

function New-CommMap {
  param([string]$Path)

  Add-Type -AssemblyName System.Drawing
  $bitmap = New-Object System.Drawing.Bitmap 1400, 900
  $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
  $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
  $graphics.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::ClearTypeGridFit

  $colors = @{
    bg = [System.Drawing.Color]::FromArgb(246, 248, 242)
    grid = [System.Drawing.Color]::FromArgb(213, 221, 208)
    road = [System.Drawing.Color]::FromArgb(97, 114, 86)
    routeA = [System.Drawing.Color]::FromArgb(177, 79, 67)
    routeB = [System.Drawing.Color]::FromArgb(11, 127, 131)
    routeC = [System.Drawing.Color]::FromArgb(184, 120, 30)
    ink = [System.Drawing.Color]::FromArgb(22, 33, 25)
    muted = [System.Drawing.Color]::FromArgb(96, 112, 100)
  }

  $graphics.Clear($colors.bg)

  $gridPen = New-Object System.Drawing.Pen($colors.grid, 1)
  for ($x = 0; $x -lt 1400; $x += 70) { $graphics.DrawLine($gridPen, $x, 0, $x, 900) }
  for ($y = 0; $y -lt 900; $y += 70) { $graphics.DrawLine($gridPen, 0, $y, 1400, $y) }

  $terrainBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(220, 229, 210))
  $terrain = [System.Drawing.Point[]]@(
    [System.Drawing.Point]::new(0, 610),
    [System.Drawing.Point]::new(210, 530),
    [System.Drawing.Point]::new(410, 590),
    [System.Drawing.Point]::new(610, 505),
    [System.Drawing.Point]::new(820, 585),
    [System.Drawing.Point]::new(1030, 500),
    [System.Drawing.Point]::new(1400, 560),
    [System.Drawing.Point]::new(1400, 900),
    [System.Drawing.Point]::new(0, 900)
  )
  $graphics.FillPolygon($terrainBrush, $terrain)

  $roadPen = New-Object System.Drawing.Pen($colors.road, 16)
  $roadPen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
  $roadPen.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
  $graphics.DrawBeziers($roadPen, [System.Drawing.Point[]]@(
    [System.Drawing.Point]::new(95, 690),
    [System.Drawing.Point]::new(315, 610),
    [System.Drawing.Point]::new(555, 705),
    [System.Drawing.Point]::new(740, 610),
    [System.Drawing.Point]::new(930, 500),
    [System.Drawing.Point]::new(1130, 505),
    [System.Drawing.Point]::new(1270, 390)
  ))

  $routeA = New-Object System.Drawing.Pen($colors.routeA, 9)
  $routeB = New-Object System.Drawing.Pen($colors.routeB, 9)
  $routeC = New-Object System.Drawing.Pen($colors.routeC, 9)
  foreach ($pen in @($routeA, $routeB, $routeC)) {
    $pen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
    $pen.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
  }

  $graphics.DrawLines($routeA, [System.Drawing.Point[]]@(
    [System.Drawing.Point]::new(135, 720),
    [System.Drawing.Point]::new(330, 610),
    [System.Drawing.Point]::new(540, 520),
    [System.Drawing.Point]::new(760, 410),
    [System.Drawing.Point]::new(1050, 340),
    [System.Drawing.Point]::new(1240, 260)
  ))
  $graphics.DrawLines($routeB, [System.Drawing.Point[]]@(
    [System.Drawing.Point]::new(135, 720),
    [System.Drawing.Point]::new(250, 780),
    [System.Drawing.Point]::new(520, 760),
    [System.Drawing.Point]::new(810, 635),
    [System.Drawing.Point]::new(1110, 520),
    [System.Drawing.Point]::new(1280, 365)
  ))
  $graphics.DrawLines($routeC, [System.Drawing.Point[]]@(
    [System.Drawing.Point]::new(135, 720),
    [System.Drawing.Point]::new(295, 650),
    [System.Drawing.Point]::new(470, 670),
    [System.Drawing.Point]::new(660, 620),
    [System.Drawing.Point]::new(850, 555),
    [System.Drawing.Point]::new(1040, 470)
  ))

  $shadowBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(86, 177, 79, 67))
  $shadowPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(220, 177, 79, 67), 4)
  $graphics.FillEllipse($shadowBrush, 610, 300, 310, 230)
  $graphics.DrawEllipse($shadowPen, 610, 300, 310, 230)

  $fontTitle = New-Object System.Drawing.Font("Segoe UI", 34, [System.Drawing.FontStyle]::Bold)
  $fontLabel = New-Object System.Drawing.Font("Segoe UI", 19, [System.Drawing.FontStyle]::Bold)
  $fontSmall = New-Object System.Drawing.Font("Segoe UI", 16, [System.Drawing.FontStyle]::Regular)
  $brushInk = New-Object System.Drawing.SolidBrush($colors.ink)
  $brushMuted = New-Object System.Drawing.SolidBrush($colors.muted)
  $graphics.DrawString("COMM COVERAGE / NIGHT MANEUVER MOCK", $fontTitle, $brushInk, 52, 42)
  $graphics.DrawString("Shadow Zone 01: A-route passes through expected radio dead zone", $fontSmall, $brushMuted, 56, 91)
  $graphics.DrawString("START", $fontLabel, $brushInk, 85, 747)
  $graphics.DrawString("OBJ", $fontLabel, $brushInk, 1235, 220)
  $graphics.DrawString("COMM SHADOW", $fontLabel, (New-Object System.Drawing.SolidBrush($colors.routeA)), 638, 282)
  $graphics.DrawString("SUPPLY WAIT", $fontSmall, $brushInk, 798, 650)
  $graphics.DrawString("MEDEVAC ALT", $fontSmall, $brushInk, 1038, 548)

  $legendBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(235, 255, 255, 255))
  $graphics.FillRectangle($legendBrush, 54, 135, 290, 145)
  $graphics.DrawRectangle((New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(188, 196, 184), 2)), 54, 135, 290, 145)
  $graphics.FillRectangle((New-Object System.Drawing.SolidBrush($colors.routeA)), 78, 163, 38, 12)
  $graphics.DrawString("A: fastest route", $fontSmall, $brushInk, 128, 151)
  $graphics.FillRectangle((New-Object System.Drawing.SolidBrush($colors.routeB)), 78, 203, 38, 12)
  $graphics.DrawString("B: stable bypass", $fontSmall, $brushInk, 128, 191)
  $graphics.FillRectangle((New-Object System.Drawing.SolidBrush($colors.routeC)), 78, 243, 38, 12)
  $graphics.DrawString("C: phased route", $fontSmall, $brushInk, 128, 231)

  $bitmap.Save($Path, [System.Drawing.Imaging.ImageFormat]::Png)
  $graphics.Dispose()
  $bitmap.Dispose()
}

function Escape-Xml {
  param([string]$Text)
  return [System.Security.SecurityElement]::Escape($Text)
}

function Add-ZipEntry {
  param($Zip, [string]$Name, [string]$Content)
  $entry = $Zip.CreateEntry($Name)
  $stream = $entry.Open()
  $bytes = [System.Text.Encoding]::UTF8.GetBytes($Content)
  $stream.Write($bytes, 0, $bytes.Length)
  $stream.Dispose()
}

function New-Xlsx {
  param(
    [string]$Path,
    [string]$SheetName,
    [string[][]]$Rows
  )

  if (Test-Path $Path) { Remove-Item -LiteralPath $Path -Force }
  Add-Type -AssemblyName System.IO.Compression
  $fileStream = [System.IO.File]::Open($Path, [System.IO.FileMode]::CreateNew)
  $zip = New-Object System.IO.Compression.ZipArchive($fileStream, [System.IO.Compression.ZipArchiveMode]::Create)

  Add-ZipEntry $zip "[Content_Types].xml" @"
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>
  <Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>
</Types>
"@
  Add-ZipEntry $zip "_rels/.rels" @"
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>
</Relationships>
"@
  Add-ZipEntry $zip "xl/workbook.xml" @"
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
  <sheets>
    <sheet name="$(Escape-Xml $SheetName)" sheetId="1" r:id="rId1"/>
  </sheets>
</workbook>
"@
  Add-ZipEntry $zip "xl/_rels/workbook.xml.rels" @"
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/>
</Relationships>
"@

  $columns = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".ToCharArray()
  $rowXml = New-Object System.Text.StringBuilder
  for ($r = 0; $r -lt $Rows.Count; $r++) {
    [void]$rowXml.Append("<row r=""$($r + 1)"">")
    for ($c = 0; $c -lt $Rows[$r].Count; $c++) {
      $cellRef = "$($columns[$c])$($r + 1)"
      $value = Escape-Xml $Rows[$r][$c]
      [void]$rowXml.Append("<c r=""$cellRef"" t=""inlineStr""><is><t>$value</t></is></c>")
    }
    [void]$rowXml.Append("</row>")
  }

  Add-ZipEntry $zip "xl/worksheets/sheet1.xml" @"
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
  <sheetData>
    $rowXml
  </sheetData>
</worksheet>
"@

  $zip.Dispose()
  $fileStream.Dispose()
}

function New-Pdf {
  param([string]$Path)

  $content = @"
BT
/F1 22 Tf
72 760 Td
(BATTLE-PROOF K MOCK OPERATION PLAN) Tj
/F1 14 Tf
0 -44 Td
(Operation: OO Battalion Night Maneuver Training) Tj
0 -24 Td
(COA A: Fastest route rapid deployment) Tj
0 -24 Td
(COA B: Stable bypass route deployment) Tj
0 -24 Td
(COA C: Phased movement with reserve hold) Tj
0 -36 Td
(Constraints: one radio shadow zone, limited supply waiting points, two vehicles under maintenance.) Tj
0 -24 Td
(Weather: early-morning fog and precipitation risk.) Tj
0 -24 Td
(Enemy: likely delay action and bypass route observation.) Tj
0 -24 Td
(SOP: reassess if communications are lost for more than 30 minutes.) Tj
ET
"@
  $streamLength = ([System.Text.Encoding]::ASCII.GetBytes($content)).Length
  $objects = @(
    "1 0 obj`n<< /Type /Catalog /Pages 2 0 R >>`nendobj`n",
    "2 0 obj`n<< /Type /Pages /Kids [3 0 R] /Count 1 >>`nendobj`n",
    "3 0 obj`n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>`nendobj`n",
    "4 0 obj`n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>`nendobj`n",
    "5 0 obj`n<< /Length $streamLength >>`nstream`n$content`nendstream`nendobj`n"
  )
  $pdf = "%PDF-1.4`n"
  $offsets = New-Object System.Collections.Generic.List[int]
  foreach ($object in $objects) {
    $offsets.Add(([System.Text.Encoding]::ASCII.GetBytes($pdf)).Length)
    $pdf += $object
  }
  $xrefOffset = ([System.Text.Encoding]::ASCII.GetBytes($pdf)).Length
  $pdf += "xref`n0 6`n0000000000 65535 f `n"
  foreach ($offset in $offsets) {
    $pdf += ("{0:0000000000} 00000 n `n" -f $offset)
  }
  $pdf += "trailer`n<< /Size 6 /Root 1 0 R >>`nstartxref`n$xrefOffset`n%%EOF`n"
  [System.IO.File]::WriteAllBytes($Path, [System.Text.Encoding]::ASCII.GetBytes($pdf))
}

New-CommMap -Path (Join-Path $dataDir "comm_coverage_map.png")
New-Pdf -Path (Join-Path $dataDir "operation_plan_mock.pdf")

New-Xlsx -Path (Join-Path $dataDir "coa_options.xlsx") -SheetName "COA Options" -Rows @(
  @("COA", "Concept", "Speed", "Stability", "Primary Risk"),
  @("A", "Fastest route rapid deployment", "High", "Low", "Predictable route and comm shadow"),
  @("B", "Stable bypass route deployment", "Medium", "High", "Longer movement time"),
  @("C", "Phased movement with reserve hold", "Low", "Medium", "Reserve deployment delay")
)

New-Xlsx -Path (Join-Path $dataDir "logistics_status.xlsx") -SheetName "Logistics" -Rows @(
  @("Item", "Status", "Constraint", "Agent Note"),
  @("Vehicles", "14 assigned", "2 under maintenance", "Reserve vehicle required"),
  @("Fuel", "Sufficient for base plan", "Limited night resupply window", "Add alternate supply point"),
  @("Supply point", "1 primary", "Insufficient waiting capacity", "Risk to COA A sustainment"),
  @("Maintenance team", "Available", "35 min travel time", "Delay compounds with route disruption")
)

Write-Host "Generated mock data assets in $dataDir"
