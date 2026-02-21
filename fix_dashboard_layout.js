const fs = require('fs');
const path = require('path');

const clientDir = path.join(__dirname, 'client');
const adminDir = path.join(__dirname, 'client', 'admin');

function fixLayoutInFile(filePath) {
    if (!fs.existsSync(filePath)) return;
    let content = fs.readFileSync(filePath, 'utf8');
    let changed = false;

    // Fix layout bugs
    if (content.includes('grid-template-columns: 260px 1fr;')) {
        content = content.replace(/display:\s*grid;\s*grid-template-columns:\s*260px\s*1fr;/g, 'display: flex;');
        changed = true;
    }
    
    // Add premium glassmorphism to KPI cards
    if (content.includes('.kpi-card {') && !content.includes('backdrop-filter: blur')) {
        content = content.replace(/\.kpi-card \{([^}]+)\}/g, function(match, p1) {
            return '.kpi-card {' + p1 + '\n            backdrop-filter: blur(20px);\n            -webkit-backdrop-filter: blur(20px);\n            background: var(--bg-card);\n            box-shadow: 0 4px 20px rgba(0,0,0,0.5);\n        }';
        });
        changed = true;
    }

    // Modernize charts grid and tables
    if (content.includes('.table-card {') && !content.includes('backdrop-filter: blur')) {
        content = content.replace(/\.table-card \{([^}]+)\}/g, function(match, p1) {
            return '.table-card {' + p1 + '\n            backdrop-filter: blur(20px);\n            -webkit-backdrop-filter: blur(20px);\n            background: var(--bg-card);\n            box-shadow: 0 4px 20px rgba(0,0,0,0.5);\n        }';
        });
        changed = true;
    }

    if (changed) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log('Fixed layout in ' + filePath);
    }
}

const filesToFix = [
    path.join(clientDir, 'dashboard.html'),
    path.join(clientDir, 'profile.html'),
    path.join(clientDir, 'order-history.html'),
    path.join(adminDir, 'index.html'),
    path.join(adminDir, 'services.html'),
    path.join(adminDir, 'products.html'),
    path.join(adminDir, 'users.html'),
    path.join(adminDir, 'orders.html'),
    path.join(adminDir, 'messages.html')
];

filesToFix.forEach(fixLayoutInFile);
