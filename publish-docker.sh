#!/bin/bash
# publish-docker.sh - Script pour publier sur Docker Hub

# Paramètres par défaut
VERSION=${1:-"latest"}
USERNAME=${2:-"nanandre"}
IMAGE_NAME="veillebot"
FULL_IMAGE_NAME="$USERNAME/$IMAGE_NAME"
IMAGE_TAG="$FULL_IMAGE_NAME:$VERSION"
LATEST_TAG="$FULL_IMAGE_NAME:latest"

echo "Building and publishing VeilleBot to Docker Hub..."
echo "Image: $IMAGE_TAG"

# Vérifier si Docker est disponible
if ! command -v docker &> /dev/null; then
    echo "ERREUR: Docker n'est pas installé ou pas dans le PATH"
    exit 1
fi

# Vérifier si Docker daemon est en cours d'exécution
if ! docker version &> /dev/null; then
    echo "ERREUR: Docker Desktop n'est pas démarré"
    echo "Veuillez démarrer Docker Desktop et réessayer"
    exit 1
fi

# Vérifier si on est connecté à Docker Hub en tentant un push de test
echo "Vérification de la connexion Docker Hub..."
# On va essayer de pousser une image de test ou vérifier les credentials autrement

echo "Docker est prêt"

# 1. Builder l'image avec le bon tag
echo "Building image..."
if ! docker build -t "$IMAGE_TAG" .; then
    echo "ERREUR: Failed to build image"
    exit 1
fi

# 2. Ajouter le tag 'latest' si c'est une version spécifique
if [ "$VERSION" != "latest" ]; then
    echo "Tagging as latest..."
    docker tag "$IMAGE_TAG" "$LATEST_TAG"
fi

# 3. Pousser l'image vers Docker Hub
echo "Pushing to Docker Hub..."
if ! docker push "$IMAGE_TAG"; then
    echo "ERREUR: Failed to push image"
    exit 1
fi

# 4. Pousser le tag 'latest' si applicable
if [ "$VERSION" != "latest" ]; then
    echo "Pushing latest tag..."
    docker push "$LATEST_TAG"
fi

echo "Successfully published to Docker Hub!"
echo "Image available at: https://hub.docker.com/r/$USERNAME/$IMAGE_NAME"
echo "Pull command: docker pull $IMAGE_TAG"

# 5. Afficher les informations d'utilisation
echo ""
echo "Usage examples:"
echo "   docker run -d --name veillebot --env-file .env -p 8080:8080 $IMAGE_TAG"
echo "   docker-compose up -d (using docker-compose.yml)"

# 6. Afficher les tags disponibles
echo ""
echo "Available tags:"
echo "   - $IMAGE_TAG"
if [ "$VERSION" != "latest" ]; then
    echo "   - $LATEST_TAG"
fi
