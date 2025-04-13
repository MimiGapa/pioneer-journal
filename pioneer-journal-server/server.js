const express = require('express');
const cors = require('cors');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3001;

// Google API Key - use environment variable or fallback to hardcoded key
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY || 'AIzaSyBo7bNwKgmvlw103jp094_DxiSPsLsWcis';

// Get metadata file path - handle both local and Render.com paths
const getMetadataPath = () => {
  // Check if running on Render
  if (process.env.RENDER) {
    return path.join(__dirname, 'metadata.json');
  }
  // Local development
  return path.join(__dirname, 'metadata.json');
};

// Enable CORS with specific origins
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://192.168.11.183:3000', 
    'https://pioneer-journal.netlify.app'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS']
}));

// Root endpoint
app.get('/', (req, res) => {
  res.send('PDF Proxy Server is running');
});

// Metadata endpoint
app.get('/metadata', (req, res) => {
  try {
    const metadataPath = getMetadataPath();
    
    // Check if the file exists
    if (fs.existsSync(metadataPath)) {
      const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
      res.json(metadata);
    } else {
      // Return empty object if file doesn't exist
      console.error('metadata.json file not found at path:', metadataPath);
      res.json({});
    }
  } catch (error) {
    console.error('Error reading metadata:', error);
    res.status(500).json({ error: 'Failed to read metadata' });
  }
});

// Sample PDF endpoint
app.get('/sample-pdf', async (req, res) => {
  try {
    console.log('Fetching sample PDF...');
    const response = await axios({
      method: 'GET',
      url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      responseType: 'arraybuffer'
    });
    
    console.log('Sample PDF fetched successfully');
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Length': response.data.length
    });
    
    res.send(response.data);
  } catch (error) {
    console.error('Error fetching sample PDF:', error.message);
    res.status(500).send('Error fetching sample PDF');
  }
});

// List files in Google Drive folder
app.get('/list/:folderId', async (req, res) => {
  try {
    const { folderId } = req.params;
    
    if (!GOOGLE_API_KEY) {
      console.error('Google API key is missing');
      return res.status(500).json({ error: 'Server configuration error' });
    }
    
    console.log(`Listing files in folder: ${folderId}`);
    
    // Direct API call WITH REFERER HEADER - this is the critical fix
    const url = `https://www.googleapis.com/drive/v3/files?q='${folderId}'+in+parents&key=${GOOGLE_API_KEY}`;
    
    const response = await axios.get(url, {
      headers: {
        'Referer': 'https://pioneer-journal.netlify.app/'
      }
    });
    
    console.log(`Found ${response.data.files?.length || 0} files in folder`);
    
    res.json(response.data);
  } catch (error) {
    console.error('Error listing files:', error.message);
    
    // More detailed error logging
    if (error.response) {
      console.error('API error details:', error.response.status, JSON.stringify(error.response.data));
      return res.status(error.response.status).json({ error: error.response.data });
    } else if (error.request) {
      console.error('No response received from API');
      return res.status(500).json({ error: 'No response received from Google Drive API' });
    }
    
    res.status(500).json({ error: 'Failed to list files', details: error.message });
  }
});

// Get PDF from Google Drive
app.get('/pdf/:fileId', async (req, res) => {
  try {
    const { fileId } = req.params;
    
    // Handle sample PDF separately
    if (fileId === 'sample') {
      return res.redirect('/sample-pdf');
    }
    
    if (!GOOGLE_API_KEY) {
      console.error('Google API key is missing');
      return res.status(500).json({ error: 'Server configuration error' });
    }
    
    console.log(`Fetching PDF with ID: ${fileId}`);
    
    // Use the correct API endpoint WITH REFERER HEADER - this is the critical fix
    const url = `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media&key=${GOOGLE_API_KEY}`;
    
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
      'Content-Length': response.data.length
    });
    
    res.send(response.data);
  } catch (error) {
    console.error('Error fetching PDF:', error.message);
    
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Details:', error.response.data);
    }
    
    res.status(500).send('Error fetching PDF file');
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`PDF Proxy Server running on port ${PORT}`);
  console.log(`Server environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app; // Export for testing purposes
