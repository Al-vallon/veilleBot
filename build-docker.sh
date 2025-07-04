#!/bin/bash
# build-docker.sh - Script pour builder l'image Docker localement

USERNAME=${1:-"nanandre"}
VERSION=${2:-"latest"}
IMAGE_NAME="veillebot"
FULL_IMAGE_NAME="$USERNAME/$IMAGE_NAME"
IMAGE_TAG="$FULL_IMAGE_NAME:$VERSION"

echo "Building VeilleBot Docker image..."
echo "Image: $IMAGE_TAG"

# Vérifier si Docker est disponible
if ! command -v docker &> /dev/null; then
    echo "ERREUR: Docker n'est pas installé ou pas dans le PATH"
    exit 1
fi

if ! docker version &> /dev/null; then
    echo "ERREUR: Docker Desktop n'est pas démarré"
    echo "Veuillez démarrer Docker Desktop et réessayer"
    exit 1
fi

echo "Docker est prêt"

# Builder l'image
echo "Building image..."
if docker build -t "$IMAGE_TAG" .; then
    echo "Image built successfully!"
    echo "Image: $IMAGE_TAG"
    echo ""
    echo "Pour lancer le container:"
    echo "   docker run -d --name veillebot --env-file .env -p 8080:8080 $IMAGE_TAG"
    echo ""
    echo "Pour voir les logs:"
    echo "   docker logs -f veillebot"
else
    echo "ERREUR: Failed to build image"
    exit 1
fi
