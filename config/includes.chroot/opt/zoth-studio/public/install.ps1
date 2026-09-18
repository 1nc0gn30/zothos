[CmdletBinding()]
param(
    [switch]$Unattended,
    [switch]$NoPrompt,
    [switch]$Yes,
    [Alias("y")][switch]$YFlag,
    [switch]$NonInteractive,
    [string]$InstallDir = $null,
    [string]$BinDir = $null,
    [string]$RepoUrl = "https://github.com/NullAITech/zoth-studio.git",
    [string]$Branch = "main"
)

$ErrorActionPreference = "Stop"

# Non-interactive detection from environment
$isUnattended = $Unattended.IsPresent -or $NoPrompt.IsPresent -or $Yes.IsPresent -or $YFlag.IsPresent -or $NonInteractive.IsPresent -or ($env:ZOTH_UNATTENDED -eq "1") -or ($env:CI -eq "true") -or ($env:CI -eq "1")

if (-not $InstallDir) {
    $InstallDir = if ($env:ZOTH_INSTALL_DIR) { $env:ZOTH_INSTALL_DIR } else { Join-Path $env:USERPROFILE ".zoth" }
}
if (-not $BinDir) {
    $BinDir = if ($env:ZOTH_BIN_DIR) { $env:ZOTH_BIN_DIR } else { Join-Path $env:USERPROFILE ".local\bin" }
}

Write-Host ""
Write-Host "  ███████╗ ██████╗ ████████╗██╗  ██╗    ███████╗████████╗██╗   ██╗██████╗ ██╗ ██████╗ " -ForegroundColor Yellow
Write-Host "  ╚══███╔╝██╔═══██╗╚══██╔══╝██║  ██║    ██╔════╝╚══██╔══╝██║   ██║██╔══██╗██║██╔═══██╗" -ForegroundColor Yellow
Write-Host "    ███╔╝ ██║   ██║   ██║   ███████║    ███████╗   ██║   ██║   ██║██║  ██║██║██║   ██║" -ForegroundColor Yellow
Write-Host "   ███╔╝  ██║   ██║   ██║   ██╔══██║    ╚════██║   ██║   ██║   ██║██║  ██║██║██║   ██║" -ForegroundColor Yellow
Write-Host "  ███████╗╚██████╔╝   ██║   ██║  ██║    ███████║   ██║   ╚██████╔╝██████╔╝██║╚██████╔╝" -ForegroundColor Yellow
Write-Host "  ╚══════╝ ╚═════╝    ╚═╝   ╚═╝  ╚═╝    ╚══════╝   ╚═╝    ╚═════╝ ╚═════╝ ╚═╝ ╚═════╝ " -ForegroundColor Yellow
Write-Host "  [ Sovereign Local-First AI Agent Environment · Windows Edition ]" -ForegroundColor DarkGray
Write-Host ""

if ($isUnattended) {
    Write-Host "  ⚙ Non-Interactive / Unattended Mode Active" -ForegroundColor Magenta
    $env:GIT_TERMINAL_PROMPT = "0"
}

Write-Host "Initializing Zoth Studio Architecture..." -ForegroundColor White

# Step 1: Check Git
if (-not (Get-Command "git" -ErrorAction SilentlyContinue)) {
    Write-Host "✖ Error: git is required to install Zoth Studio." -ForegroundColor Red
    Write-Host "  Install via winget: winget install --id Git.Git"
    exit 1
}
Write-Host "  ✔ Git found: $(git --version)" -ForegroundColor Green

# Step 2: Check Python
$pythonCmd = Get-Command "python" -ErrorAction SilentlyContinue
if (-not $pythonCmd) {
    $pythonCmd = Get-Command "python3" -ErrorAction SilentlyContinue
}
if (-not $pythonCmd) {
    Write-Host "✖ Error: Python 3.10+ is required to run Zoth Studio." -ForegroundColor Red
    Write-Host "  Install via winget: winget install Python.Python.3.11"
    exit 1
}
Write-Host "  ✔ Python found: $($pythonCmd.Source)" -ForegroundColor Green

# Step 3: Fetch / Update Repository
Write-Host "`nFetching Repository & Workstations into $InstallDir..." -ForegroundColor White
if (Test-Path (Join-Path $InstallDir ".git")) {
    Write-Host "  Updating existing installation in $InstallDir..." -ForegroundColor DarkGray
    Set-Location $InstallDir
    try {
        git fetch origin $Branch
        git pull --ff-only origin $Branch
    } catch {
        git pull origin $Branch
    }
} elseif (Test-Path $InstallDir) {
    Write-Host "  Directory exists without git repository. Updating..." -ForegroundColor DarkGray
    git clone --depth 1 --branch $Branch $RepoUrl "$InstallDir.tmp"
    Copy-Item -Path "$InstallDir.tmp\*" -Destination $InstallDir -Recurse -Force
    Remove-Item -Path "$InstallDir.tmp" -Recurse -Force
} else {
    Write-Host "  Cloning Zoth Studio ($Branch) into $InstallDir..." -ForegroundColor DarkGray
    git clone --depth 1 --branch $Branch $RepoUrl $InstallDir
}

# Step 4: Create Windows CLI Shim (zoth.cmd & zoth.ps1) in BinDir
$cliPy = $null
if (Test-Path (Join-Path $InstallDir "core-app\bin\zoth")) {
    $cliPy = Join-Path $InstallDir "core-app\bin\zoth"
} elseif (Test-Path (Join-Path $InstallDir "bin\zoth")) {
    $cliPy = Join-Path $InstallDir "bin\zoth"
}

if ($cliPy) {
    if (-not (Test-Path $BinDir)) {
        New-Item -ItemType Directory -Path $BinDir -Force | Out-Null
    }
    
    # CMD Shim
    $cmdShim = Join-Path $BinDir "zoth.cmd"
    "@echo off`r`npython `"$cliPy`" %*" | Out-File -FilePath $cmdShim -Encoding ascii -Force
    
    # PowerShell Shim
    $psShim = Join-Path $BinDir "zoth.ps1"
    "& python `"$cliPy`" `$args" | Out-File -FilePath $psShim -Encoding utf8 -Force
    
    Write-Host "  ✔ CLI executable shim registered at $cmdShim" -ForegroundColor Green
}

# Step 5: Success Banner & Next Steps
Write-Host "`n══════════════════════════════════════════════════════════════════" -ForegroundColor Green
Write-Host "  ✔ Zoth Studio Core Architecture Installed Successfully!" -ForegroundColor Green
Write-Host "══════════════════════════════════════════════════════════════════`n" -ForegroundColor Green

Write-Host "⚡ Quick Start (CLI & TUI):" -ForegroundColor White
Write-Host "  zoth status     View real-time status of active ports & pipelines" -ForegroundColor Cyan
Write-Host "  zoth tui        Launch interactive Terminal Cockpit (Live Telemetry)" -ForegroundColor Cyan
Write-Host "  zoth start      Start all local services (:8484 Orchestrator, :8088 Web)" -ForegroundColor Cyan
Write-Host "  zoth update     Self-update to the latest Git commits & rebuild binaries" -ForegroundColor Cyan
Write-Host "  zoth doctor     Run system health check & diagnostics" -ForegroundColor Cyan
Write-Host "  zoth list       Inspect all 298+ registered tools`n" -ForegroundColor Cyan

Write-Host "🌐 Web Dashboard & Workstations:" -ForegroundColor White
Write-Host "  • Studio Workstations:   http://127.0.0.1:8088/studio/" -ForegroundColor Cyan
Write-Host "  • Operator Deck (:8484): http://127.0.0.1:8484/" -ForegroundColor Cyan
Write-Host "  • WebGen Studio:       http://127.0.0.1:8088/studio/webgen.html" -ForegroundColor Cyan
Write-Host "  • Master Azoth:          http://127.0.0.1:8088/zoth/`n" -ForegroundColor Cyan


