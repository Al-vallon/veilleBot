# Multi-stage build pour optimiser la taille
FROM node:20-alpine AS builder

# Installer les dépendances pour les modules natifs
RUN apk add --no-cache python3 make g++

# Créer le dossier de l'app
WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./

# Installer les dépendances (production + dev pour la build)
RUN npm ci --only=production && npm cache clean --force

# Image finale
FROM node:20-alpine AS runtime

# Créer un utilisateur non-root pour la sécurité
RUN addgroup -g 1001 -S nodejs && \
    adduser -S veillebot -u 1001

# Créer le dossier de l'app
WORKDIR /app

# Copier les node_modules depuis le builder
COPY --from=builder --chown=veillebot:nodejs /app/node_modules ./node_modules

# Copier le code source
COPY --chown=veillebot:nodejs . .

# Créer le dossier pour les configs runtime
RUN mkdir -p /app/data && chown veillebot:nodejs /app/data

# Exposer le port pour keepalive
EXPOSE 8080

# Healthcheck pour monitoring
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:8080/health || exit 1

# Changer vers l'utilisateur non-root
USER veillebot

# Démarrer le bot
CMD ["node", "bot.js"]
