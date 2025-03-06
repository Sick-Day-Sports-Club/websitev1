
const fs = require('fs');
const path = require('path');

const apiDir = path.join(__dirname, '../app/api');
const backupDir = path.join(__dirname, '../.api-backups');

function restoreApiRoutes(dir) {
  if (!fs.existsSync(backupDir)) {
    console.log('No backups found. Nothing to restore.');
    return;
  }

  const backupFiles = [];
  
  function findBackupFiles(dir) {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        findBackupFiles(filePath);
      } else {
        backupFiles.push(filePath);
      }
    });
  }
  
  findBackupFiles(backupDir);
  
  backupFiles.forEach(backupFile => {
    const relativePath = path.relative(backupDir, backupFile);
    const originalFile = path.join(apiDir, relativePath);
    
    // Create directory structure if it doesn't exist
    const originalDir = path.dirname(originalFile);
    if (!fs.existsSync(originalDir)) {
      fs.mkdirSync(originalDir, { recursive: true });
    }
    
    // Copy the file back
    fs.copyFileSync(backupFile, originalFile);
    console.log(`Restored: ${relativePath}`);
  });
  
  console.log('All API routes restored successfully.');
}

restoreApiRoutes();
