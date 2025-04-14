const express = require('express');
const cors = require('cors');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const http = require('http');
const app = express();
const PORT = process.env.PORT || 3001;

// Enable CORS with specific origins
app.use(cors({
  origin: ['http://localhost:3000', 'http://192.168.11.183:3000', 'https://pioneer-journal.netlify.app'],
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS']
}));

// Root endpoint
app.get('/', (req, res) => {
  res.send('PDF Proxy Server is running');
});

// Keep the service alive - prevents Render free tier from sleeping
setInterval(() => {
  http.get(`http://localhost:${PORT}/ping`);
  console.log("Ping sent to keep service alive: " + new Date().toISOString());
}, 840000); // Ping every 14 minutes (Render free tier sleeps after 15 minutes of inactivity)

// Ping endpoint for keep-alive
app.get('/ping', (req, res) => {
  res.status(200).send('pong');
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', time: new Date().toISOString() });
});

// NEW: Metadata endpoint with improved error handling
app.get('/metadata', (req, res) => {
  try {
    const metadataPath = process.env.METADATA_PATH || path.join(__dirname, 'metadata.json');
    
    // Check if the file exists
    if (fs.existsSync(metadataPath)) {
      const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
      console.log('Metadata loaded successfully');
      res.json(metadata);
    } else {
      // Return empty object if file doesn't exist
      console.error('metadata.json file not found at path:', metadataPath);
      res.status(404).json({ error: 'Metadata file not found', details: 'The metadata.json file could not be located' });
    }
  } catch (error) {
    console.error('Error reading metadata:', error);
    res.status(500).json({ error: 'Failed to read metadata', details: error.message });
  }
});

// Sample PDF endpoint with improved error handling
app.get('/sample-pdf', async (req, res) => {
  try {
    console.log('Fetching sample PDF...');
    const response = await axios({
      method: 'GET',
      url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      responseType: 'arraybuffer',
      timeout: 10000 // 10 second timeout
    });
    
    console.log('Sample PDF fetched successfully');
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Length': response.data.length
    });
    
    res.send(response.data);
  } catch (error) {
    console.error('Error fetching sample PDF:', error.message);
    if (error.response) {
      console.error('API error details:', JSON.stringify(error.response.status));
    }
    res.status(500).json({ error: 'Error fetching sample PDF', details: error.message });
  }
});

// List files in Google Drive folder with improved error handling
app.get('/list/:folderId', async (req, res) => {
  try {
    const { folderId } = req.params;
    const apiKey = process.env.GOOGLE_API_KEY || 'AIzaSyBo7bNwKgmvlw103jp094_DxiSPsLsWcis';
    
    if (!apiKey) {
      console.error('Google API key is missing');
      return res.status(500).json({ error: 'Server configuration error', details: 'API key is missing' });
    }
    
    console.log(`Listing files in folder: ${folderId}`);
    
    // Direct API call WITH REFERER HEADER - this is the critical fix
    const url = `https://www.googleapis.com/drive/v3/files?q='${folderId}'+in+parents&key=${apiKey}`;
    
    const response = await axios.get(url, {
      headers: {
        'Referer': 'https://pioneer-journal.netlify.app/'
      },
      timeout: 15000 // 15 second timeout
    });
    
    console.log(`Found ${response.data.files?.length || 0} files in folder`);
    
    res.json(response.data);
  } catch (error) {
    console.error('Error listing files:', error.message);
    if (error.response) {
      console.error('API error details:', JSON.stringify(error.response.data));
      return res.status(error.response.status).json({ 
        error: 'Google Drive API failed', 
        details: error.message,
        response: error.response.data
      });
    }
    res.status(500).json({ error: 'Failed to list files', details: error.message });
  }
});

// Get PDF from Google Drive with improved error handling
app.get('/pdf/:fileId', async (req, res) => {
  try {
    const { fileId } = req.params;
    
    // Handle sample PDF separately
    if (fileId === 'sample') {
      return res.redirect('/sample-pdf');
    }
    
    console.log(`Fetching PDF with ID: ${fileId}`);
    const apiKey = process.env.GOOGLE_API_KEY || 'AIzaSyBo7bNwKgmvlw103jp094_DxiSPsLsWcis';
    
    if (!apiKey) {
      console.error('Google API key is missing');
      return res.status(500).json({ error: 'Server configuration error', details: 'API key is missing' });
    }
    
    // Use the correct API endpoint WITH REFERER HEADER - this is the critical fix
    const url = `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media&key=${apiKey}`;
    
    const response = await axios({
      method: 'GET',
      url: url,
      responseType: 'arraybuffer',
      timeout: 30000,
      headers: {
        'Referer': 'https://pioneer-journal.netlify.app/'
      }
    });
    
    console.log(`PDF fetched successfully: ${response.data.length} bytes`);
    
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Length': response.data.length,
      'Cache-Control': 'public, max-age=86400' // 24 hour caching
    });
    
    res.send(response.data);
  } catch (error) {
    console.error('Error fetching PDF:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      return res.status(error.response.status).json({ 
        error: 'Failed to fetch PDF from Google Drive', 
        details: error.message,
        status: error.response.status
      });
    }
    res.status(500).json({ error: 'Error fetching PDF file', details: error.message });
  }
});

// Listen on all interfaces (0.0.0.0) to be accessible on the network
app.listen(PORT, '0.0.0.0', () => {
  console.log(`PDF Proxy Server running on port ${PORT}`);
  console.log(`Accessible at http://localhost:${PORT}`);
  console.log(`Also accessible at http://192.168.11.183:${PORT}`);
  console.log('Server started at:', new Date().toISOString());
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message
  });
});
