Add-Type -AssemblyName System.Drawing

$output = Join-Path $PSScriptRoot '..\static\im\tabs'
New-Item -ItemType Directory -Force -Path $output | Out-Null

function New-Pen([string]$color, [single]$width = 1.8) {
    $pen = [System.Drawing.Pen]::new([System.Drawing.ColorTranslator]::FromHtml($color), $width)
    $pen.StartCap = 'Round'
    $pen.EndCap = 'Round'
    $pen.LineJoin = 'Round'
    return $pen
}

function Draw-Icon([string]$name, [bool]$selected) {
    $bitmap = [System.Drawing.Bitmap]::new(96, 96)
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    $graphics.SmoothingMode = 'AntiAlias'
    $graphics.PixelOffsetMode = 'HighQuality'
    $graphics.Clear([System.Drawing.Color]::Transparent)
    $graphics.ScaleTransform(4, 4)
    $color = if ($selected) { '#2563EB' } else { '#748299' }
    $pen = New-Pen $color
    $brush = [System.Drawing.SolidBrush]::new([System.Drawing.ColorTranslator]::FromHtml($color))

    switch ($name) {
        'message' {
            $bubble = [System.Drawing.Drawing2D.GraphicsPath]::new()
            $bubble.AddArc(3, 3.5, 18, 16, 180, 90)
            $bubble.AddArc(3, 3.5, 18, 16, 270, 90)
            $bubble.AddArc(3, 3.5, 18, 16, 0, 70)
            $bubble.AddLine(18.1, 17.1, 18.7, 20.6)
            $bubble.AddLine(18.7, 20.6, 14.8, 18.7)
            $bubble.AddArc(3, 3.5, 18, 16, 90, 90)
            $graphics.DrawPath($pen, $bubble)
            $graphics.DrawLine($pen, 7.6, 9.8, 16.4, 9.8)
            $graphics.DrawLine($pen, 7.6, 13.4, 13.4, 13.4)
            $bubble.Dispose()
        }
        'contacts' {
            $graphics.DrawEllipse($pen, 4.3, 4.8, 6.2, 6.2)
            $graphics.DrawEllipse($pen, 13.5, 4.8, 6.2, 6.2)
            $graphics.DrawArc($pen, 1.8, 13.7, 11.8, 7.8, 194, 152)
            $graphics.DrawArc($pen, 10.4, 13.7, 11.8, 7.8, 194, 152)
        }
        'add' {
            if ($selected) {
                $graphics.FillEllipse($brush, 2.8, 2.8, 18.4, 18.4)
                $plus = New-Pen '#FFFFFF' 2
            } else {
                $graphics.DrawEllipse($pen, 2.8, 2.8, 18.4, 18.4)
                $plus = $pen
            }
            $graphics.DrawLine($plus, 12, 7.7, 12, 16.3)
            $graphics.DrawLine($plus, 7.7, 12, 16.3, 12)
            if ($selected) { $plus.Dispose() }
        }
        'profile' {
            $graphics.DrawEllipse($pen, 8.5, 3.4, 7, 7)
            $graphics.DrawArc($pen, 3.8, 12.2, 16.4, 10.1, 192, 156)
        }
    }

    $suffix = if ($selected) { '-selected' } else { '' }
    $path = Join-Path $output "$name$suffix.png"
    $bitmap.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)
    $brush.Dispose()
    $pen.Dispose()
    $graphics.Dispose()
    $bitmap.Dispose()
}

foreach ($name in @('message', 'contacts', 'add', 'profile')) {
    Draw-Icon $name $false
    Draw-Icon $name $true
}
