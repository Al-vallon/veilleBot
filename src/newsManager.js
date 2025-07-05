const Parser = require("rss-parser");
const fs = require("fs");
const path = require("path");

class NewsManager {
    constructor() {
        this.parser = new Parser();
        this.lastTitles = {};
        this.feedsPath = path.join(__dirname, "../feeds.json");
        this.configPath = path.join(__dirname, "../bot-config.json");
        this.startupDate = this.getOrCreateStartupDate();
        this.loadFeeds();
    }

    getOrCreateStartupDate() {
        try {
            if (fs.existsSync(this.configPath)) {
                const config = JSON.parse(fs.readFileSync(this.configPath, "utf-8"));
                if (config.startupDate) {
                    console.log(`Date de démarrage du bot: ${new Date(config.startupDate).toLocaleString('fr-FR')}`);
                    return new Date(config.startupDate);
                }
            }
        } catch (error) {
            console.warn('ATTENTION: Erreur lors de la lecture de la config:', error.message);
        }

        // Créer une nouvelle date de démarrage
        const now = new Date();
        const config = { startupDate: now.toISOString() };
        
        try {
            fs.writeFileSync(this.configPath, JSON.stringify(config, null, 2));
            console.log(`NOUVELLE INSTALLATION: Première installation détectée - Date de démarrage: ${now.toLocaleString('fr-FR')}`);
            console.log(`Seuls les articles publiés après cette date seront notifiés`);
        } catch (error) {
            console.error('Erreur lors de la sauvegarde de la config:', error.message);
        }

        return now;
    }

    loadFeeds() {
        try {
            if (fs.existsSync(this.feedsPath)) {
                this.feeds = JSON.parse(fs.readFileSync(this.feedsPath, "utf-8"));
                console.log(`${this.feeds.length} flux RSS chargé(s)`);
            } else {
                console.warn('ATTENTION: Fichier feeds.json introuvable');
                this.feeds = [];
            }
        } catch (error) {
            console.error('Erreur lors du chargement des flux RSS:', error.message);
            this.feeds = [];
        }
    }

    matchKeywords(text, keywords) {
        if (!text || !keywords || keywords.length === 0) return false;
        return keywords.some(keyword => 
            text.toLowerCase().includes(keyword.toLowerCase())
        );
    }

    isArticleRecent(item) {
        if (!item.pubDate) {
            // Si pas de date, on considère l'article comme récent
            return true;
        }

        try {
            const articleDate = new Date(item.pubDate);
            const isRecent = articleDate >= this.startupDate;
            
            if (!isRecent) {
                console.log(`IGNORE: Article ignoré (trop ancien): ${item.title?.substring(0, 50)}... (${articleDate.toLocaleDateString('fr-FR')})`);
            }
            
            return isRecent;
        } catch (error) {
            console.warn(`ATTENTION: Date invalide pour l'article: ${item.title?.substring(0, 50)}...`);
            return true; // En cas d'erreur, on garde l'article
        }
    }

    async fetchNews() {
        const relevantNews = [];

        for (const feed of this.feeds) {
            try {
                console.log(`Vérification du flux: ${feed.name}`);
                const parsed = await this.parser.parseURL(feed.url);
                const newItems = [];

                for (const item of parsed.items) {
                    // Arrêter si on atteint le dernier titre connu
                    if (item.title === this.lastTitles[feed.url]) break;

                    // Vérifier si l'article est récent (après la date de démarrage du bot)
                    if (!this.isArticleRecent(item)) continue;

                    // Vérifier les mots-clés dans le titre et le contenu
                    const titleMatch = this.matchKeywords(item.title, feed.keywords);
                    const contentMatch = this.matchKeywords(item.contentSnippet, feed.keywords);

                    if (titleMatch || contentMatch) {
                        newItems.push({
                            ...item,
                            source: feed.name,
                            category: feed.category || 'Général'
                        });
                    }
                }

                // Mettre à jour le dernier titre
                if (parsed.items.length > 0) {
                    this.lastTitles[feed.url] = parsed.items[0].title;
                }

                // Ajouter les nouveaux articles (dans l'ordre chronologique)
                relevantNews.push(...newItems.reverse());
                
                if (newItems.length > 0) {
                    console.log(`${newItems.length} nouvel(s) article(s) trouvé(s) sur ${feed.name}`);
                }

            } catch (error) {
                console.error(`Erreur sur le flux ${feed.name}:`, error.message);
            }
        }

        return relevantNews;
    }

    getStats() {
        return {
            totalFeeds: this.feeds.length,
            trackedFeeds: Object.keys(this.lastTitles).length
        };
    }
}

module.exports = NewsManager;
