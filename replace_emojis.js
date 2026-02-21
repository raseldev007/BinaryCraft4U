const fs = require('fs');
const path = require('path');

const clientDir = path.join(__dirname, 'client');
const adminDir = path.join(__dirname, 'client', 'admin');
const jsDir = path.join(__dirname, 'client', 'js');

const emojiMap = {
    '🚀': '<i class="fas fa-rocket"></i>',
    '💻': '<i class="fas fa-laptop-code"></i>',
    '🌐': '<i class="fas fa-globe"></i>',
    '📱': '<i class="fas fa-mobile-alt"></i>',
    '☁️': '<i class="fas fa-cloud"></i>',
    '🔒': '<i class="fas fa-lock"></i>',
    '🤖': '<i class="fas fa-robot"></i>',
    '📊': '<i class="fas fa-chart-bar"></i>',
    '📦': '<i class="fas fa-box"></i>',
    '⚡': '<i class="fas fa-bolt"></i>',
    '🏆': '<i class="fas fa-trophy"></i>',
    '��': '<i class="fas fa-comments"></i>',
    '💡': '<i class="fas fa-lightbulb"></i>',
    '💰': '<i class="fas fa-wallet"></i>',
    '🛡️': '<i class="fas fa-shield-alt"></i>',
    '🎨': '<i class="fas fa-palette"></i>',
    '🔑': '<i class="fas fa-key"></i>',
    '🛠️': '<i class="fas fa-tools"></i>',
    '🎯': '<i class="fas fa-bullseye"></i>',
    '🖼️': '<i class="fas fa-image"></i>',
    '🛒': '<i class="fas fa-shopping-cart"></i>'
};

function replaceEmojisInFile(filePath) {
    if (!fs.existsSync(filePath)) return;
    let content = fs.readFileSync(filePath, 'utf8');
    let changed = false;

    // Remove emojis in about page tech badges specifically 
    if (filePath.includes('about.html')) {
        content = content.replace(/📱 React Native/g, '<i class="fas fa-mobile-alt"></i> React Native');
        content = content.replace(/☁️ AWS/g, '<i class="fab fa-aws"></i> AWS');
        content = content.replace(/🤖 Python \/ AI/g, '<i class="fas fa-robot"></i> Python / AI');
        content = content.replace(/🌐 Next\.js/g, '<i class="fas fa-globe"></i> Next.js');
        content = content.replace(/🔒 JWT \/ OAuth/g, '<i class="fas fa-lock"></i> JWT / OAuth');
        content = content.replace(/🚀 Vercel/g, '<i class="fas fa-rocket"></i> Vercel');
        changed = true;
    }

    if (filePath.includes('auth.js')) {
        content = content.replace(/📊 Dashboard/g, '<i class="fas fa-chart-bar"></i> Dashboard');
        content = content.replace(/📦 My Orders/g, '<i class="fas fa-box"></i> My Orders');
        changed = true;
    }

    if (filePath.includes('blog.html')) {
         content = content.replace(/>🚀</g, '><i class="fas fa-rocket" style="color:#fff"></i><');
         content = content.replace(/>🤖</g, '><i class="fas fa-robot" style="color:#fff"></i><');
         changed = true;
    }

    if (filePath.includes('index.html') && filePath.includes('admin')) {
        content = content.replace(/>📦</g, '><i class="fas fa-box"></i><');
        content = content.replace(/>💰</g, '><i class="fas fa-wallet"></i><');
        changed = true;
    }
    
    if (filePath.includes('dashboard.html')) {
        content = content.replace(/>📦</g, '><i class="fas fa-box"></i><');
        changed = true;
    }

    if (filePath.includes('contact.html')) {
        content = content.replace(/Send a Message 💬/g, 'Send a Message <i class="fas fa-paper-plane" style="margin-left:8px;"></i>');
        changed = true;
    }

    if (filePath.includes('profile.html')) {
        content = content.replace(/🔒 Change Password/g, '<i class="fas fa-lock"></i> Change Password');
        changed = true;
    }

    if (filePath.includes('orders.html')) {
        content = content.replace(/📦 Orders Management/g, '<i class="fas fa-box"></i> Orders Management');
        changed = true;
    }

    if (filePath.includes('products.html') && filePath.includes('admin')) {
        content = content.replace(/📦 Manage Products/g, '<i class="fas fa-box"></i> Manage Products');
        content = content.replace(/placeholder="📦"/g, 'placeholder="&#xf466;" class="form-input fas"');
        content = content.replace(/'📦'/g, '\'<i class="fas fa-box"></i>\'');
        changed = true;
    }

     if (filePath.includes('services.html') && filePath.includes('admin')) {
        content = content.replace(/placeholder="🌐"/g, 'placeholder="&#xf0ac;" class="form-input fas"');
        content = content.replace(/'🌐'/g, '\'<i class="fas fa-globe"></i>\'');
        changed = true;
    }

    if (filePath.includes('order-history.html')) {
        content = content.replace(/📦 Order History/g, '<i class="fas fa-box"></i> Order History');
        changed = true;
    }

    if (filePath.includes('product-detail.html')) {
        content = content.replace(/'📦'/g, '\'<i class="fas fa-box"></i>\'');
        content = content.replace(/"📦"/g, '"<i class=\'fas fa-box\'></i>"');
        changed = true;
    }

    if (filePath.includes('service-detail.html')) {
         content = content.replace(/'🌐'/g, '\'<i class="fas fa-globe"></i>\'');
         content = content.replace(/"🌐"/g, '"<i class=\'fas fa-globe\'></i>"');
         changed = true;
    }

    if (changed) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log('Updated ' + filePath);
    }
}

const files = [
    path.join(clientDir, 'about.html'),
    path.join(clientDir, 'contact.html'),
    path.join(clientDir, 'blog.html'),
    path.join(clientDir, 'dashboard.html'),
    path.join(clientDir, 'profile.html'),
    path.join(clientDir, 'order-history.html'),
    path.join(clientDir, 'product-detail.html'),
    path.join(clientDir, 'service-detail.html'),
    path.join(jsDir, 'auth.js'),
    path.join(adminDir, 'index.html'),
    path.join(adminDir, 'services.html'),
    path.join(adminDir, 'products.html'),
    path.join(adminDir, 'orders.html')
];

files.forEach(replaceEmojisInFile);
