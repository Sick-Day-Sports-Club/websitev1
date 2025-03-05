const fs = require('fs');
const path = require('path');

const apiDir = path.join(__dirname, '../app/api');

function disableApiRoutes(dir) {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      disableApiRoutes(filePath);
    } else if (file.endsWith('.ts') || file.endsWith('.js')) {
      fs.writeFileSync(filePath, 'module.exports = (req, res) => res.status(503).send("Service Unavailable");');
    }
  });
}

disableApiRoutes(apiDir); 