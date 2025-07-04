#!/bin/bash

# Script de vérification et maintenance Docker pour VeilleBot
# Compatible Linux/macOS/Windows (via Git Bash)

set -e

echo "=== Vérification environnement Docker ==="

# Vérifier si Docker est installé et en cours d'exécution
if ! command -v docker &> /dev/null; then
    echo "❌ Docker n'est pas installé ou pas dans le PATH"
    exit 1
fi

echo "✅ Docker installé : $(docker --version)"

# Vérifier si Docker daemon est en cours d'exécution
if ! docker info &> /dev/null; then
    echo "❌ Docker daemon n'est pas en cours d'exécution"
    echo "💡 Démarrez Docker Desktop ou le service Docker"
    exit 1
fi

echo "✅ Docker daemon actif"

# Vérifier si docker-compose est disponible
if command -v docker-compose &> /dev/null; then
    echo "✅ docker-compose installé : $(docker-compose --version)"
elif docker compose version &> /dev/null; then
    echo "✅ docker compose (plugin) installé : $(docker compose version)"
else
    echo "❌ docker-compose n'est pas disponible"
    exit 1
fi

echo ""
echo "=== État des images et conteneurs VeilleBot ==="

# Vérifier les images VeilleBot
echo "Images VeilleBot locales :"
docker images | grep -E "(veillebot|nanandre)" || echo "Aucune image VeilleBot trouvée"

echo ""

# Vérifier les conteneurs VeilleBot
echo "Conteneurs VeilleBot :"
docker ps -a | grep -E "(veillebot|nanandre)" || echo "Aucun conteneur VeilleBot trouvé"

echo ""
echo "=== Nettoyage Docker (optionnel) ==="

# Proposer le nettoyage
read -p "Voulez-vous nettoyer les images et conteneurs non utilisés ? (y/N) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "Nettoyage des conteneurs arrêtés..."
    docker container prune -f
    
    echo "Nettoyage des images non utilisées..."
    docker image prune -f
    
    echo "Nettoyage des réseaux non utilisés..."
    docker network prune -f
    
    echo "Nettoyage des volumes non utilisés..."
    docker volume prune -f
    
    echo "✅ Nettoyage terminé"
else
    echo "Nettoyage ignoré"
fi

echo ""
echo "=== Informations système ==="
echo "Espace disque Docker :"
docker system df

echo ""
echo "=== Commandes utiles ==="
echo "Build l'image :         bash build-docker.sh"
echo "Publier sur Docker Hub: bash publish-docker.sh"
echo "Démarrer en local :     docker-compose up -d"
echo "Démarrer en prod :      docker-compose -f docker-compose.prod.yml up -d"
echo "Voir les logs :         docker-compose logs -f"
echo "Arrêter :               docker-compose down"

echo ""
echo "✅ Vérification Docker terminée"
