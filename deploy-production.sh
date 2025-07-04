#!/bin/bash

# Script de déploiement final pour VeilleBot
# Construit et publie l'image Docker nettoyée

set -e

echo "=== Déploiement VeilleBot - Version Production ==="

# Vérification des prérequis
if ! command -v docker &> /dev/null; then
    echo "ERREUR: Docker n'est pas installé"
    exit 1
fi

if ! docker version &> /dev/null; then
    echo "ERREUR: Docker n'est pas démarré"
    exit 1
fi

echo "Docker OK"

# Variables
VERSION=${1:-"latest"}
REGISTRY="nanandre"
IMAGE_NAME="veillebot"
FULL_TAG="$REGISTRY/$IMAGE_NAME:$VERSION"

echo "Construction de l'image: $FULL_TAG"

# Build
if docker build -t "$FULL_TAG" .; then
    echo "BUILD: SUCCESS"
else
    echo "BUILD: FAILED"
    exit 1
fi

# Test local rapide
echo "Test de l'image..."
CONTAINER_ID=$(docker run -d --rm -e DISCORD_TOKEN=test -e DISCORD_CHANNEL_ID=test "$FULL_TAG")
sleep 5
if docker ps | grep -q "$CONTAINER_ID"; then
    echo "TEST: SUCCESS"
    docker stop "$CONTAINER_ID" >/dev/null 2>&1
else
    echo "TEST: FAILED"
    exit 1
fi

# Publication
echo "Publication sur Docker Hub..."
if docker push "$FULL_TAG"; then
    echo "PUBLISH: SUCCESS"
    echo ""
    echo "=== Image disponible ==="
    echo "Docker Hub: https://hub.docker.com/r/$REGISTRY/$IMAGE_NAME"
    echo "Pull: docker pull $FULL_TAG"
    echo "Run: docker run -d --env-file .env -p 8080:8080 $FULL_TAG"
else
    echo "PUBLISH: FAILED"
    exit 1
fi

echo ""
echo "DÉPLOIEMENT TERMINÉ AVEC SUCCÈS"
