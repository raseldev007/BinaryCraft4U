const fs = require('fs');
const path = require('path');

const clientDir = path.join(__dirname, 'client');

function replaceLogoInFile(filePath) {
    if (!filePath.endsWith('.html')) return;
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Determine the relative path to the images directory
    const isInAdmin = filePath.includes('/admin/');
    const imgPrefix = isInAdmin ? '../images/' : 'images/';
    const rootPrefix = isInAdmin ? '../' : '';

    const newNavLogo = `<a href="${rootPrefix}index.html" class="nav-logo"><img src="${imgPrefix}logo.png" alt="Binary Craft Logo" style="height: 40px; margin-right: 12px;" /></a>`;
    const newSidebarLogo = `<a href="index.html" class="sidebar-logo"><img src="${imgPrefix}logo.png" alt="Binary Craft Logo" style="height: 36px; margin-right: 12px;" /><div><div style="font-weight:800;font-size:15px;color:var(--text-white)">Binary Craft</div><span class="admin-badge">ADMIN</span></div></a>`;
    const newDashSidebarLogo = `<a href="index.html" class="sidebar-logo"><img src="${imgPrefix}logo.png" alt="Binary Craft Logo" style="height: 36px; margin-right: 12px;" /><div class="nav-logo-text"><span style="font-weight:800;font-size:16px;display:block">Binary Craft</span><span style="font-size:11px;color:var(--primary)">User Panel</span></div></a>`;
    const newAuthLogo = `<a href="index.html" class="auth-logo" style="background:transparent; padding:0; height:auto; width:auto; margin-bottom:16px;"><img src="${imgPrefix}logo.png" alt="Binary Craft Logo" style="height: 60px;" /></a>`;

    let modified = false;

    // Replace Navbar logo robustly
    const navLogoRegex = /<a href="(?:\.\.\/)?index\.html" class="nav-logo">[\s\S]*?<\/a>/g;
    content = content.replace(navLogoRegex, newNavLogo);

    // Replace Sidebar logos robustly
    const sidebarRegex = /<a href="index\.html" class="sidebar-logo">[\s\S]*?<div style="font-weight:800;font-size:15px;color:var\(--text-white\)">Binary Craft<\/div>[\s\S]*?<\/a>/g;
    const sidebarRegexAlt = /<a href="index\.html" class="sidebar-logo">[\s\S]*?<span style="font-weight:800;font-size:16px;display:block">Binary Craft<\/span>[\s\S]*?<\/a>/g;
    
    content = content.replace(sidebarRegex, newSidebarLogo);
    content = content.replace(sidebarRegexAlt, newDashSidebarLogo);
    
    // Replace Auth logo
    const authRegex = /<a href="index\.html" class="auth-logo">[\s\S]*?<\/a>/g;
    content = content.replace(authRegex, newAuthLogo);

    fs.writeFileSync(filePath, content, 'utf8');
}

function walkDir(dir) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        if (isDirectory) {
            walkDir(dirPath);
        } else {
            replaceLogoInFile(dirPath);
        }
    });
}

walkDir(clientDir);
console.log('Logo robust update complete.');
