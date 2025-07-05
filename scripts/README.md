# 🛠️ Scripts VeilleBot

Ce dossier contient tous les scripts utilitaires pour la gestion du VeilleBot.

## 📜 Liste des scripts

### 🚀 **deploy-commands.js**
**But :** Déploie les commandes slash Discord  
**Usage :** `node scripts/deploy-commands.js`  
**Description :** Enregistre toutes les commandes slash du bot sur Discord (global ou serveur)

### 🔧 **setup-tokens.sh**
**But :** Configuration interactive des tokens et IDs  
**Usage :** `bash scripts/setup-tokens.sh`  
**Description :** Guide interactif pour configurer les variables d'environnement

### 🧪 **test-ci.sh**
**But :** Tests de qualité du code  
**Usage :** `bash scripts/test-ci.sh`  
**Description :** Vérifie la syntaxe JavaScript et les dépendances

### 📊 **check-deployment.sh**
**But :** Vérification du déploiement  
**Usage :** `bash scripts/check-deployment.sh`  
**Description :** Vérifie l'état du déploiement et la santé du bot

## 💡 Usage recommandé

1. **Premier setup :** `bash scripts/setup-tokens.sh`
2. **Déployer commandes :** `node scripts/deploy-commands.js`
3. **Tester le code :** `bash scripts/test-ci.sh`
4. **Vérifier deploy :** `bash scripts/check-deployment.sh`

## 📁 Structure organisée

Tous les scripts sont maintenant centralisés dans ce dossier pour une meilleure organisation du projet.
