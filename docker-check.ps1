# Script de vérification et maintenance Docker pour VeilleBot
# PowerShell version pour Windows

$ErrorActionPreference = "Stop"

Write-Host "=== Vérification environnement Docker ===" -ForegroundColor Cyan

# Vérifier si Docker est installé
try {
    $dockerVersion = docker --version
    Write-Host "✅ Docker installé : $dockerVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker n'est pas installé ou pas dans le PATH" -ForegroundColor Red
    exit 1
}

# Vérifier si Docker daemon est en cours d'exécution
try {
    docker info | Out-Null
    Write-Host "✅ Docker daemon actif" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker daemon n'est pas en cours d'exécution" -ForegroundColor Red
    Write-Host "💡 Démarrez Docker Desktop" -ForegroundColor Yellow
    exit 1
}

# Vérifier docker-compose
try {
    $composeVersion = docker-compose --version
    Write-Host "✅ docker-compose installé : $composeVersion" -ForegroundColor Green
} catch {
    try {
        $composeVersion = docker compose version
        Write-Host "✅ docker compose (plugin) installé : $composeVersion" -ForegroundColor Green
    } catch {
        Write-Host "❌ docker-compose n'est pas disponible" -ForegroundColor Red
        exit 1
    }
}

Write-Host ""
Write-Host "=== État des images et conteneurs VeilleBot ===" -ForegroundColor Cyan

# Vérifier les images VeilleBot
Write-Host "Images VeilleBot locales :"
$images = docker images | Select-String -Pattern "(veillebot|nanandre)"
if ($images) {
    $images
} else {
    Write-Host "Aucune image VeilleBot trouvée" -ForegroundColor Yellow
}

Write-Host ""

# Vérifier les conteneurs VeilleBot
Write-Host "Conteneurs VeilleBot :"
$containers = docker ps -a | Select-String -Pattern "(veillebot|nanandre)"
if ($containers) {
    $containers
} else {
    Write-Host "Aucun conteneur VeilleBot trouvé" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "=== Nettoyage Docker (optionnel) ===" -ForegroundColor Cyan

# Proposer le nettoyage
$cleanup = Read-Host "Voulez-vous nettoyer les images et conteneurs non utilisés ? (y/N)"
if ($cleanup -eq "y" -or $cleanup -eq "Y") {
    Write-Host "Nettoyage des conteneurs arrêtés..." -ForegroundColor Yellow
    docker container prune -f
    
    Write-Host "Nettoyage des images non utilisées..." -ForegroundColor Yellow
    docker image prune -f
    
    Write-Host "Nettoyage des réseaux non utilisés..." -ForegroundColor Yellow
    docker network prune -f
    
    Write-Host "Nettoyage des volumes non utilisés..." -ForegroundColor Yellow
    docker volume prune -f
    
    Write-Host "✅ Nettoyage terminé" -ForegroundColor Green
} else {
    Write-Host "Nettoyage ignoré" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "=== Informations système ===" -ForegroundColor Cyan
Write-Host "Espace disque Docker :"
docker system df

Write-Host ""
Write-Host "=== Commandes utiles ===" -ForegroundColor Cyan
Write-Host "Build l'image :         bash build-docker.sh" -ForegroundColor White
Write-Host "Publier sur Docker Hub: bash publish-docker.sh" -ForegroundColor White
Write-Host "Démarrer en local :     docker-compose up -d" -ForegroundColor White
Write-Host "Démarrer en prod :      docker-compose -f docker-compose.prod.yml up -d" -ForegroundColor White
Write-Host "Voir les logs :         docker-compose logs -f" -ForegroundColor White
Write-Host "Arrêter :               docker-compose down" -ForegroundColor White

Write-Host ""
Write-Host "✅ Vérification Docker terminée" -ForegroundColor Green