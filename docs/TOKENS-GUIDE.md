# 🔑 Guide de Configuration des Tokens

## Secrets GitHub Actions Requis

### 1. 🐳 Docker Hub (OBLIGATOIRES)

#### DOCKER_USERNAME
- **Valeur** : Votre nom d'utilisateur Docker Hub
- **Exemple** : `nanandre`
- **Où le trouver** : C'est votre nom d'utilisateur sur hub.docker.com

#### DOCKER_PASSWORD  
- **Valeur** : Token d'accès Docker Hub (PAS votre mot de passe)
- **Comment l'obtenir** :
  1. Allez sur [hub.docker.com](https://hub.docker.com)
  2. Connectez-vous → Account Settings → Security
  3. Cliquez "New Access Token"
  4. Nom : `GitHub Actions VeilleBot`
  5. Permissions : `Read, Write, Delete`
  6. Copiez le token généré (commence par `dckr_pat_...`)

### 2. 🚀 Render (OPTIONNELS mais recommandés)

#### RENDER_DEPLOY_HOOK
- **Valeur** : URL de déploiement automatique Render
- **Comment l'obtenir** :
  1. Allez dans votre service Render
  2. Settings → Build & Deploy
  3. Copiez "Deploy Hook URL"
  4. Format : `https://api.render.com/deploy/srv-xxxxx?key=xxxxx`

#### RENDER_APP_URL
- **Valeur** : URL publique de votre app Render
- **Exemple** : `https://veillebot.onrender.com`
- **Où le trouver** : Dashboard Render → votre service → URL en haut

## ❌ Secrets NON Requis

Ces variables sont dans votre `.env` local, PAS dans GitHub :
- ❌ `DISCORD_TOKEN` (déjà dans .env)
- ❌ `DISCORD_CLIENT_ID` (déjà dans .env)  
- ❌ `DISCORD_CHANNEL_ID` (déjà dans .env)
- ❌ `DISCORD_GUILD_ID` (déjà dans .env)

## 📋 Configuration Étape par Étape

### Étape 1 : Docker Hub Token
```
1. hub.docker.com → Login
2. Account Settings → Security  
3. New Access Token
4. Nom: "GitHub Actions VeilleBot"
5. Permissions: Read, Write, Delete
6. Generate Token
7. Copiez le token (dckr_pat_...)
```

### Étape 2 : GitHub Secrets
```
1. GitHub repo → Settings
2. Secrets and variables → Actions
3. New repository secret
4. Nom: DOCKER_USERNAME, Valeur: votre_username
5. New repository secret  
6. Nom: DOCKER_PASSWORD, Valeur: le_token_copié
```

### Étape 3 : Test
```bash
git add .
git commit -m "test: CI/CD setup"
git push origin main
# → Vérifiez dans Actions tab si ça marche
```

## ✅ Configuration Minimale

Pour commencer, vous n'avez besoin QUE de :
- `DOCKER_USERNAME`
- `DOCKER_PASSWORD`

Les secrets Render sont optionnels. Sans eux, la CI :
- ✅ Build l'image Docker
- ✅ Push sur Docker Hub  
- ⚠️ Skip le déploiement Render

## 🔍 Vérification

Une fois configuré, allez dans :
`GitHub repo → Actions → Dernier workflow`

Vous devriez voir :
- ✅ Quality Check passed
- ✅ Docker build passed
- ✅ Docker push passed
- ✅ Image disponible sur Docker Hub
