const fs = require('fs');
let c = fs.readFileSync('src/app/register/page.tsx', 'utf8');

c = c.replace(
  /<div style=\{\{\s*textAlign:\s*'center',\s*marginBottom:\s*'40px',\s*paddingBottom:\s*'32px',\s*borderBottom:\s*'1px solid #f1f5f9'\s*\}\}>/,
  "<div style={{ textAlign: 'center', marginBottom: '16px' }}>"
);

c = c.replace(
  /<div style=\{\{\s*display:\s*'inline-block',\s*background:\s*'#f8fafc',\s*padding:\s*'8px 16px',\s*borderRadius:\s*'8px',\s*fontSize:\s*'0\.85rem',\s*fontWeight:\s*'600',\s*color:\s*'#475569',\s*border:\s*'1px solid #e2e8f0'\s*\}\}>/,
  "<div style={{ display: 'inline-block', fontSize: '0.85rem', fontWeight: '600', color: '#475569' }}>"
);

fs.writeFileSync('src/app/register/page.tsx', c);
console.log('Date fixed!');
