const express = require('express');
const fs = require('fs');
const path = require('path');
const marked = require('marked');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse form data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Set up EJS as template engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Route for the main dashboard
app.get('/', (req, res) => {
  // Read all market insight files
  const insightsDir = path.join(__dirname, 'insights'); // Look in insights directory for insight files
  
  // Create insights directory if it doesn't exist
  if (!fs.existsSync(insightsDir)) {
    fs.mkdirSync(insightsDir, { recursive: true });
  }
  
  const files = fs.readdirSync(insightsDir)
    .filter(file => file.includes('research-digest') && file.endsWith('.md'))
    .sort((a, b) => {
      // Sort by date in filename (assuming format contains date)
      const dateA = extractDate(a);
      const dateB = extractDate(b);
      return dateB - dateA; // Descending order (newest first)
    });

  const insights = files.map(file => {
    const filePath = path.join(insightsDir, file);
    const content = fs.readFileSync(filePath, 'utf8');
    const html = marked.parse(content);
    return {
      filename: file,
      date: extractReadableDate(file),
      content: html,
      excerpt: getExcerpt(content)
    };
  });

  res.render('index', { insights });
});

// Route for adding new insight
app.get('/add-insight', (req, res) => {
  res.render('add-insight');
});

// API endpoint to save new insight
app.post('/api/add-insight', (req, res) => {
  try {
    const { title, date, category, content, notes, patterns = [] } = req.body;
    
    // Format the date for the filename
    const formattedDate = new Date(date).toISOString().split('T')[0]; // YYYY-MM-DD format
    
    // Create filename
    const slug = title.toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-');
      
    const filename = `research-digest-${formattedDate}-${slug}.md`;
    
    // Create content with metadata
    let fullContent = `# ${title}\n\n`;
    fullContent += `**Date:** ${new Date(date).toLocaleDateString()}\n`;
    fullContent += `**Category:** ${category}\n\n`;
    
    if (patterns.length > 0) {
      fullContent += `## Patterns Observed\n`;
      patterns.forEach(pattern => {
        const patternLabels = {
          'narrative_hook': 'Clear narrative/hook',
          'high_volume': 'High volume-to-market-cap ratio',
          'community_active': 'Active community engagement',
          'cross_chain': 'Cross-chain connections',
          'established_team': 'Connection to established projects/teams',
          'utility_beyond_meme': 'Utility beyond pure meme',
          'compound_narrative': 'Combines multiple trending narratives'
        };
        fullContent += `- ✅ ${patternLabels[pattern] || pattern}\n`;
      });
      fullContent += `\n`;
    }
    
    fullContent += content;
    
    if (notes) {
      fullContent += `\n\n## Additional Notes\n${notes}`;
    }
    
    // Write the file to the insights directory
    const insightsDir = path.join(__dirname, 'insights');
    if (!fs.existsSync(insightsDir)) {
      fs.mkdirSync(insightsDir, { recursive: true });
    }
    
    const filePath = path.join(insightsDir, filename);
    fs.writeFileSync(filePath, fullContent);
    
    // Redirect back to dashboard
    res.redirect('/');
  } catch (error) {
    console.error('Error saving insight:', error);
    res.status(500).render('error', { message: 'Failed to save insight' });
  }
});

// Helper function to extract date from filename
function extractDate(filename) {
  // Look for YYYY-MM-DD pattern in filename
  const dateMatch = filename.match(/(\d{4})-(\d{2})-(\d{2})/);
  if (dateMatch) {
    return new Date(`${dateMatch[1]}-${dateMatch[2]}-${dateMatch[3]}`);
  }
  // If no date found, use file modification time
  const filePath = path.join(__dirname, 'insights', filename);
  try {
    const stats = fs.statSync(filePath);
    return stats.mtime;
  } catch (err) {
    return new Date();
  }
}

// Helper function to get a readable date from filename
function extractReadableDate(filename) {
  const dateMatch = filename.match(/(\d{4})-(\d{2})-(\d{2})/);
  if (dateMatch) {
    const [, year, month, day] = dateMatch;
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  }
  return filename.split('.')[0]; // Return filename without extension if no date found
}

// Helper function to get a short excerpt from content
function getExcerpt(content) {
  // Get the first 200 characters and add ...
  const cleanContent = content.replace(/[#*_-]/g, ''); // Remove markdown formatting
  return cleanContent.substring(0, 200) + '...';
}

// Route for viewing individual insight
app.get('/insight/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, 'insights', filename);
  
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const html = marked.parse(content);
    
    res.render('insight', { 
      filename: filename,
      date: extractReadableDate(filename),
      content: html 
    });
  } catch (err) {
    res.status(404).render('error', { message: 'Insight not found' });
  }
});

// Vercel compatibility: export handler for serverless functions
module.exports = app;
module.exports.handler = require('vercel/node')(app);

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Market Insights Dashboard running on port ${PORT}`);
    console.log(`Created by Jr (Junior) for Jay`);
  });
}