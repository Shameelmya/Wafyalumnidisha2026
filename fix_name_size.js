const fs = require('fs');

let page = fs.readFileSync('src/app/ticket/[id]/page.tsx', 'utf8');

page = page.replace(
  /<div style=\{\{\s*fontSize:\s*'1\.4rem',\s*fontWeight:\s*'700',\s*marginBottom:\s*'6px',\s*lineHeight:\s*1\.2\s*\}\}>/g,
  `<div style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '6px', lineHeight: 1.2, padding: '0 24px' }}>`
);

fs.writeFileSync('src/app/ticket/[id]/page.tsx', page);
console.log('Name styling updated');
