const fs = require('fs');
let c = fs.readFileSync('src/app/ticket/[id]/page.tsx', 'utf8');

c = c.replace(
  /<\/div>\s*<\/div>\s*<\/div>\s*<div style=\{\{\s*display:\s*'flex',\s*gap:\s*'12px',\s*width:\s*'100%',\s*maxWidth:\s*'340px'\s*\}\}>/,
  `</div>
      </div>

      <div style={{ display: 'flex', gap: '12px', width: '100%', maxWidth: '340px' }}>`
);

fs.writeFileSync('src/app/ticket/[id]/page.tsx', c);
console.log('Syntax fixed!');
