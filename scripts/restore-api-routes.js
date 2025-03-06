const fs = require('fs');
const path = require('path');

const apiDir = path.join(__dirname, '../app/api');
const appDir = path.join(__dirname, '../app');
const backupDir = path.join(__dirname, '../.api-backups');
const pagesBackupDir = path.join(__dirname, '../.pages-backups');

function restoreApiRoutes() {
  // Restore API routes
  if (fs.existsSync(backupDir)) {
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
      console.log(`Restored API route: ${relativePath}`);
    });
    
    console.log('All API routes restored successfully.');
  } else {
    console.log('No API backups found. Nothing to restore.');
  }

  // Restore pages
  if (fs.existsSync(pagesBackupDir)) {
    const pageBackupFiles = [];
    
    function findPageBackupFiles(dir) {
      const files = fs.readdirSync(dir);
      
      files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        
        if (stat.isDirectory()) {
          findPageBackupFiles(filePath);
        } else {
          pageBackupFiles.push(filePath);
        }
      });
    }
    
    findPageBackupFiles(pagesBackupDir);
    
    pageBackupFiles.forEach(backupFile => {
      const relativePath = path.relative(pagesBackupDir, backupFile);
      const originalFile = path.join(appDir, relativePath);
      
      // Create directory structure if it doesn't exist
      const originalDir = path.dirname(originalFile);
      if (!fs.existsSync(originalDir)) {
        fs.mkdirSync(originalDir, { recursive: true });
      }
      
      // Copy the file back
      fs.copyFileSync(backupFile, originalFile);
      console.log(`Restored page: ${relativePath}`);
    });
    
    console.log('All pages restored successfully.');
  } else {
    console.log('No page backups found. Nothing to restore.');
  }
}

restoreApiRoutes();
