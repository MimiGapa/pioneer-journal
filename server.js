// server.js (create this at the root of your project)
require('./pioneer-journal-server/server');
// Add this to the root server.js file to handle the metadata file location
process.env.METADATA_PATH = './pioneer-journal-server/metadata.json';
