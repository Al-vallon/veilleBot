#!/bin/bash

# Script pour vérifier le statut du déploiement

echo "=== Vérification du Déploiement VeilleBot ==="
echo ""

# 1. Vérifier GitHub Actions
echo "🔍 1. Statut GitHub Actions"
echo "   Ouvrez : https://github.com/VOTRE_USERNAME/VOTRE_REPO/actions"
echo "   Vérifiez que les 3 workflows sont verts ✅"
echo ""

# 2. Vérifier Docker Hub
echo "🐳 2. Statut Docker Hub"
echo "   Ouvrez : https://hub.docker.com/r/nanandre/veillebot/tags"
echo "   Vérifiez la date du tag 'latest'"
echo ""

# 3. Test local de la nouvelle image
echo "🧪 3. Test de la nouvelle image..."

if command -v docker &> /dev/null; then
    echo "   Pulling dernière image..."
    if docker pull nanandre/veillebot:latest > /dev/null 2>&1; then
        echo "   ✅ Image téléchargée avec succès"
        
        # Afficher la date de création
        CREATED=$(docker image inspect nanandre/veillebot:latest --format '{{.Created}}' 2>/dev/null)
        if [ -n "$CREATED" ]; then
            echo "   📅 Créée le : $CREATED"
        fi
        
        # Test rapide
        echo "   🧪 Test rapide de l'image..."
        if docker run --rm nanandre/veillebot:latest node --version > /dev/null 2>&1; then
            echo "   ✅ Image fonctionne correctement"
        else
            echo "   ❌ Problème avec l'image"
        fi
    else
        echo "   ❌ Erreur lors du téléchargement"
        echo "   → Vérifiez que l'image existe sur Docker Hub"
    fi
else
    echo "   ⚠️  Docker non installé - impossible de tester"
fi

echo ""
echo "🎯 === RÉSUMÉ ==="
echo ""
echo "Pour un déploiement réussi, vous devez avoir :"
echo "   ✅ GitHub Actions - 3 workflows verts"
echo "   ✅ Docker Hub - Tag 'latest' mis à jour"
echo "   ✅ Image locale - Fonctionnelle"
echo ""
echo "🚀 Si tout est vert, votre bot est déployé avec succès !"
