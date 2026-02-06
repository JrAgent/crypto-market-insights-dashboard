import express from 'express';
import { readFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { marked } from 'marked';

// Use Vercel's preferred way to resolve paths to bundled files
const DATA_ROOT = process.cwd();

// Utility function to read and convert Markdown to HTML
async function readMarkdownFile(filePath) {
    try {
        const fullPath = path.join(DATA_ROOT, filePath);
        const content = await readFile(fullPath, 'utf-8');
        return marked(content);
    } catch (error) {
        console.error(`Error reading or converting file ${filePath} at path ${fullPath}:`, error.message);
        return `<p class="error-message">Could not load content for ${filePath}. File not found at ${fullPath}.</p>`;
    }
}

// ...
// API 1: Get Daily Brief Content
app.get('/api/daily-brief', async (req, res) => {
    // The daily brief is saved with today's date
    const today = new Date().toISOString().slice(0, 10);
    const briefPath = `daily_brief_${today}.md`; 
    
    // In this simulation, we'll use the file we just created
    const htmlContent = await readMarkdownFile(briefPath);
    
    res.json({ content: htmlContent });
});

// API 2: Get All Project Data (To-Dos, Research, AI Suggestions)
app.get('/api/project-data', async (req, res) => {
    try {
        const dataPath = 'project_data.json'; // Simpler pathing from root
        const data = await readFile(path.join(DATA_ROOT, dataPath), 'utf-8');
        const projectData = JSON.parse(data);

        // For each research entry, we need to read the markdown content and include it
        for (const projectKey in projectData.projects) {
            const project = projectData.projects[projectKey];
            for (const item of project.research) {
                // Read the markdown file content for the frontend to display
                item.htmlContent = await readMarkdownFile(item.file);
            }
        }
        
        res.json(projectData);
    } catch (error) {
        console.error('Error loading project data:', error.message);
        res.status(500).json({ error: 'Failed to load project data.', details: error.message });
    }
});

// --- Dashboard Route (Serves the main HTML file) ---

app.get('/', (req, res) => {
    // Directly send the dashboard.html file
    res.sendFile(path.join(__dirname, 'dashboard.html'));
});

// For Vercel deployment: export the app
export default app;

// Listen on local port only if not running on Vercel
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server running at http://localhost:${PORT}`);
    });
}
