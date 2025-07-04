# VeilleBot 2.0 🤖

Bot Discord pour la veille technologique automatisée avec surveillance RSS.

## � Configuration rapide

### 1. Configuration Discord
1. Allez sur https://discord.com/developers/applications
2. Créez une nouvelle application ou sélectionnez une existante
3. Dans l'onglet "Bot":
   - Copiez le Token et remplacez `DISCORD_TOKEN` dans `config.json`
   - Activez les intents suivants :
     - ✅ **Presence Intent** (optionnel)
     - ✅ **Server Members Intent** (optionnel)
     - ❌ **Message Content Intent** (laissez désactivé sauf si nécessaire)

### 2. Configuration des IDs Discord
Dans `config.json`, remplacez :
- `DISCORD_CLIENT_ID` : ID de votre application (onglet "General Information")
- `DISCORD_GUILD_ID` : ID de votre serveur Discord (clic droit sur le serveur > Copier l'ID)
- `DISCORD_CHANNEL_ID` : ID du canal où envoyer les news (clic droit sur le canal > Copier l'ID)

### 3. Installation et démarrage
```bash
npm install
node deploy-commands.js  # Enregistre les commandes slash
npm start               # Démarre le bot
```

## �📁 Structure du projet

```
veilleBot/
├── src/                          # Code source modulaire
│   ├── discordClient.js         # Gestion du client Discord
│   ├── commandHandler.js        # Gestionnaire des commandes slash
│   ├── newsManager.js           # Gestionnaire des flux RSS
│   └── keepalive.js            # Serveur Express pour le monitoring
├── commands/                    # Commandes slash Discord
│   └── veille.js               # Commande de veille manuelle
├── config/                     # Fichiers de configuration
│   └── settings.json          # Paramètres de l'application
├── bot-new.js                 # Point d'entrée principal (nouveau)
├── feeds.json                 # Configuration des flux RSS
├── package.json              # Dépendances Node.js
├── .env                      # Variables d'environnement
└── README.md                 # Documentation
```

## 🚀 Installation

1. **Cloner le projet** (si nécessaire)
2. **Installer les dépendances** :
   ```bash
   npm install
   ```

3. **Configurer l'environnement** :
   - Copier `.env.exemple` vers `.env`
   - Remplir les variables :
     ```env
     DISCORD_TOKEN=votre_token_discord
     DISCORD_CHANNEL_ID=id_du_canal
     PORT=8080
     ```

4. **Configurer les flux RSS** dans `feeds.json`

## 🔧 Utilisation

### Démarrage du bot
```bash
# Nouvelle version organisée
node bot-new.js

# Ancienne version (pour comparaison)
node bot.js
```

### Fonctionnalités

- ✅ **Surveillance automatique** des flux RSS (toutes les heures)
- ✅ **Filtrage par mots-clés** configurables
- ✅ **Commandes slash Discord** pour interaction
- ✅ **Serveur de monitoring** avec endpoints de santé
- ✅ **Gestion d'erreurs** améliorée
- ✅ **Logs détaillés** pour le débogage

### Endpoints de monitoring

- `GET /` - Status du bot
- `GET /health` - Informations de santé détaillées

## 📝 Configuration des flux RSS

Le fichier `feeds.json` contient la liste des flux à surveiller :

```json
[
  {
    "name": "TechCrunch",
    "url": "https://techcrunch.com/feed/",
    "keywords": ["AI", "blockchain", "startup"],
    "category": "Tech"
  }
]
```

## 🔧 Améliorations apportées

### Structure modulaire
- **Séparation des responsabilités** : chaque fichier a un rôle précis
- **Réutilisabilité** : modules facilement testables
- **Maintenabilité** : code plus facile à comprendre et modifier

### Gestion d'erreurs
- **Logs détaillés** avec émojis pour faciliter le débogage
- **Gestion des promesses rejetées** non capturées
- **Récupération gracieuse** en cas d'erreur sur un flux

### Performance
- **Évitement du rate limiting** Discord avec délais entre envois
- **Vérification de l'existence** des fichiers avant lecture
- **Optimisation** de la boucle de vérification des news

## 🐛 Débogage

Les logs incluent maintenant :
- 🚀 Statut de connexion
- 📂 Chargement des commandes
- 🔍 Vérification des flux RSS
- ✅ Envoi des articles
- ❌ Erreurs détaillées
