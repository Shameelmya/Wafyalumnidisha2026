const fs = require('fs');
let c = fs.readFileSync('src/app/register/page.tsx', 'utf8');

c = c.replace(
  /<div style=\{\{\s*display:\s*'inline-block',\s*fontSize:\s*'0\.85rem',\s*fontWeight:\s*'600',\s*color:\s*'#475569'\s*\}\}>\s*12 & 13 September 2026 <br\/> Neebar Gate Natural Resort, Kakkadampoyil\s*<\/div>\s*<\/div>/,
  `<div style={{ display: 'inline-block', fontSize: '0.85rem', fontWeight: '600', color: '#475569' }}>
                  12 & 13 September 2026 <br/> Neebar Gate Natural Resort, Kakkadampoyil
                </div>
                <div style={{ marginTop: '24px', borderBottom: '1px solid #e2e8f0', width: '50%', margin: '24px auto 0' }}></div>
              </div>`
);

fs.writeFileSync('src/app/register/page.tsx', c);
console.log('Horizontal line added!');
