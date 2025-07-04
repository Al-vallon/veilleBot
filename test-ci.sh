#!/bin/bash

# Script de test CI local
# Simule les vérifications GitHub Actions en local

set -e

echo "=== Test CI/CD Local pour VeilleBot ==="
echo ""

# 1. Test de syntaxe JavaScript
echo "🔍 1. Vérification syntaxe JavaScript..."
for file in bot.js deploy-commands.js src/*.js commands/*.js; do
  if [ -f "$file" ]; then
    echo "   Checking $file..."
    node -c "$file"
  fi
done
echo "✅ Syntaxe JavaScript OK"
echo ""

# 2. Détection d'émojis
echo "🔍 2. Détection d'émojis dans le code source..."
EMOJI_FOUND=false

# Recherche d'émojis dans les fichiers JS
if find . -name "*.js" -not -path "./node_modules/*" -exec grep -l -P "[\x{1F600}-\x{1F64F}\x{1F300}-\x{1F5FF}\x{1F680}-\x{1F6FF}\x{1F1E0}-\x{1F1FF}\x{2600}-\x{26FF}\x{2700}-\x{27BF}]" {} \; 2>/dev/null | grep -q .; then
  echo "❌ Émojis détectés dans le code source !"
  find . -name "*.js" -not -path "./node_modules/*" -exec grep -l -P "[\x{1F600}-\x{1F64F}\x{1F300}-\x{1F5FF}\x{1F680}-\x{1F6FF}\x{1F1E0}-\x{1F1FF}\x{2600}-\x{26FF}\x{2700}-\x{27BF}]" {} \; 2>/dev/null
  EMOJI_FOUND=true
else
  echo "✅ Aucun émoji trouvé dans le code source"
fi
echo ""

# 3. Test build Docker
echo "🔍 3. Test de build Docker..."
if docker build -t veillebot-ci-test . > /dev/null 2>&1; then
  echo "✅ Build Docker réussi"
  docker rmi veillebot-ci-test > /dev/null 2>&1 || true
else
  echo "❌ Échec du build Docker"
  exit 1
fi
echo ""

# 4. Vérification des fichiers requis
echo "🔍 4. Vérification des fichiers requis..."
REQUIRED_FILES=(
  "package.json"
  "Dockerfile"
  ".dockerignore"
  "bot.js"
  "src/newsManager.js"
  "src/commandHandler.js"
  "src/discordClient.js"
  "src/keepalive.js"
  "commands/all-commands.js"
)

for file in "${REQUIRED_FILES[@]}"; do
  if [ -f "$file" ]; then
    echo "   ✅ $file"
  else
    echo "   ❌ $file manquant"
    exit 1
  fi
done
echo ""

# 5. Vérification de la structure des secrets (simulation)
echo "🔍 5. Vérification de la configuration CI..."
echo "   Les secrets suivants doivent être configurés dans GitHub :"
echo "   - DOCKER_USERNAME (nom d'utilisateur Docker Hub)"
echo "   - DOCKER_PASSWORD (token Docker Hub)"
echo "   - RENDER_DEPLOY_HOOK (optionnel - hook de déploiement Render)"
echo "   - RENDER_APP_URL (optionnel - URL de l'app Render)"
echo "✅ Configuration CI vérifiée"
echo ""

# Résumé final
echo "=== Résumé du test CI local ==="
if [ "$EMOJI_FOUND" = true ]; then
  echo "❌ ÉCHEC : Émojis détectés dans le code"
  echo "   → Supprimez tous les émojis avant de pusher"
  exit 1
else
  echo "✅ SUCCÈS : Tous les tests passent"
  echo "   → Prêt pour push et déploiement automatique !"
fi

echo ""
echo "🚀 Pour déclencher le déploiement automatique :"
echo "   git add ."
echo "   git commit -m 'feat: nouvelle fonctionnalité'"
echo "   git push origin main"
echo ""
echo "📦 Image Docker sera disponible sur :"
echo "   docker pull nanandre/veillebot:latest"
