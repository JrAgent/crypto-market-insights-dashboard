// Dashboard Script (Updated for Real-Data API)
class CryptoDashboard {
    constructor() {
        this.init();
    }

    async init() {
        this.updateDateTime();
        setInterval(() => this.updateDateTime(), 1000);
        
        await this.loadAllData();
        
        // Refresh data every 30 seconds
        setInterval(() => this.loadAllData(), 30000); 
    }

    updateDateTime() {
        const now = new Date();
        const timeString = now.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit', 
            second: '2-digit',
            hour12: true 
        });
        const dateString = now.toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
        
        document.getElementById('current-time').textContent = timeString;
        document.getElementById('current-date').textContent = dateString;
    }

    async loadAllData() {
        // Load data in parallel for efficiency
        await Promise.all([
            this.loadDailyBrief(),
            this.loadProjectData()
        ]);
        // Note: CryptoChart / Heatmap logic removed as the data is now integrated into project cards
    }

    async loadDailyBrief() {
        const contentArea = document.getElementById('daily-brief-content');
        contentArea.innerHTML = '<div class="loading"><div class="spinner"></div><span> Fetching Daily Brief...</span></div>';
        
        try {
            // Fetch content from the new Express API endpoint
            const response = await fetch('/api/daily-brief');
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
            // Check for file not found or empty content (addressing previous failures)
            if (!data.content || data.content.includes("Could not load content")) {
                 contentArea.innerHTML = '<p class="error-message">Daily Brief failed to load. The file may be missing or the server could not access it. Check server logs.</p>';
                 return;
            }

            // The content is already HTML (from server-side Markdown conversion)
            contentArea.innerHTML = data.content; 

        } catch (error) {
            contentArea.innerHTML = `<p class="error-message">Error loading Daily Brief: Network or server issue.</p>`;
            console.error('Error in loadDailyBrief:', error);
        }
    }

    async loadProjectData() {
        try {
            // Fetch structured project data
            const response = await fetch('/api/project-data');
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
            this.renderProjectCards(data.projects);
            this.renderAISuggestions(data.ai_suggestions);

        } catch (error) {
            document.getElementById('project-cards-container').innerHTML = `<p class="error-message" style="grid-column: 1 / -1;">Error loading Project Data: ${error.message}</p>`;
            document.getElementById('ai-ideas-card').querySelector('.content-area').innerHTML = `<p class="error-message">Error loading AI Ideas.</p>`;
            console.error('Error in loadProjectData:', error);
        }
    }

    renderProjectCards(projects) {
        const container = document.getElementById('project-cards-container');
        // Clear container to avoid duplicates during refresh
        container.innerHTML = ''; 

        for (const key in projects) {
            const project = projects[key];
            const card = document.createElement('div');
            card.id = `${key}-card`; // e.g., "ohana-card"
            card.className = 'card';
            
            // Generate To-Do List HTML
            const todoListHTML = project.todos.map(item => `
                <div class="todo-item">
                    <input type="checkbox" ${item.completed ? 'checked' : ''} disabled> ${item.task}
                </div>
            `).join('');

            // Generate Research Feed HTML
            const researchFeedHTML = project.research.map(item => `
                <div class="research-item">
                    <a href="#" title="${item.title}">${item.title}</a>
                    <span class="research-date">${item.date}</span>
                    <!-- The full markdown content is embedded in the htmlContent property -->
                    <div class="research-content" style="display:none;">${item.htmlContent}</div>
                </div>
            `).join('');
            
            // Full Card HTML
            card.innerHTML = `
                <h3>${project.name}</h3>
                <div class="project-card-content">
                    <div class="todo-list">
                        <h4>To-Do List</h4>
                        ${todoListHTML}
                    </div>
                    <div class="research-feed">
                        <h4>Proactive Research</h4>
                        ${researchFeedHTML}
                    </div>
                </div>
            `;
            container.appendChild(card);
        }
    }

    renderAISuggestions(suggestions) {
        const contentArea = document.getElementById('ai-ideas-card').querySelector('.content-area');
        
        const ideasHTML = suggestions.map(idea => `
            <div class="ai-idea-item">
                <p><strong>${idea.topic}:</strong> ${idea.suggestion}</p>
            </div>
        `).join('');

        contentArea.innerHTML = ideasHTML;
    }

}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // To serve the dashboard locally with mock data, run 'node server.js'
    // This script will run on the Vercel-hosted frontend, fetching data from the API endpoint exposed by server.js
    new CryptoDashboard();
});