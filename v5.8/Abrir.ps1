$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$port = 8765
$url = "http://127.0.0.1:$port/"
Set-Location $root

function Test-HaruServer {
  try {
    $req = [System.Net.WebRequest]::Create($url)
    $req.Timeout = 800
    $req.Method = "GET"
    $res = $req.GetResponse()
    $res.Close()
    return $true
  } catch {
    return $false
  }
}

if (-not (Test-HaruServer)) {
  $python = Get-Command python -ErrorAction SilentlyContinue
  if (-not $python) {
    Write-Host "Python nao encontrado. O carrinho so funciona se o site abrir como http:// e nao como arquivo."
    Start-Process (Join-Path $root "index.html")
    exit 1
  }
  Start-Process -FilePath $python.Source -ArgumentList "-m","http.server","$port" -WorkingDirectory $root -WindowStyle Hidden
  $ok = $false
  for ($i = 0; $i -lt 25; $i++) {
    Start-Sleep -Milliseconds 160
    if (Test-HaruServer) {
      $ok = $true
      break
    }
  }
  if (-not $ok) {
    Write-Host "O servidor local nao subiu."
    exit 1
  }
}

Start-Process $url
exit 0
