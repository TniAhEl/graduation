$ErrorActionPreference = "Stop"

$url = Read-Host "PostgreSQL JDBC URL"
$username = Read-Host "PostgreSQL username"
$secureDatabasePassword = Read-Host "PostgreSQL password" -AsSecureString
$adminUsername = Read-Host "Admin username"
$secureAdminPassword = Read-Host "Admin password" -AsSecureString

if ([string]::IsNullOrWhiteSpace($url) -or
    [string]::IsNullOrWhiteSpace($username) -or
    [string]::IsNullOrWhiteSpace($adminUsername)) {
    throw "Database URL, database username, and admin username are required."
}

$variables = @{
    SPRING_PROFILES_ACTIVE = "prod"
    SPRING_DATASOURCE_URL = $url
    SPRING_DATASOURCE_USERNAME = $username
    SPRING_DATASOURCE_PASSWORD = [System.Net.NetworkCredential]::new("", $secureDatabasePassword).Password
    ADMIN_USERNAME = $adminUsername
    ADMIN_PASSWORD = [System.Net.NetworkCredential]::new("", $secureAdminPassword).Password
}

$previousValues = @{}
foreach ($name in $variables.Keys) {
    $previousValues[$name] = [Environment]::GetEnvironmentVariable($name, "Process")
    [Environment]::SetEnvironmentVariable($name, $variables[$name], "Process")
}

Push-Location $PSScriptRoot
try {
    & mvn spring-boot:run
    if ($LASTEXITCODE -ne 0) {
        throw "Backend exited with code $LASTEXITCODE."
    }
}
finally {
    Pop-Location
    foreach ($name in $variables.Keys) {
        [Environment]::SetEnvironmentVariable($name, $previousValues[$name], "Process")
    }
    $variables.Clear()
    $secureDatabasePassword.Dispose()
    $secureAdminPassword.Dispose()
}
