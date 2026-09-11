const fs = require('fs');
let f = fs.readFileSync('src/app/ticket/[id]/page.tsx', 'utf8');

// The original lines in the file currently look like:
/*
            <div style={{ fontSize: '0.8rem', fontWeight: '500', opacity: 0.9, marginBottom: '6px' }}>
              {registration.designation} | {registration.district}
            </div>
            <div style={{ fontSize: '0.75rem', opacity: 0.8, lineHeight: 1.2 }}>
              Ph: {phone}
            </div>
*/

f = f.replace(
  /<div style=\{\{\s*fontSize:\s*'0\.8rem',\s*fontWeight:\s*'500',\s*opacity:\s*0\.9,\s*marginBottom:\s*'6px'\s*\}\}>\s*\{registration\.designation\}\s*\|\s*\{registration\.district\}\s*<\/div>\s*<div style=\{\{\s*fontSize:\s*'0\.75rem',\s*opacity:\s*0\.8,\s*lineHeight:\s*1\.2\s*\}\}>\s*Ph:\s*\{phone\}\s*<\/div>/,
  `<div style={{ fontSize: '0.8rem', fontWeight: '500', opacity: 0.9, marginBottom: '6px' }}>
              {registration.designation}
            </div>
            <div style={{ fontSize: '0.75rem', opacity: 0.8, lineHeight: 1.2 }}>
              {registration.district} | Ph: {phone}
            </div>`
);

fs.writeFileSync('src/app/ticket/[id]/page.tsx', f);
console.log('Fixed district and phone.');
