const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();
const PORT = 3001;

// Enable CORS for all origins
app.use(cors());

// Root endpoint
app.get('/', (req, res) => {
  res.send('PDF Proxy Server is running');
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
    const apiKey = 'AIzaSyBo7bNwKgmvlw103jp094_DxiSPsLsWcis'; // Your API key
    
    console.log(`Listing files in folder: ${folderId}`);
    
    // Direct API call
    const url = `https://www.googleapis.com/drive/v3/files?q='${folderId}'+in+parents&key=${apiKey}`;
    
    const response = await axios.get(url);
    
    console.log(`Found ${response.data.files?.length || 0} files in folder`);
    
    res.json(response.data);
  } catch (error) {
    console.error('Error listing files:', error.message);
    if (error.response) {
      console.error('API error details:', JSON.stringify(error.response.data));
    }
    res.status(500).json({ error: 'Failed to list files' });
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
    
    console.log(`Fetching PDF with ID: ${fileId}`);
    const apiKey = 'AIzaSyBo7bNwKgmvlw103jp094_DxiSPsLsWcis'; // Your API key
    
    // Use the correct API endpoint
    const url = `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media&key=${apiKey}`;
    
    const response = await axios({
      method: 'GET',
      url: url,
      responseType: 'arraybuffer',
      timeout: 30000
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
    }
    res.status(500).send('Error fetching PDF file');
  }
});

// Listen on all interfaces (0.0.0.0) to be accessible on the network
app.listen(PORT, '0.0.0.0', () => {
  console.log(`PDF Proxy Server running on port ${PORT}`);
  console.log(`Accessible at http://localhost:${PORT}`);
  console.log(`Also accessible at http://192.168.11.183:${PORT}`);
});
