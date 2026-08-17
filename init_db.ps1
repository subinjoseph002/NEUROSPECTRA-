# ============================================================================
# NEUROSPECTRA - PostgreSQL Database Initializer Script
# Automatically detects local PostgreSQL installations and executes schema.sql
# ============================================================================

$schemaFile = Join-Path $PSScriptRoot "schema.sql"

if (-not (Test-Path $schemaFile)) {
    Write-Host "Error: schema.sql not found at $schemaFile" -ForegroundColor Red
    exit 1
}

Write-Host "Searching for PostgreSQL installation on this system..." -ForegroundColor Cyan

# Check common PostgreSQL installation paths on Windows
$possiblePaths = @(
    "C:\Program Files\PostgreSQL\17\bin\psql.exe",
    "C:\Program Files\PostgreSQL\16\bin\psql.exe",
    "C:\Program Files\PostgreSQL\15\bin\psql.exe",
    "C:\Program Files\PostgreSQL\14\bin\psql.exe",
    "C:\Program Files (x86)\PostgreSQL\16\bin\psql.exe"
)

$psqlExe = $null

# Check PATH first
$pathCheck = (Get-Command psql -ErrorAction SilentlyContinue)
if ($pathCheck) {
    $psqlExe = $pathCheck.Source
} else {
    foreach ($p in $possiblePaths) {
        if (Test-Path $p) {
            $psqlExe = $p
            break
        }
    }
}

if ($psqlExe) {
    Write-Host "Found psql executable at: $psqlExe" -ForegroundColor Green
    Write-Host "Executing schema.sql against PostgreSQL server (localhost:5432)..." -ForegroundColor Yellow
    
    # Run psql with schema.sql
    & $psqlExe -U postgres -d postgres -f $schemaFile
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "`nSuccessfully initialized PostgreSQL schema with all tables, constraints, and seed data!" -ForegroundColor Green
    } else {
        Write-Host "`npsql execution finished with code: $LASTEXITCODE" -ForegroundColor Yellow
    }
} else {
    Write-Host "`nPostgreSQL psql.exe was not found in default paths." -ForegroundColor Red
    Write-Host "If the installer is currently running, please accept any Windows UAC prompt on your screen, then re-run: .\init_db.ps1" -ForegroundColor Yellow
}
