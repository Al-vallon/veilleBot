const Parser = require("rss-parser");
const fs = require("fs");
const path = require("path");

class NewsManager {
    constructor() {
        this.parser = new Parser();
        this.lastTitles = {};
        this.feedsPath = path.join(__dirname, "../feeds.json");
        this.loadFeeds();
    }

    loadFeeds() {
        try {
            if (fs.existsSync(this.feedsPath)) {
                this.feeds = JSON.parse(fs.readFileSync(this.feedsPath, "utf-8"));
                console.log(`📰 ${this.feeds.length} flux RSS chargé(s)`);
            } else {
                console.warn('⚠️ Fichier feeds.json introuvable');
                this.feeds = [];
            }
        } catch (error) {
            console.error('❌ Erreur lors du chargement des flux RSS:', error.message);
            this.feeds = [];
        }
    }

    matchKeywords(text, keywords) {
        if (!text || !keywords || keywords.length === 0) return false;
        return keywords.some(keyword => 
            text.toLowerCase().includes(keyword.toLowerCase())
        );
    }

    async fetchNews() {
        const relevantNews = [];

        for (const feed of this.feeds) {
            try {
                console.log(`🔍 Vérification du flux: ${feed.name}`);
                const parsed = await this.parser.parseURL(feed.url);
                const newItems = [];

                for (const item of parsed.items) {
                    // Arrêter si on atteint le dernier titre connu
                    if (item.title === this.lastTitles[feed.url]) break;

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
                    console.log(`✅ ${newItems.length} nouvel(s) article(s) trouvé(s) sur ${feed.name}`);
                }

            } catch (error) {
                console.error(`❌ Erreur sur le flux ${feed.name}:`, error.message);
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
