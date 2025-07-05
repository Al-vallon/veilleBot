# Scripts de Développement VeilleBot

## 📁 Organisation des scripts

Tous les scripts sont maintenant organisés dans le dossier `scripts/` :

```
scripts/
├── deploy-commands.js      # 🚀 Déploiement commandes Discord
├── setup-tokens.sh         # 🔧 Configuration interactive
├── test-ci.sh              # 🧪 Tests qualité code
├── check-deployment.sh     # 📊 Vérification déploiement
└── README.md               # 📖 Documentation scripts
```

## Scripts disponibles

### 🚀 `scripts/deploy-commands.js` - Déploiement commandes Discord
**Utilité** : Déploie les commandes slash sur Discord

```bash
node scripts/deploy-commands.js
```

**Ce qu'il fait :**
- ✅ Enregistre les commandes slash globalement ou sur un serveur
- ✅ Détection automatique des commandes disponibles
- ✅ Gestion des erreurs avec fallback serveur
- ✅ Configuration via variables d'environnement

**Quand l'utiliser :** Après modification des commandes ou nouveau déploiement.

### 🧪 `scripts/test-ci.sh` - Test local avant push
**Utilité** : Tester localement avant de pusher pour éviter les échecs CI/CD

```bash
bash scripts/test-ci.sh
```

**Ce qu'il fait :**
- ✅ Vérification syntaxe JavaScript
- ✅ Détection d'émojis dans le code source  
- ✅ Test de build Docker
- ✅ Vérification des fichiers requis
- ✅ Simulation de la configuration CI

**Quand l'utiliser :** Avant chaque `git push` pour valider le code.

### 📊 `scripts/check-deployment.sh` - Vérification déploiement
**Utilité** : Vérifie l'état du déploiement et la santé du bot

```bash
bash scripts/check-deployment.sh
```

**Ce qu'il fait :**
- ✅ Vérification de l'état des services
- 📊 Contrôle de santé du bot
- 🐳 Validation du déploiement Docker
- 📝 Rapport d'état détaillé

**Quand l'utiliser :** Après un déploiement pour vérifier que tout fonctionne.

### ⚙️ `scripts/setup-tokens.sh` - Configuration interactive
**Utilité** : Guide pour configurer les secrets GitHub Actions

```bash
bash scripts/setup-tokens.sh
```

**Ce qu'il fait :**
- 🔑 Guide interactif pour Docker Hub tokens
- 🚀 Configuration optionnelle Render  
- 📝 Génération d'un résumé des secrets à configurer
- 💾 Sauvegarde dans `.github-secrets-reminder.txt`

**Quand l'utiliser :** 
- Première configuration du projet
- Renouvellement des tokens
- Nouvel environnement de développement

## Workflow recommandé

```bash
# 1. Première configuration
bash scripts/setup-tokens.sh

# 2. Déploiement des commandes Discord
node scripts/deploy-commands.js

# 3. Développement local
# ... coder ...

# 4. Test avant push  
bash scripts/test-ci.sh

# 5. Push si tests OK
git add .
git commit -m "..."
git push

# 6. Vérification post-déploiement
bash scripts/check-deployment.sh
```
git commit -m "feat: nouvelle fonctionnalité"
git push origin main

# 4. CI/CD automatique
# → GitHub Actions fait le reste automatiquement
```

## Scripts supprimés

Ces scripts ont été supprimés car redondants avec la CI/CD :
- ❌ `build-docker.sh` → CI/CD fait le build automatiquement
- ❌ `publish-docker.sh` → CI/CD fait le publish automatiquement  
- ❌ `deploy-production.sh` → CI/CD fait le déploiement automatiquement

## Backup manuel

Si besoin de build/publish manuel (debugging) :

```bash
# Build local
docker build -t nanandre/veillebot:latest .

# Push manuel (si connecté à Docker Hub)
docker push nanandre/veillebot:latest
```
