const fs = require('fs');
const path = require('path');

const apiDir = path.join(__dirname, '../app/api');

// List of API routes to keep enabled
const enabledRoutes = [
  'create-payment-intent',
  'verify-payment',
  'validate-coupon'
];

function disableApiRoutes(dir) {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      // Check if this directory should be skipped
      const dirName = path.basename(filePath);
      if (enabledRoutes.includes(dirName)) {
        console.log(`Keeping API route enabled: ${dirName}`);
        return;
      }
      disableApiRoutes(filePath);
    } else if (file.endsWith('.ts') || file.endsWith('.js')) {
      // Check if parent directory should be skipped
      const parentDir = path.basename(path.dirname(filePath));
      if (enabledRoutes.includes(parentDir)) {
        return;
      }
      fs.writeFileSync(filePath, 'module.exports = (req, res) => res.status(503).send("Service Unavailable");');
    }
  });
}

disableApiRoutes(apiDir); 