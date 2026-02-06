// Mock API Server Simulation
// This file simulates API endpoints that the dashboard would connect to in a production environment

class MockApiServer {
    constructor() {
        this.dataCache = {};
        this.initMockData();
    }

    initMockData() {
        // Initialize with some mock data
        this.dataCache.dailyBrief = this.generateDailyBrief();
        this.dataCache.insights = this.generateInsights();
        this.dataCache.cryptoData = this.generateCryptoData();
        this.dataCache.projectCards = this.generateProjectCards();
    }

    generateDailyBrief() {
        const cryptos = ['Bitcoin', 'Ethereum', 'Solana', 'Cardano', 'Polkadot'];
        const movements = ['up', 'down', 'stable'];
        const percentages = [1.2, 2.5, -0.8, 3.1, -1.5];
        
        return {
            timestamp: new Date().toISOString(),
            summary: `Daily Market Summary`,
            details: cryptos.map((crypto, index) => ({
                name: crypto,
                movement: movements[Math.floor(Math.random() * movements.length)],
                percentage: percentages[index],
                price: (Math.random() * 10000).toFixed(2)
            })),
            totalMarketCapChange: `$${(Math.random() * 100).toFixed(1)}B`,
            volume: `${(Math.random() * 50).toFixed(1)}B`
        };
    }

    generateInsights() {
        const topics = [
            "Technical Analysis",
            "DeFi Sector",
            "NFT Market",
            "Institutional Interest",
            "Regulatory Update",
            "Mining Activity",
            "Network Metrics"
        ];
        
        return {
            timestamp: new Date().toISOString(),
            insights: topics.map(topic => ({
                topic: topic,
                insight: this.generateInsightSentence(topic),
                confidence: Math.floor(Math.random() * 100) + 1
            }))
        };
    }

    generateInsightSentence(topic) {
        const sentences = {
            "Technical Analysis": `Bitcoin is approaching resistance at ${(50000 + Math.random() * 5000).toFixed(0)}, watch for breakout potential.`,
            "DeFi Sector": `Uniswap v3 volume up ${(20 + Math.random() * 15).toFixed(0)}% this week, indicating renewed DeFi interest.`,
            "NFT Market": `Ethereum NFT sales increased ${(10 + Math.random() * 15).toFixed(0)}% in the past 24 hours.`,
            "Institutional Interest": `${Math.floor(Math.random() * 3) + 1} major banks filed for crypto custody licenses this week.`,
            "Regulatory Update": `New guidelines for utility tokens boosted market confidence by ${(70 + Math.random() * 20).toFixed(0)}%.`,
            "Mining Activity": `Hash rate for Bitcoin has increased by ${(2 + Math.random() * 5).toFixed(1)}% in the last week.`,
            "Network Metrics": `Ethereum network gas fees have decreased by ${(10 + Math.random() * 15).toFixed(0)}% due to EIP improvements.`
        };
        
        return sentences[topic] || `Market insight for ${topic} shows ${(Math.random() > 0.5 ? 'positive' : 'negative')} trends.`;
    }

    generateCryptoData() {
        const symbols = ['BTC', 'ETH', 'SOL', 'ADA', 'DOT', 'AVAX', 'MATIC', 'LINK', 'DOGE', 'SHIB'];
        
        return symbols.map(symbol => ({
            symbol: symbol,
            name: this.symbolToName(symbol),
            price: (Math.random() * 10000).toFixed(2),
            change24h: ((Math.random() - 0.5) * 20).toFixed(2),
            volume: (Math.random() * 1000000000).toFixed(0),
            marketCap: (Math.random() * 50000000000).toFixed(0)
        }));
    }

    symbolToName(symbol) {
        const names = {
            'BTC': 'Bitcoin',
            'ETH': 'Ethereum',
            'SOL': 'Solana',
            'ADA': 'Cardano',
            'DOT': 'Polkadot',
            'AVAX': 'Avalanche',
            'MATIC': 'Polygon',
            'LINK': 'Chainlink',
            'DOGE': 'Dogecoin',
            'SHIB': 'Shiba Inu'
        };
        return names[symbol] || symbol;
    }

    generateProjectCards() {
        const symbols = ['BTC', 'ETH', 'SOL', 'ADA', 'DOT', 'LINK'];
        
        return symbols.map(symbol => {
            const change = ((Math.random() - 0.5) * 10).toFixed(2);
            const isPositive = parseFloat(change) >= 0;
            
            return {
                symbol: symbol,
                name: this.symbolToName(symbol),
                price: `$${(Math.random() * 10000).toFixed(2)}`,
                change: `${change}%`,
                positive: isPositive,
                rank: Math.floor(Math.random() * 10) + 1
            };
        });
    }

    // API endpoints
    getDailyBrief() {
        // Simulate API delay
        return new Promise(resolve => {
            setTimeout(() => {
                this.dataCache.dailyBrief = this.generateDailyBrief();
                resolve(this.dataCache.dailyBrief);
            }, 500);
        });
    }

    getInsights() {
        return new Promise(resolve => {
            setTimeout(() => {
                this.dataCache.insights = this.generateInsights();
                resolve(this.dataCache.insights);
            }, 500);
        });
    }

    getCryptoData() {
        return new Promise(resolve => {
            setTimeout(() => {
                this.dataCache.cryptoData = this.generateCryptoData();
                resolve(this.dataCache.cryptoData);
            }, 500);
        });
    }

    getProjectCards() {
        return new Promise(resolve => {
            setTimeout(() => {
                this.dataCache.projectCards = this.generateProjectCards();
                resolve(this.dataCache.projectCards);
            }, 500);
        });
    }

    // Refresh all data
    refreshAllData() {
        return Promise.all([
            this.getDailyBrief(),
            this.getInsights(),
            this.getCryptoData(),
            this.getProjectCards()
        ]);
    }
}

// Export for use in Node.js environments or attach to window for browsers
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MockApiServer;
} else if (typeof window !== 'undefined') {
    window.MockApiServer = MockApiServer;
}

// Example usage:
// const api = new MockApiServer();
// api.getDailyBrief().then(data => console.log(data));