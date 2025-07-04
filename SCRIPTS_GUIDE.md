# Scripts de Développement VeilleBot

## Scripts disponibles

Après nettoyage et mise en place de la CI/CD, seuls 2 scripts bash sont conservés :

### 🧪 `test-ci.sh` - Test local avant push
**Utilité** : Tester localement avant de pusher pour éviter les échecs CI/CD

```bash
./test-ci.sh
```

**Ce qu'il fait :**
- ✅ Vérification syntaxe JavaScript
- ✅ Détection d'émojis dans le code source  
- ✅ Test de build Docker
- ✅ Vérification des fichiers requis
- ✅ Simulation de la configuration CI

**Quand l'utiliser :** Avant chaque `git push` pour valider le code.

### ⚙️ `setup-tokens.sh` - Configuration interactive
**Utilité** : Guide pour configurer les secrets GitHub Actions

```bash
./setup-tokens.sh
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
# 1. Développement local
# ... coder ...

# 2. Test avant push  
./test-ci.sh

# 3. Push si tests OK
git add .
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
