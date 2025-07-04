# Configuration Guide - VeilleBot

## 🚀 Étapes de configuration rapide

### 1. Configurer votre bot Discord

1. **Allez sur le Discord Developer Portal** : https://discord.com/developers/applications
2. **Créez une nouvelle application** ou sélectionnez une existante
3. **Dans l'onglet "Bot"** :
   - Copiez le **Token** 
   - Activez ces intents :
     - ✅ **Presence Intent** (optionnel)
     - ✅ **Server Members Intent** (optionnel) 
     - ❌ **Message Content Intent** (laissez désactivé)

### 2. Récupérer les IDs Discord

Pour obtenir les IDs, activez le **Mode développeur** dans Discord :
- Discord → Paramètres → Avancé → Mode développeur ✅

Puis récupérez :
- **Client ID** : Discord Developer Portal → Votre app → "General Information" → Application ID
- **Guild ID** : Clic droit sur votre serveur Discord → "Copier l'ID"
- **Channel ID** : Clic droit sur le canal de news → "Copier l'ID"

### 3. Modifier config.json

Remplacez les valeurs dans `config.json` :

```json
{
  "token": "VOTRE_TOKEN_BOT_ICI",
  "clientId": "VOTRE_CLIENT_ID_ICI", 
  "guildId": "VOTRE_GUILD_ID_ICI",
  "channelId": "VOTRE_CHANNEL_ID_ICI"
}
```

### 4. Inviter le bot sur votre serveur

URL d'invitation (remplacez CLIENT_ID) :
```
https://discord.com/api/oauth2/authorize?client_id=CLIENT_ID&permissions=274877976576&scope=bot%20applications.commands
```

### 5. Démarrer le bot

```bash
# Enregistrer les commandes slash
node deploy-commands.js

# Démarrer le bot
npm start
```

## ✅ Vérification

Si tout fonctionne, vous devriez voir :
```
📂 Chargement de 1 commande(s)...
✅ Commande "veille.js" chargée avec succès
📰 15 flux RSS chargé(s)
🔌 Connexion au bot Discord...
🚀 Bot connecté en tant que VotreBot#1234
📢 Canal de news configuré: #votre-canal
🎉 Bot prêt ! Démarrage de la surveillance des news...
```

## 🔧 Commandes disponibles

- `/veille` : Lance la veille manuellement et affiche les dernières news

## 📊 Le bot vérifie automatiquement les flux RSS toutes les heures !
