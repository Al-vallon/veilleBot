# 🤖 VeilleBot - Bot Discord de Veille Technologique

[![Docker Hub](https://img.shields.io/docker/pulls/nanandre/veillebot?style=flat-square&logo=docker)](https://hub.docker.com/r/nanandre/veillebot)
[![Docker Image Size](https://img.shields.io/docker/image-size/nanandre/veillebot/latest?style=flat-square&logo=docker)](https://hub.docker.com/r/nanandre/veillebot)

Bot Discord automatisé pour surveiller 15 flux RSS et envoyer les nouvelles pertinentes selon des mots-clés configurés.

## 🚀 Installation rapide

### 🐳 Avec Docker (recommandé)

```bash
# Depuis Docker Hub (image publique)
docker run -d --name veillebot --env-file .env -p 8080:8080 nanandre/veillebot:latest

# Ou avec docker-compose
curl -O https://raw.githubusercontent.com/nanandre/veillebot/main/docker-compose.prod.yml
docker-compose -f docker-compose.prod.yml up -d
```

### 💻 Installation locale

1. **Configurez Discord** : Ajoutez vos tokens dans `.env`
2. **Installez** : `npm install`
3. **Déployez** : `node deploy-commands.js`
4. **Démarrez** : `npm start`

## ⚡ Commandes disponibles

- `/veille` - Lance la veille manuellement
- `/stats` - Affiche les statistiques du bot
- `/reset-date` - Réinitialise la date de surveillance

## 📁 Structure du projet

```
veilleBot/
├── src/                 # Code source
│   ├── discordClient.js # Client Discord
│   ├── commandHandler.js# Gestionnaire de commandes
│   ├── newsManager.js   # Gestionnaire RSS
│   └── keepalive.js     # Serveur de monitoring
├── commands/
│   └── all-commands.js  # Toutes les commandes
├── feeds.json           # Configuration des flux RSS
├── config.json          # Configuration Discord
├── .env                 # Variables d'environnement
└── bot.js               # Point d'entrée
```

## 🎯 Fonctionnalités

- ⏰ **Surveillance automatique** toutes les heures
- 🔍 **Filtrage par mots-clés** pour chaque source
- 📅 **Filtrage par date** (seulement les nouveaux articles)
- 📰 **15 sources RSS** (Dev, IA, DevOps, Python, etc.)
- 🚨 **Notifications Discord** automatiques
- 📊 **Statistiques** et monitoring

## 🔧 Configuration

Le bot ne notifie que les articles publiés après sa première installation, évitant ainsi les anciennes nouvelles.

### Variables d'environnement (.env)

```env
DISCORD_TOKEN=votre_token_discord
CLIENT_ID=votre_client_id
GUILD_ID=votre_server_id (optionnel pour déploiement global)
CHANNEL_ID=id_du_canal_de_veille
```

> **💡 Astuce** : Copiez `.env.example` vers `.env` et remplissez vos valeurs Discord.

## 🐳 Docker

### Images disponibles

- **Docker Hub** : `nanandre/veillebot:latest`
- **Build local** : `docker build -t veillebot .`

### Scripts de développement

```bash
# Tester l'environnement avant push
bash test-ci.sh

# Configurer les secrets GitHub (première fois)
bash setup-tokens.sh
```

## 🚀 CI/CD Automatique

Le projet utilise GitHub Actions pour l'automatisation complète :

- **✅ Quality Check** : Vérification syntaxe + détection émojis
- **🐳 Docker Build** : Construction et publication automatique  
- **📦 Versioning** : Tags automatiques (latest, v1.0.0, etc.)
- **🚀 Deploy** : Déploiement automatique sur Render

### Configuration rapide
1. Configurez les secrets GitHub (voir [CI-CD-GUIDE.md](CI-CD-GUIDE.md))
2. Push votre code → Déploiement automatique !

```bash
git add .
git commit -m "feat: nouvelle fonctionnalité"  
git push origin main
# → Build + Deploy automatique ! 🎉
```

Pour plus de détails : **[📖 Guide CI/CD complet](CI-CD-GUIDE.md)**

---
*Bot développé avec Discord.js v14 et RSS-Parser*
