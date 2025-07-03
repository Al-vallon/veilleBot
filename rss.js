const Parser = require("rss-parser");
const parser = new Parser();
const fs = require("fs");

const feeds = JSON.parse(fs.readFileSync("feeds.json", "utf-8"));

let lastTitles = {};

// function  to match keywords
function matchKeywords(title, keywords) {
    return keywords.some(keyword => title.toLowerCase().includes(keyword.toLowerCase()));
}

async function fetchNews() {
    const relevantNews = [];

for (const feed of feeds) {
    try {
        const parsed = await parser.parseURL(feed.url);
        const newItems = [];

        for (const item of parsed.items) {
            if (item.title === lastTitles[feed.url]) break;

            if (
            matchKeywords(item.title, feed.keywords) ||
            matchKeywords(item.contentSnippet, feed.keywords)
            ) {
            newItems.push({
                ...item,
                source: feed.name
            });
            }
        }

        if (parsed.items.length > 0) {
            lastTitles[feed.url] = parsed.items[0].title;
        }

        relevantNews.push(...newItems.reverse());
        } catch (err) {
        console.error(`Erreur sur ${feed.name}`, err.message);
        }
    }

    return relevantNews;
}

module.exports = fetchNews;
