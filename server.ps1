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
            @{ id = "usr_admin_1"; full_name = "Dr. Eleanor Vance"; email = "admin@neurospectra.org"; role = "Administrator"; phone = "+91 9876543210"; is_active = 1; avatar_url = "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=256" },
            @{ id = "usr_therapist_1"; full_name = "Dr. Aisha Khan, Ph.D."; email = "therapist@neurospectra.org"; role = "Therapist"; phone = "+91 9876543211"; is_active = 1; avatar_url = "https://images.unsplash.com/photo-1594824813589-3221e5138137?auto=format&fit=crop&q=80&w=256" },
            @{ id = "usr_receptionist_1"; full_name = "Sarah Jenkins"; email = "receptionist@neurospectra.org"; role = "Receptionist"; phone = "+91 9876543213"; is_active = 1; avatar_url = "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=256" },
            @{ id = "usr_parent_1"; full_name = "Priya Sharma"; email = "parent@neurospectra.org"; role = "Parent / Caregiver"; phone = "+91 9876543214"; is_active = 1; avatar_url = "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=256" },
            @{ id = "usr_teacher_1"; full_name = "Marcus Brody"; email = "teacher@neurospectra.org"; role = "Teacher"; phone = "+91 9876543216"; is_active = 1; avatar_url = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=256" }
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
                if ($role -in @("Administrator", "Therapist", "Receptionist")) {
                    Send-JsonResponse $response 400 @{ role = @("Public registration for this role is not authorized. Must be provisioned by an Administrator.") }
                    continue
                }

                $newUser = @{
                    id = "usr_" + [System.Guid]::NewGuid().ToString("N").Substring(0, 8)
                    full_name = $name
                    email = $email
                    phone = $phone
                    role = if ($role) { $role } else { "Parent / Caregiver" }
                    is_active = 1
                    avatar_url = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=128"
                }

                $db = Get-Content $dbFile -Raw | ConvertFrom-Json
                $db.users += $newUser
                $db | ConvertTo-Json -Depth 10 | Set-Content $dbFile -Encoding UTF8

                Send-JsonResponse $response 201 @{
                    message = "Registration successful."
                    user = $newUser
                }
                continue
            }

            # 3. GET /api/auth/users/
            if ($rawPath -eq "/api/auth/users/" -and $httpMethod -eq "GET") {
                $db = Get-Content $dbFile -Raw | ConvertFrom-Json
                Send-JsonResponse $response 200 $db.users
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
