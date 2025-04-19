const PROXY_URL = 'https://pioneer-journal-api.onrender.com';

const FOLDER_IDS = {
  stem: '19qKKLreTu33c_F5Ki1W88Feva5xC9A8K',
  humss: '11NDp8gvU80WMvCVk4EAPoR1sfBSGF8Hk', 
  abm: '1Wj0zruExXRT6F4kQ5v3qNZqkqzBjpqdI',
  ict: '1Ejvj6OJqXp-7yHARsbQOpl9ix2hppLLH', 
  he: '1FQyluDOyB5Wu2lRFDmjchXAyIcGjvK3h',
  afa: '14EyOaAQ2c-G4C942sbk8gnXtxlO4ViCG'
};

// Add near the top of your driveService.jsx file
const BASE_URL = window.location.hostname === 'localhost' 
  ? '/' 
  : '/pioneer-journal/';

// Cached metadata to avoid repeated fetches
let papersMetadata = null;

// User-friendly message state
let userMessage = '';

// Get metadata for all papers
export async function getMetadata() {
  // Define the source based on environment
  const isLocal = window.location.hostname === 'localhost';
  const metadataUrl = isLocal
    ? `/metadata.json?ts=${Date.now()}`
    : `${PROXY_URL}/metadata?ts=${Date.now()}`;

  try {
    const response = await fetch(metadataUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch metadata: ${response.status}`);
    }
    papersMetadata = await response.json();
    return papersMetadata;
  } catch (error) {
    console.error('Error fetching metadata:', error);
    userMessage = 'Unable to load metadata. Please try again later.';
    return {};
  }
}

// List papers from a specific strand folder
export async function listPapers(strand) {
  try {
    // Get the correct folder ID (case-insensitive)
    const lowerStrand = strand.toLowerCase();
    const folderId = FOLDER_IDS[lowerStrand];
    
    if (!folderId) {
      console.error(`No folder ID configured for strand: ${strand}`);
      userMessage = 'No research papers found for the selected strand.';
      return [];
    }
    
    console.log(`Fetching papers for ${lowerStrand} from folder ${folderId}`);
    
    // Make the API request through our proxy
    const response = await fetch(`${PROXY_URL}/list/${folderId}`);
    
    if (!response.ok) {
      console.error(`API returned status ${response.status}`);
      userMessage = 'Error fetching research papers. Please try again later.';
      return [];
    }
    
    const data = await response.json();
    console.log("Full API response:", data);
    
    // Check for valid response 
    if (!data.files || !Array.isArray(data.files)) {
      console.error("Invalid response format - no files array");
      userMessage = 'No research papers found for the selected strand.';
      return [];
    }
    
    // Filter for PDFs only
    const pdfFiles = data.files.filter(file => 
      file.name && (
        file.name.toLowerCase().endsWith('.pdf') ||
        (file.mimeType && file.mimeType.includes('pdf'))
      )
    );
    
    console.log(`Found ${pdfFiles.length} PDF files out of ${data.files.length} total files`);
    
    if (pdfFiles.length === 0) {
      userMessage = 'No PDF research papers found for the selected strand.';
    } else {
      userMessage = ''; // Clear message if PDFs are found
    }
    
    return pdfFiles;
  } catch (error) {
    console.error('Error fetching papers:', error);
    userMessage = 'Unable to load research papers. Please try again later.';
    return [];
  }
}

// Get PDF URL through proxy
export function getProxiedPdfUrl(fileId) {
  return `${PROXY_URL}/pdf/${fileId}`;
}

// Get sample PDF URL
export function getSamplePdfUrl() {
  return `${PROXY_URL}/sample-pdf`;
}

// Fallback to Google's viewer - this is what works reliably
export function getGoogleViewerUrl(fileId) {
  return `https://drive.google.com/file/d/${fileId}/preview`;
}

// Function to get the current user message
export function getUserMessage() {
  return userMessage;
}
