const fs = require('fs');

let page = fs.readFileSync('src/app/register/page.tsx', 'utf8');

// Replace Day 1 hardcoded layout
page = page.replace(
  /<div style=\{\{\s*textAlign:\s*'center',\s*margin:\s*'32px 0 24px 0'\s*\}\}>\s*<h3 style=\{\{\s*display:\s*'inline-block',\s*background:\s*'var\(--primary\)',\s*color:\s*'white',\s*padding:\s*'6px 20px',\s*borderRadius:\s*'20px',\s*fontSize:\s*'1\.1rem',\s*margin:\s*'0'\s*\}\}>Day 1<\/h3>\s*<div style=\{\{\s*fontSize:\s*'0\.8rem',\s*fontWeight:\s*'300',\s*color:\s*'#64748b',\s*marginTop:\s*'4px'\s*\}\}>12 Sep 2026<\/div>\s*<\/div>/g,
  `<div style={{ background: 'var(--primary)', color: 'white', padding: '12px 24px', borderRadius: '12px', margin: '32px 0 24px 0', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
    <span style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>Day 1</span>
    <span style={{ fontWeight: '300', fontSize: '0.95rem', opacity: 0.9 }}>- 12 Sep 2026</span>
  </div>`
);

// Replace Day 2 hardcoded layout
page = page.replace(
  /<div style=\{\{\s*textAlign:\s*'center',\s*margin:\s*'32px 0 24px 0'\s*\}\}>\s*<h3 style=\{\{\s*display:\s*'inline-block',\s*background:\s*'var\(--primary\)',\s*color:\s*'white',\s*padding:\s*'6px 20px',\s*borderRadius:\s*'20px',\s*fontSize:\s*'1\.1rem',\s*margin:\s*'0'\s*\}\}>Day 2<\/h3>\s*<div style=\{\{\s*fontSize:\s*'0\.8rem',\s*fontWeight:\s*'300',\s*color:\s*'#64748b',\s*marginTop:\s*'4px'\s*\}\}>13 Sep 2026<\/div>\s*<\/div>/g,
  `<div style={{ background: 'var(--primary)', color: 'white', padding: '12px 24px', borderRadius: '12px', margin: '32px 0 24px 0', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
    <span style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>Day 2</span>
    <span style={{ fontWeight: '300', fontSize: '0.95rem', opacity: 0.9 }}>- 13 Sep 2026</span>
  </div>`
);

fs.writeFileSync('src/app/register/page.tsx', page);
console.log('Fixed hardcoded Day headings');
