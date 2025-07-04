# publish-docker.ps1 - Script pour publier sur Docker Hub

param(
    [string]$Version = "latest",
    [string]$Username = "nanandre"
)

$ImageName = "veillebot"
$FullImageName = "$Username/$ImageName"
$ImageTag = "${FullImageName}:${Version}"
$LatestTag = "${FullImageName}:latest"

Write-Host "Building and publishing VeilleBot to Docker Hub..." -ForegroundColor Cyan
Write-Host "Image: $ImageTag" -ForegroundColor Yellow

# Vérifier si Docker est disponible
try {
    docker version | Out-Null
    if ($LASTEXITCODE -ne 0) {
        throw "Docker not available"
    }
} catch {
    Write-Host "Docker Desktop n'est pas démarré ou installé" -ForegroundColor Red
    Write-Host "Veuillez démarrer Docker Desktop et réessayer" -ForegroundColor Yellow
    exit 1
}

# 1. Builder l'image avec le bon tag
Write-Host "Building image..." -ForegroundColor Cyan
docker build -t $ImageTag .

if ($LASTEXITCODE -ne 0) {
    Write-Host "Failed to build image" -ForegroundColor Red
    exit 1
}

# 2. Ajouter le tag 'latest' si c'est une version spécifique
if ($Version -ne "latest") {
    Write-Host "Tagging as latest..." -ForegroundColor Cyan
    docker tag $ImageTag $LatestTag
}

# 3. Pousser l'image vers Docker Hub
Write-Host "Pushing to Docker Hub..." -ForegroundColor Cyan
docker push $ImageTag

if ($LASTEXITCODE -ne 0) {
    Write-Host "Failed to push image" -ForegroundColor Red
    exit 1
}

# 4. Pousser le tag 'latest' si applicable
if ($Version -ne "latest") {
    Write-Host "Pushing latest tag..." -ForegroundColor Cyan
    docker push $LatestTag
}

Write-Host "Successfully published to Docker Hub!" -ForegroundColor Green
Write-Host "Image available at: https://hub.docker.com/r/$Username/$ImageName" -ForegroundColor Yellow
Write-Host "Pull command: docker pull $ImageTag" -ForegroundColor Yellow

# 5. Afficher les informations d'utilisation
Write-Host ""
Write-Host "Usage examples:" -ForegroundColor Cyan
Write-Host "   docker run -d --name veillebot --env-file .env -p 8080:8080 $ImageTag" -ForegroundColor White
Write-Host "   docker-compose up -d (using docker-compose.yml)" -ForegroundColor White
