# ============================================================================
# NEUROSPECTRA - Full Database Sync Tool (JSON / LocalStore -> PostgreSQL)
# ============================================================================

$schemaFile = Join-Path $PSScriptRoot "schema.sql"
$dbFile = Join-Path $PSScriptRoot "db.json"
$envFile = Join-Path $PSScriptRoot "backend\.env"

if (Test-Path $envFile) {
    Get-Content $envFile | ForEach-Object {
        $l = $_.Trim()
        if ($l -and -not $l.StartsWith("#") -and $l.Contains("=")) {
            $parts = $l.Split("=", 2)
            [System.Environment]::SetEnvironmentVariable($parts[0].Trim(), $parts[1].Trim(), "Process")
        }
    }
}

$psql = "C:\Program Files\PostgreSQL\17\bin\psql.exe"
if (-not (Test-Path $psql)) {
    $found = Get-Command psql -ErrorAction SilentlyContinue
    if ($found) { $psql = $found.Source }
}

if (-not $psql -or -not (Test-Path $psql)) {
    Write-Host "psql executable not found." -ForegroundColor Red
    exit 1
}

Write-Host "Connecting to PostgreSQL (localhost:5432)..." -ForegroundColor Cyan

$dbData = Get-Content $dbFile -Raw | ConvertFrom-Json
$users = $dbData.users

$tempSql = Join-Path $PSScriptRoot "sync_temp.sql"
$sqlContent = "BEGIN;`n"

foreach ($u in $users) {
    $fn = ($u.full_name -replace "'", "''")
    $em = ($u.email -replace "'", "''")
    $ph = ($u.phone -replace "'", "''")
    $ro = ($u.role -replace "'", "''")
    $sqlContent += "INSERT INTO users (id, full_name, email, password_hash, role, phone, is_active) VALUES ('$($u.id)', '$fn', '$em', 'parent123', '$ro', '$ph', 1) ON CONFLICT (id) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email, phone = EXCLUDED.phone;`n"
}

$sqlContent += "COMMIT;`n"
$sqlContent | Set-Content $tempSql -Encoding UTF8

Write-Host "Syncing $($users.Count) users into PostgreSQL..." -ForegroundColor Yellow
$env:PGPASSWORD = if ($env:DB_PASSWORD) { $env:DB_PASSWORD } else { "postgres" }

& $psql -U postgres -d postgres -f $tempSql

if ($LASTEXITCODE -ne 0) {
    Write-Host "`nAuthentication failed with saved password. Please enter your actual PostgreSQL password below:" -ForegroundColor Yellow
    & $psql -U postgres -d postgres -W -f $tempSql
}

Remove-Item $tempSql -ErrorAction SilentlyContinue

if ($LASTEXITCODE -eq 0) {
    Write-Host "`nSync completed successfully! Run 'SELECT * FROM users;' in your database tool to verify." -ForegroundColor Green
} else {
    Write-Host "`nSync failed. Please check the password you typed." -ForegroundColor Red
}
