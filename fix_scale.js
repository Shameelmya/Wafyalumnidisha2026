const fs = require('fs');

let page = fs.readFileSync('src/app/ticket/[id]/page.tsx', 'utf8');

// Replace scale: 4 with scale: 8 for ultra high quality
page = page.replace(/scale: 4/g, 'scale: 8, useCORS: true, allowTaint: true, logging: false');

fs.writeFileSync('src/app/ticket/[id]/page.tsx', page);
console.log('Scale increased to 8');
