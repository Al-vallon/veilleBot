# 🚀 CI/CD Configuration Guide

Ce guide explique comment configurer l'automatisation complète du déploiement avec GitHub Actions.

## 📋 Vue d'ensemble

Le pipeline CI/CD automatise :
1. **Quality Check** - Vérification du code (syntaxe, pas d'émojis)
2. **Build & Publish** - Construction et publication de l'image Docker
3. **Deploy** - Déploiement automatique sur Render

## 🔧 Configuration requise

### 1. Secrets GitHub à configurer

Dans votre repository GitHub : `Settings > Secrets and variables > Actions`

#### Secrets Docker Hub
```
DOCKER_USERNAME=votre_username_dockerhub
DOCKER_PASSWORD=votre_token_dockerhub
```

#### Secrets Render (optionnel mais recommandé)
```
RENDER_DEPLOY_HOOK=https://api.render.com/deploy/srv-xxxxx?key=xxxxx
RENDER_APP_URL=https://veillebot.onrender.com
```

### 2. Token Docker Hub

1. Allez sur [Docker Hub](https://hub.docker.com) → Account Settings → Security
2. Créez un nouveau Access Token
3. Utilisez ce token comme `DOCKER_PASSWORD`

### 3. Deploy Hook Render

1. Dans votre service Render → Settings → Build & Deploy
2. Copiez le "Deploy Hook URL"
3. Utilisez-le comme `RENDER_DEPLOY_HOOK`

## 🔄 Workflow automatique

### Déclencheurs
- **Push sur main/master** → Build + Deploy
- **Pull Request** → Quality Check seulement
- **Tag version (v1.0.0)** → Build avec versioning

### Étapes automatiques

1. **Sur chaque commit :**
   ```
   ✅ Vérification syntaxe JavaScript
   ✅ Détection d'émojis dans le code
   ✅ Test de build Docker
   ```

2. **Sur push vers main :**
   ```
   ✅ Build image Docker
   ✅ Push vers Docker Hub (tag: latest)
   ✅ Déclenchement déploiement Render
   ✅ Health check automatique
   ```

3. **Sur tag version :**
   ```
   ✅ Build avec tags multiples
   ✅ nanandre/veillebot:latest
   ✅ nanandre/veillebot:v1.0.0
   ✅ nanandre/veillebot:1.0
   ```

## 📦 Tags Docker automatiques

| Action | Tags générés |
|--------|-------------|
| Push main | `latest` |
| Tag v1.2.3 | `latest`, `v1.2.3`, `1.2` |
| Pull Request | `pr-123` (build seulement) |

## 🚀 Utilisation

### Déploiement simple
```bash
git add .
git commit -m "feat: nouvelle fonctionnalité"
git push origin main
# → Déploiement automatique !
```

### Release avec version
```bash
git tag v1.0.0
git push origin v1.0.0
# → Build avec versioning !
```

### Test avant merge
```bash
git checkout -b feature/nouvelle-fonction
git push origin feature/nouvelle-fonction
# → Quality check seulement
```

## 🔍 Monitoring

### Vérifier le déploiement
- **GitHub Actions** : Onglet "Actions" du repository
- **Docker Hub** : Vérifier la nouvelle image
- **Render** : Logs de déploiement
- **Health Check** : `curl https://veillebot.onrender.com/health`

### Status badges (optionnel)
Ajoutez dans votre README.md :
```markdown
![Build Status](https://github.com/username/veillebot/workflows/Build%20and%20Publish%20Docker%20Image/badge.svg)
![Quality Check](https://github.com/username/veillebot/workflows/Code%20Quality%20Check/badge.svg)
```

## ⚠️ Sécurité

- ✅ Tokens stockés comme secrets GitHub
- ✅ Pas de credentials dans le code
- ✅ Build seulement sur branches protégées
- ✅ Health check avant validation

## 🛠️ Dépannage

### Échec de build Docker
```bash
# Test local
./build-docker.sh
```

### Échec de push Docker Hub
- Vérifier `DOCKER_USERNAME` et `DOCKER_PASSWORD`
- Vérifier les permissions du token

### Échec de déploiement Render
- Vérifier `RENDER_DEPLOY_HOOK`
- Vérifier les logs Render

### Health check échoue
- Vérifier `RENDER_APP_URL`
- Attendre plus longtemps le démarrage

## 📈 Avantages

✅ **Zéro intervention manuelle**
✅ **Déploiement instantané**
✅ **Versioning automatique**
✅ **Quality gates**
✅ **Rollback facile**
✅ **Monitoring intégré**

Le bot sera maintenant automatiquement mis à jour sur Docker Hub et Render à chaque modification du code ! 🎉
