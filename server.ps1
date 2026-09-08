# ============================================================================
# NEUROSPECTRA - Full-Stack REST API & Web Server
# Serves Static Files + Full JSON REST API Endpoints on http://localhost:3000
# ============================================================================

$port = 3000
$path = "c:\Users\hp\Desktop\Neurospectra"
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")
$listener.Start()

Write-Output "========================================================"
Write-Output "NEUROSPECTRA REST API Server running at http://localhost:$port/"
Write-Output "REST API Endpoints: /api/auth/*, /api/children/*, /api/assessments/*"
Write-Output "========================================================"

# In-Memory Database seed for REST endpoints
$dbFile = Join-Path $path "db.json"
if (-not (Test-Path $dbFile)) {
    $initialDb = @{
        users = @(
            @{ id = "usr_admin_1"; full_name = "Dr. Eleanor Vance"; email = "admin@neurospectra.org"; role = "Administrator"; phone = "+91 98201 45672"; is_active = 1; avatar_url = "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=256" },
            @{ id = "usr_therapist_1"; full_name = "Dr. Aisha Khan, Ph.D."; email = "therapist@neurospectra.org"; role = "Therapist"; phone = "+91 98451 89234"; is_active = 1; avatar_url = "https://images.unsplash.com/photo-1594824813589-3221e5138137?auto=format&fit=crop&q=80&w=256" },
            @{ id = "usr_receptionist_1"; full_name = "Sarah Jenkins"; email = "receptionist@neurospectra.org"; role = "Receptionist"; phone = "+91 98230 41589"; is_active = 1; avatar_url = "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=256" },
            @{ id = "usr_parent_1"; full_name = "Priya Sharma"; email = "parent@neurospectra.org"; role = "Parent / Caregiver"; phone = "+91 94471 63820"; is_active = 1; avatar_url = "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=256" },
            @{ id = "usr_teacher_1"; full_name = "Marcus Brody"; email = "teacher@neurospectra.org"; role = "Teacher"; phone = "+91 98300 94165"; is_active = 1; avatar_url = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=256" }
        )
        children = @(
            @{ id = "ch_101"; child_code = "NS-2026-0101"; first_name = "Aarav"; last_name = "Sharma"; dob = "2023-04-15"; age_months = 40; gender = "Male"; status = "Active"; primary_parent_id = "usr_parent_1"; assigned_therapist_id = "usr_therapist_1" },
            @{ id = "ch_102"; child_code = "NS-2026-0102"; first_name = "Liam"; last_name = "Miller"; dob = "2022-09-10"; age_months = 47; gender = "Male"; status = "Active"; primary_parent_id = "usr_parent_1"; assigned_therapist_id = "usr_therapist_1" }
        )
        assessments = @(
            @{ id = "rec_asmt_1"; child_id = "ch_101"; therapist_id = "usr_therapist_1"; status = "Completed"; total_score = 1; risk_level = "Low Risk Indicator" }
        )
    }
    $initialDb | ConvertTo-Json -Depth 10 | Set-Content $dbFile -Encoding UTF8
}

# Load environment variables from backend/.env if present
$envFilePath = Join-Path $path "backend\.env"
if (Test-Path $envFilePath) {
    Get-Content $envFilePath | ForEach-Object {
        $l = $_.Trim()
        if ($l -and -not $l.StartsWith("#") -and $l.Contains("=")) {
            $parts = $l.Split("=", 2)
            $varName = $parts[0].Trim()
            $varVal = $parts[1].Trim()
            [System.Environment]::SetEnvironmentVariable($varName, $varVal, "Process")
        }
    }
}

# Auto-configure pgpass.conf for automated background authentication
if ($env:DB_PASSWORD) {
    try {
        $pgpassDir = Join-Path $env:APPDATA "postgresql"
        if (-not (Test-Path $pgpassDir)) {
            New-Item -ItemType Directory -Path $pgpassDir -Force | Out-Null
        }
        $pgpassFile = Join-Path $pgpassDir "pgpass.conf"
        "127.0.0.1:5432:*:postgres:$($env:DB_PASSWORD)`nlocalhost:5432:*:postgres:$($env:DB_PASSWORD)`n*:5432:*:postgres:$($env:DB_PASSWORD)" | Set-Content $pgpassFile -Encoding UTF8
    } catch {}
}

function Invoke-PgSql($query) {
    $psql = "C:\Program Files\PostgreSQL\17\bin\psql.exe"
    if (-not (Test-Path $psql)) {
        $found = Get-Command psql -ErrorAction SilentlyContinue
        if ($found) { $psql = $found.Source }
    }
    if (Test-Path $psql) {
        $tempSql = [System.IO.Path]::GetTempFileName() + ".sql"
        $query | Set-Content $tempSql -Encoding UTF8
        try {
            $dbPwd = if ($env:DB_PASSWORD) { $env:DB_PASSWORD } else { "postgres" }
            $dbName = if ($env:DB_NAME) { $env:DB_NAME } else { "postgres" }
            $dbUser = if ($env:DB_USER) { $env:DB_USER } else { "postgres" }
            $env:PGPASSWORD = $dbPwd
            & $psql -U $dbUser -d $dbName -f $tempSql 2>&1 | Out-Null
        } catch {}
        Remove-Item $tempSql -ErrorAction SilentlyContinue
    }
}

function Send-JsonResponse($response, $statusCode, $data) {
    $response.StatusCode = $statusCode
    $response.ContentType = "application/json; charset=utf-8"
    $response.AddHeader("Access-Control-Allow-Origin", "*")
    $response.AddHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS")
    $response.AddHeader("Access-Control-Allow-Headers", "Content-Type, Authorization")
    
    $json = $data | ConvertTo-Json -Depth 10
    $buffer = [System.Text.Encoding]::UTF8.GetBytes($json)
    $response.ContentLength64 = $buffer.Length
    $response.OutputStream.Write($buffer, 0, $buffer.Length)
    $response.Close()
}

while ($listener.IsListening) {
    try {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response
        $httpMethod = $request.HttpMethod
        $rawPath = $request.Url.LocalPath

        # Handle CORS Preflight
        if ($httpMethod -eq "OPTIONS") {
            $response.StatusCode = 200
            $response.AddHeader("Access-Control-Allow-Origin", "*")
            $response.AddHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS")
            $response.AddHeader("Access-Control-Allow-Headers", "Content-Type, Authorization")
            $response.Close()
            continue
        }

        # ====================================================================
        # REST API ROUTER (/api/*)
        # ====================================================================
        if ($rawPath.StartsWith("/api/")) {
            $body = ""
            if ($request.HasEntityBody) {
                $reader = New-Object System.IO.StreamReader($request.InputStream, [System.Text.Encoding]::UTF8)
                $body = $reader.ReadToEnd()
                $reader.Close()
            }
            $payload = $null
            if (-not [string]::IsNullOrEmpty($body)) {
                try { $payload = $body | ConvertFrom-Json } catch {}
            }

            # 1. POST /api/auth/login/
            if ($rawPath -eq "/api/auth/login/" -and $httpMethod -eq "POST") {
                $email = ($payload.email -as [string]).Trim().ToLower()
                $pwd = $payload.password
                
                if ([string]::IsNullOrEmpty($email) -or [string]::IsNullOrEmpty($pwd)) {
                    Send-JsonResponse $response 400 @{ error = "Email and password are required." }
                    continue
                }
                
                $db = Get-Content $dbFile -Raw | ConvertFrom-Json
                $matchedUser = $db.users | Where-Object { $_.email -eq $email } | Select-Object -First 1

                if ($matchedUser) {
                    Send-JsonResponse $response 200 @{
                        access = "jwt_access_token_" + [System.Guid]::NewGuid().ToString("N")
                        refresh = "jwt_refresh_token_" + [System.Guid]::NewGuid().ToString("N")
                        user = $matchedUser
                    }
                } else {
                    # Generic error to prevent enumeration
                    Send-JsonResponse $response 400 @{ non_field_errors = @("Invalid email or password.") }
                }
                continue
            }

            # 2. POST /api/auth/register/
            if ($rawPath -eq "/api/auth/register/" -and $httpMethod -eq "POST") {
                $name = ($payload.full_name -as [string]).Trim()
                $email = ($payload.email -as [string]).Trim().ToLower()
                $phone = ($payload.phone -as [string]).Trim()
                $role = $payload.role

                if ([string]::IsNullOrEmpty($name) -or $name.Length -lt 3) {
                    Send-JsonResponse $response 400 @{ full_name = @("Full name must contain at least 3 characters.") }
                    continue
                }

                $userId = if ($payload.id) { $payload.id } else { "usr_" + [System.Guid]::NewGuid().ToString("N").Substring(0, 8) }
                $pwd = if ($payload.password) { $payload.password } else { "parent123" }

                $newUser = @{
                    id = $userId
                    full_name = $name
                    email = $email
                    phone = $phone
                    role = if ($role) { $role } else { "Parent / Caregiver" }
                    is_active = 1
                    avatar_url = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=128"
                }

                $db = Get-Content $dbFile -Raw | ConvertFrom-Json
                $existing = $db.users | Where-Object { $_.email -eq $email -or $_.id -eq $userId } | Select-Object -First 1
                if (-not $existing) {
                    $db.users += $newUser
                    $db | ConvertTo-Json -Depth 10 | Set-Content $dbFile -Encoding UTF8
                }

                # Direct PostgreSQL Insertion
                $cleanFullName = $name.Replace("'", "''")
                $cleanEmail = $email.Replace("'", "''")
                $cleanRole = $newUser.role.Replace("'", "''")
                $cleanPhone = $phone.Replace("'", "''")
                $cleanPwd = $pwd.Replace("'", "''")
                
                $sql = "INSERT INTO users (id, full_name, email, password_hash, role, phone, is_active) VALUES ('$userId', '$cleanFullName', '$cleanEmail', '$cleanPwd', '$cleanRole', '$cleanPhone', 1) ON CONFLICT (id) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email, phone = EXCLUDED.phone;"
                Invoke-PgSql $sql

                Send-JsonResponse $response 201 @{
                    message = "Registration successful and synced to PostgreSQL."
                    user = $newUser
                }
                continue
            }

            # 2.1 POST /api/bulk-sync/
            if ($rawPath -eq "/api/bulk-sync/" -and $httpMethod -eq "POST") {
                if ($payload.users) {
                    $db = Get-Content $dbFile -Raw | ConvertFrom-Json
                    foreach ($u in $payload.users) {
                        $uid = $u.id
                        $matched = $db.users | Where-Object { $_.id -eq $uid -or $_.email -eq $u.email } | Select-Object -First 1
                        if (-not $matched) {
                            $db.users += $u
                        }
                        $cleanFullName = ($u.full_name -as [string]).Replace("'", "''")
                        $cleanEmail = ($u.email -as [string]).Replace("'", "''")
                        $cleanRole = ($u.role -as [string]).Replace("'", "''")
                        $cleanPhone = ($u.phone -as [string]).Replace("'", "''")
                        $cleanPwd = "parent123"
                        $sql = "INSERT INTO users (id, full_name, email, password_hash, role, phone, is_active) VALUES ('$uid', '$cleanFullName', '$cleanEmail', '$cleanPwd', '$cleanRole', '$cleanPhone', 1) ON CONFLICT (id) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email, phone = EXCLUDED.phone;"
                        Invoke-PgSql $sql
                    }
                    $db | ConvertTo-Json -Depth 10 | Set-Content $dbFile -Encoding UTF8
                }
                Send-JsonResponse $response 200 @{ message = "Bulk sync complete." }
                continue
            }

            # 3. GET /api/auth/users/
            if ($rawPath -eq "/api/auth/users/" -and $httpMethod -eq "GET") {
                $psql = "C:\Program Files\PostgreSQL\17\bin\psql.exe"
                if (-not (Test-Path $psql)) {
                    $found = Get-Command psql -ErrorAction SilentlyContinue
                    if ($found) { $psql = $found.Source }
                }
                if (Test-Path $psql) {
                    $sqlJson = "COPY (SELECT json_agg(row_to_json(u)) FROM (SELECT id, full_name, email, role, phone, is_active, avatar_url, created_at, updated_at FROM users ORDER BY created_at ASC) u) TO STDOUT;"
                    try {
                        $dbPwd = if ($env:DB_PASSWORD) { $env:DB_PASSWORD } else { "Subin@2003" }
                        $dbName = if ($env:DB_NAME) { $env:DB_NAME } else { "postgres" }
                        $dbUser = if ($env:DB_USER) { $env:DB_USER } else { "postgres" }
                        $env:PGPASSWORD = $dbPwd
                        $jsonStr = (& $psql -U $dbUser -d $dbName -t -c $sqlJson)
                        if ($jsonStr -and $jsonStr.Trim()) {
                            $pgUsers = $jsonStr.Trim() | ConvertFrom-Json
                            Send-JsonResponse $response 200 $pgUsers
                            continue
                        }
                    } catch {}
                }
                $db = Get-Content $dbFile -Raw | ConvertFrom-Json
                Send-JsonResponse $response 200 $db.users
                continue
            }

            # 3.1 POST /api/auth/users/update/ & PUT /api/auth/profile/
            if (($rawPath -eq "/api/auth/users/update/" -or $rawPath -eq "/api/auth/profile/" -or $rawPath -eq "/auth/profile/") -and ($httpMethod -eq "POST" -or $httpMethod -eq "PUT" -or $httpMethod -eq "PATCH")) {
                if ($payload) {
                    $uid = if ($payload.id) { $payload.id } else { "" }
                    $cleanFullName = if ($payload.full_name) { ($payload.full_name -as [string]).Replace("'", "''") } else { "" }
                    $cleanEmail = if ($payload.email) { ($payload.email -as [string]).Replace("'", "''") } else { "" }
                    $cleanRole = if ($payload.role) { ($payload.role -as [string]).Replace("'", "''") } else { "" }
                    $cleanPhone = if ($payload.phone) { ($payload.phone -as [string]).Replace("'", "''") } else { "" }
                    $act = if ($payload.is_active -ne $null) { [int]$payload.is_active } else { 1 }

                    $pwdVal = if ($payload.raw_pwd_hash) { $payload.raw_pwd_hash } elseif ($payload.password) { $payload.password } elseif ($payload.password_hash) { $payload.password_hash } else { $null }

                    # 1. Update in db.json
                    try {
                        $db = Get-Content $dbFile -Raw | ConvertFrom-Json
                        $idx = -1
                        for ($i = 0; $i -lt $db.users.Count; $i++) {
                            if (($uid -and $db.users[$i].id -eq $uid) -or ($cleanEmail -and $db.users[$i].email -eq $cleanEmail)) {
                                $idx = $i
                                if (-not $uid) { $uid = $db.users[$i].id }
                                break
                            }
                        }
                        if ($idx -ne -1) {
                            if ($payload.full_name) { $db.users[$idx].full_name = $payload.full_name }
                            if ($payload.email) { $db.users[$idx].email = $payload.email }
                            if ($payload.phone) { $db.users[$idx].phone = $payload.phone }
                            if ($payload.role) { $db.users[$idx].role = $payload.role }
                            if ($pwdVal) { $db.users[$idx].password = $pwdVal }
                        }
                        $db | ConvertTo-Json -Depth 10 | Set-Content $dbFile -Encoding UTF8
                    } catch {}

                    # 2. Update in PostgreSQL
                    $pwdSql = ""
                    if ($pwdVal) {
                        $cleanPwd = ($pwdVal -as [string]).Replace("'", "''")
                        $pwdSql = ", password_hash = '$cleanPwd'"
                    }
                    if ($uid) {
                        $sql = "UPDATE users SET full_name = '$cleanFullName', email = '$cleanEmail', role = '$cleanRole', phone = '$cleanPhone', is_active = $act $pwdSql, updated_at = CURRENT_TIMESTAMP WHERE id = '$uid';"
                        Invoke-PgSql $sql
                    }
                }
                Send-JsonResponse $response 200 @{ message = "User updated in database." }
                continue
            }

            # 3.2 POST /api/auth/users/delete/
            if ($rawPath -eq "/api/auth/users/delete/" -and $httpMethod -eq "POST") {
                if ($payload.id) {
                    $uid = ($payload.id -as [string]).Replace("'", "''")
                    $db = Get-Content $dbFile -Raw | ConvertFrom-Json
                    $db.users = @($db.users | Where-Object { $_.id -ne $payload.id })
                    $db | ConvertTo-Json -Depth 10 | Set-Content $dbFile -Encoding UTF8

                    # Execute PostgreSQL DELETE
                    $sql = "DELETE FROM users WHERE id = '$uid';"
                    Invoke-PgSql $sql
                }
                Send-JsonResponse $response 200 @{ message = "User deleted from PostgreSQL." }
                continue
            }

            # 4. GET /api/children/
            if ($rawPath -eq "/api/children/" -and $httpMethod -eq "GET") {
                $db = Get-Content $dbFile -Raw | ConvertFrom-Json
                Send-JsonResponse $response 200 $db.children
                continue
            }

            # Fallback for other REST endpoints
            Send-JsonResponse $response 200 @{ status = "ok"; endpoint = $rawPath; method = $httpMethod }
            continue
        }

        # ====================================================================
        # STATIC ASSETS FILE SERVER
        # ====================================================================
        $cleanPath = [System.Uri]::UnescapeDataString($rawPath).TrimStart('/').Replace('/', '\')
        if ([string]::IsNullOrEmpty($cleanPath) -or $cleanPath -eq '\') {
            $cleanPath = 'index.html'
        }
        
        $filePath = Join-Path $path $cleanPath
        
        if (Test-Path $filePath -PathType Leaf) {
            $bytes = [System.IO.File]::ReadAllBytes($filePath)
            $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
            
            $contentType = "application/octet-stream"
            switch ($ext) {
                ".html" { $contentType = "text/html; charset=utf-8" }
                ".css"  { $contentType = "text/css; charset=utf-8" }
                ".js"   { $contentType = "application/javascript; charset=utf-8" }
                ".jsx"  { $contentType = "application/javascript; charset=utf-8" }
                ".json" { $contentType = "application/json; charset=utf-8" }
                ".sql"  { $contentType = "text/plain; charset=utf-8" }
                ".png"  { $contentType = "image/png" }
                ".jpg"  { $contentType = "image/jpeg" }
                ".jpeg" { $contentType = "image/jpeg" }
                ".webp" { $contentType = "image/webp" }
                ".svg"  { $contentType = "image/svg+xml" }
                ".ico"  { $contentType = "image/x-icon" }
            }
            
            $response.ContentType = $contentType
            $response.AddHeader("Access-Control-Allow-Origin", "*")
            $response.AddHeader("Cache-Control", "no-cache, no-store, must-revalidate")
            $response.AddHeader("Pragma", "no-cache")
            $response.AddHeader("Expires", "0")
            $response.ContentLength64 = $bytes.Length
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
        } else {
            $response.StatusCode = 404
            $response.AddHeader("Access-Control-Allow-Origin", "*")
            $buffer = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found: $rawPath")
            $response.OutputStream.Write($buffer, 0, $buffer.Length)
        }
        $response.Close()
    } catch {
        # continue listening
    }
}
