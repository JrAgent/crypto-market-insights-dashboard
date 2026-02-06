# Crypto Dashboard

A modern, responsive dashboard for cryptocurrency tracking with real-time updates and insightful analytics.

## Features

- **Real-time Clock**: Displays current time and date with automatic updates
- **Crypto Heatmap**: Visual representation of cryptocurrency price changes using Chart.js
- **Daily Brief**: Loads and displays daily market summary
- **Market Insights**: Shows detailed market analysis and trends
- **Project Cards**: Displays key cryptocurrency prices and changes
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Modern UI**: Glassmorphism design with gradient backgrounds

## Components

### Time Display
- Shows current time in 12-hour format with seconds
- Displays full date information (weekday, month, day, year)
- Updates every second

### Crypto Heatmap
- Bar chart visualization of cryptocurrency price changes
- Color-coded bars (green for positive, red for negative)
- Interactive tooltips with additional information
- Responsive sizing

### Daily Brief Section
- Loads market summary data
- Handles loading states with spinner animation
- Error handling for failed requests

### Market Insights Section
- Displays analytical insights about the market
- Clear categorization of different insight types
- Proper error handling

### Project Cards
- Individual cards for major cryptocurrencies
- Price and percentage change display
- Color-coded change indicators
- Hover effects for interactivity

## Technical Implementation

- Uses Chart.js for data visualization
- Implements modern CSS with glassmorphism effects
- Responsive grid layout for project cards
- Asynchronous data loading with proper error handling
- Modular JavaScript architecture

## Setup

Simply open `dashboard.html` in any modern web browser. All dependencies are loaded via CDN.

## Files

- `dashboard.html`: Main HTML structure
- `styles.css`: Styling and responsive design
- `script.js`: JavaScript functionality and data handling
- `README.md`: This file

## Future Enhancements

- Integration with real cryptocurrency APIs
- WebSocket connections for real-time data updates
- User customization options
- Additional chart types (line, pie, etc.)
- Dark/light theme toggle