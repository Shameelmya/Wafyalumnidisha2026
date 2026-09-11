const fs = require('fs');

let page = fs.readFileSync('src/app/ticket/[id]/page.tsx', 'utf8');

// Top section padding reduction
page = page.replace(
  /padding: '40px 20px 24px 20px'/g,
  "padding: '30px 20px 16px 20px'"
);

// Increase disha.png size (make its container slightly wider)
page = page.replace(
  /<div style=\{\{ position: 'absolute', top: '20px', right: '20px', width: '65px', height: '65px', filter: 'brightness\(0\) invert\(1\)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent' \}\}>\s*<img src="\/disha\.png"/g,
  `<div style={{ position: 'absolute', top: '16px', right: '20px', width: '80px', height: '80px', filter: 'brightness(0) invert(1)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent' }}>
              <img src="/disha.png"`
);

// Reduce gap under Name and increase text sizes
page = page.replace(
  /<div style=\{\{ width: '120px', height: '120px', borderRadius: '50%', overflow: 'hidden', marginBottom: '16px'/g,
  "<div style={{ width: '120px', height: '120px', borderRadius: '50%', overflow: 'hidden', marginBottom: '10px'"
);

// Name section formatting
page = page.replace(
  /<div style=\{\{ fontSize: '1\.4rem', fontWeight: '700', marginBottom: '8px', lineHeight: 1\.2 \}\}>\s*\{toTitleCase\(registration\.name\)\}\s*<\/div>\s*<div style=\{\{ fontSize: '0\.8rem', fontWeight: '500', opacity: 0\.9, marginBottom: '6px' \}\}>\s*\{registration\.designation\}\s*<\/div>\s*<div style=\{\{ fontSize: '0\.75rem', opacity: 0\.8, lineHeight: 1\.2 \}\}>\s*\{registration\.district\} \| Ph: \{phone\}\s*<\/div>/,
  `<div style={{ fontSize: '1.4rem', fontWeight: '700', marginBottom: '6px', lineHeight: 1.2 }}>
              {toTitleCase(registration.name)}
            </div>
            <div style={{ fontSize: '0.85rem', fontWeight: '500', opacity: 0.9, marginBottom: '2px' }}>
              {registration.designation}
            </div>
            <div style={{ fontSize: '0.8rem', opacity: 0.8, lineHeight: 1.2 }}>
              {registration.district} | Ph: {phone}
            </div>`
);

// Dashed Divider Replacement
page = page.replace(
  /<div style=\{\{ position: 'relative', width: '100%', height: '24px', background: 'white' \}\}>\s*<div style=\{\{ position: 'absolute', top: '11px', left: '10px', right: '10px', borderTop: '2px dashed rgba\(0,0,0,0\.15\)' \}\}><\/div>\s*<div style=\{\{ position: 'absolute', top: '2px', left: '-10px', width: '20px', height: '20px', borderRadius: '50%', background: '#fafafa', zIndex: 2 \}\}><\/div>\s*<div style=\{\{ position: 'absolute', top: '2px', right: '-10px', width: '20px', height: '20px', borderRadius: '50%', background: '#fafafa', zIndex: 2 \}\}><\/div>\s*<\/div>/,
  `<div style={{ position: 'relative', width: '100%', height: '0px', borderTop: '2px dashed rgba(0,0,0,0.15)', zIndex: 10 }}>
            <div style={{ position: 'absolute', top: '-12px', left: '-12px', width: '24px', height: '24px', borderRadius: '50%', background: '#fafafa' }}></div>
            <div style={{ position: 'absolute', top: '-12px', right: '-12px', width: '24px', height: '24px', borderRadius: '50%', background: '#fafafa' }}></div>
          </div>`
);

// Bottom part: reduce padding, bigger QR code, no "Scan for entry", bigger logo
page = page.replace(
  /<div style=\{\{ background: 'white', padding: '16px 20px 24px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center' \}\}>\s*<QRCodeSVG value=\{registration\.regNumber\} size=\{130\} level="M" \/>\s*<div style=\{\{ fontSize: '0\.7rem', color: '#94a3b8', marginTop: '12px' \}\}>Scan for entry<\/div>\s*<div style=\{\{ marginTop: '20px', display: 'flex', justifyContent: 'center' \}\}>\s*<img src="\/logo\.png" alt="Logo" style=\{\{ maxWidth: '160px', height: 'auto', objectFit: 'contain' \}\} \/>\s*<\/div>\s*<\/div>/,
  `<div style={{ background: 'white', padding: '16px 20px 16px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <QRCodeSVG value={registration.regNumber} size={150} level="M" />
            <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'center' }}>
              <img src="/logo.png" alt="Logo" style={{ maxWidth: '210px', height: 'auto', objectFit: 'contain' }} />
            </div>
          </div>`
);

fs.writeFileSync('src/app/ticket/[id]/page.tsx', page);
console.log('Ticket design fixed');
