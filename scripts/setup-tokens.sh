#!/bin/bash

# Script interactif pour configurer les tokens GitHub Actions

echo "=== Configuration des Tokens GitHub Actions ==="
echo ""

echo "Ce script vous guide pour configurer les secrets requis."
echo ""

# Vérification des prérequis
echo "📋 Prérequis :"
echo "1. Compte Docker Hub créé"
echo "2. Repository GitHub créé et cloné"
echo "3. (Optionnel) Service Render configuré"
echo ""

read -p "Avez-vous tous les prérequis ? (y/n): " prereq
if [ "$prereq" != "y" ]; then
    echo "❌ Configurez d'abord les prérequis, puis relancez ce script."
    exit 1
fi

echo ""
echo "🐳 === CONFIGURATION DOCKER HUB ==="
echo ""

# Docker Hub Username
echo "1. DOCKER_USERNAME"
echo "   C'est votre nom d'utilisateur Docker Hub (visible sur hub.docker.com)"
read -p "   Entrez votre nom d'utilisateur Docker Hub: " docker_username

if [ -z "$docker_username" ]; then
    echo "❌ Nom d'utilisateur requis !"
    exit 1
fi

echo "   ✅ DOCKER_USERNAME: $docker_username"
echo ""

# Docker Hub Token
echo "2. DOCKER_PASSWORD (Token d'accès)"
echo "   ⚠️  ATTENTION: Il faut un TOKEN, pas votre mot de passe !"
echo ""
echo "   📝 Pour créer un token :"
echo "   1. Allez sur https://hub.docker.com"
echo "   2. Connectez-vous → Account Settings → Security"
echo "   3. Cliquez 'New Access Token'"
echo "   4. Nom: 'GitHub Actions VeilleBot'"
echo "   5. Permissions: 'Read, Write, Delete'"
echo "   6. Copiez le token généré (commence par dckr_pat_...)"
echo ""

read -p "   Avez-vous créé votre token ? (y/n): " token_ready
if [ "$token_ready" != "y" ]; then
    echo "❌ Créez d'abord votre token Docker Hub, puis relancez ce script."
    exit 1
fi

read -s -p "   Collez votre token Docker Hub: " docker_token
echo ""

if [ -z "$docker_token" ]; then
    echo "❌ Token requis !"
    exit 1
fi

if [[ $docker_token == dckr_pat_* ]]; then
    echo "   ✅ Token format correct"
else
    echo "   ⚠️  Le token ne commence pas par 'dckr_pat_' - vérifiez que c'est bien un token d'accès"
fi

echo ""
echo "🚀 === CONFIGURATION RENDER (OPTIONNEL) ==="
echo ""

read -p "Voulez-vous configurer Render pour le déploiement automatique ? (y/n): " setup_render

if [ "$setup_render" = "y" ]; then
    echo ""
    echo "3. RENDER_DEPLOY_HOOK"
    echo "   📝 Pour l'obtenir :"
    echo "   1. Allez dans votre service Render"
    echo "   2. Settings → Build & Deploy"
    echo "   3. Copiez 'Deploy Hook URL'"
    echo ""
    
    read -p "   Collez votre Deploy Hook URL: " render_hook
    
    echo ""
    echo "4. RENDER_APP_URL"
    echo "   C'est l'URL publique de votre app (ex: https://veillebot.onrender.com)"
    read -p "   Entrez votre URL Render: " render_url
fi

echo ""
echo "📋 === RÉSUMÉ DES SECRETS À CONFIGURER ==="
echo ""
echo "Dans GitHub → Settings → Secrets and variables → Actions :"
echo ""
echo "Nom: DOCKER_USERNAME"
echo "Valeur: $docker_username"
echo ""
echo "Nom: DOCKER_PASSWORD"
echo "Valeur: [le token que vous avez copié]"
echo ""

if [ "$setup_render" = "y" ]; then
    if [ -n "$render_hook" ]; then
        echo "Nom: RENDER_DEPLOY_HOOK"
        echo "Valeur: $render_hook"
        echo ""
    fi
    
    if [ -n "$render_url" ]; then
        echo "Nom: RENDER_APP_URL"
        echo "Valeur: $render_url"
        echo ""
    fi
fi

echo "🔗 === LIENS UTILES ==="
echo ""
echo "• Votre repo GitHub secrets: https://github.com/VOTRE_USERNAME/VOTRE_REPO/settings/secrets/actions"
echo "• Docker Hub tokens: https://hub.docker.com/settings/security"
echo "• Render dashboard: https://dashboard.render.com"
echo ""

echo "✅ === ÉTAPES SUIVANTES ==="
echo ""
echo "1. Configurez ces secrets dans GitHub (lien ci-dessus)"
echo "2. Testez en local : ./test-ci.sh"
echo "3. Poussez votre code : git push origin main"
echo "4. Vérifiez dans GitHub → Actions tab"
echo ""

echo "🎉 Une fois configuré, chaque push mettra à jour Docker Hub automatiquement !"
echo ""

# Sauvegarde des infos pour référence
cat > .github-secrets-reminder.txt << EOF
# Secrets à configurer dans GitHub Actions
# Repository → Settings → Secrets and variables → Actions

DOCKER_USERNAME=$docker_username
DOCKER_PASSWORD=[le token Docker Hub que vous avez créé]
EOF

if [ "$setup_render" = "y" ]; then
    if [ -n "$render_hook" ]; then
        echo "RENDER_DEPLOY_HOOK=$render_hook" >> .github-secrets-reminder.txt
    fi
    if [ -n "$render_url" ]; then
        echo "RENDER_APP_URL=$render_url" >> .github-secrets-reminder.txt
    fi
fi

echo "📝 Informations sauvegardées dans .github-secrets-reminder.txt"
