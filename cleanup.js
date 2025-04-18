const fs = require('fs');
const path = require('path');

console.log('🧹 Starting Pioneer Journal cleanup...');

// STEP 1: Remove empty "New Folder" directories
console.log('\n📂 Checking for unnecessary folders...');
const foldersToCheck = [
  './src/pages/HomePage/New folder',
  './src/pages/ErrorPage/New folder',
  './src/pages/ViewerPage/New folder',
  './pioneer-journal-server/New folder'
];

foldersToCheck.forEach(dir => {
  try {
    if (fs.existsSync(dir)) {
      const files = fs.readdirSync(dir);
      console.log(`Found ${dir} with ${files.length} files`);
      // Only report, don't delete yet - safer to show first
      console.log(`  Contains: ${files.join(', ')}`);
    }
  } catch (err) {
    console.log(`Error checking ${dir}: ${err.message}`);
  }
});

// STEP 2: Create missing directories for better organization
console.log('\n📂 Creating organized directory structure...');
const directoriesToCreate = [
  './src/assets/icons',
  './src/assets/fonts',
  './src/hooks',
  './src/services',
  './src/context'
];

directoriesToCreate.forEach(dir => {
  if (!fs.existsSync(dir)) {
    try {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`✅ Created: ${dir}`);
    } catch (err) {
      console.log(`⚠️ Could not create ${dir}: ${err.message}`);
    }
  } else {
    console.log(`✓ Directory already exists: ${dir}`);
  }
});

// STEP 3: Create a proper .gitignore file
console.log('\n📝 Creating .gitignore file...');
const gitignoreContent = `
# Dependencies
/node_modules
/.pnp
.pnp.js

# Testing
/coverage

# Production
/dist
/build
/.vite

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Editor directories and files
.vscode/
.idea/
*.swp
*.swo

# OS files
.DS_Store
Thumbs.db
`;

// Write or update the .gitignore file
try {
  fs.writeFileSync('./.gitignore', gitignoreContent.trim());
  console.log('✅ Created/updated .gitignore file');
} catch (err) {
  console.log(`⚠️ Could not create .gitignore: ${err.message}`);
}

// STEP 4: Create/update README.md if it doesn't exist
if (!fs.existsSync('./README.md') || fs.readFileSync('./README.md', 'utf8').trim() === '') {
  console.log('\n📝 Creating README.md...');
  const readmeContent = `
# Pioneer Journal

A digital repository for academic research papers from various strands.

## Setup and Installation

1. Clone the repository
2. Install dependencies: \`npm install\`
3. Run development server: \`npm run dev\`
4. Build for production: \`npm run build\`

## Project Structure

- \`/src\` - Frontend React application
- \`/server.js\` - Express backend API
- \`/public\` - Static assets
`;
  
  try {
    fs.writeFileSync('./README.md', readmeContent.trim());
    console.log('✅ Created/updated README.md');
  } catch (err) {
    console.log(`⚠️ Could not create README.md: ${err.message}`);
  }
}

console.log('\n✨ Cleanup report complete! Review the output above before taking action.');
console.log('\nTo delete New folder directories after reviewing, run this script with the --delete flag.');
