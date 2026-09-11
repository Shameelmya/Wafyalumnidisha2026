const fs = require('fs');

// 1. Layout font
let layout = fs.readFileSync('src/app/layout.tsx', 'utf8');
if (!layout.includes('fonts.googleapis.com')) {
  layout = layout.replace(
    /<\/head>/,
    `  <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Noto+Serif+Malayalam:wght@100..900&display=swap" rel="stylesheet" />
      </head>`
  );
  fs.writeFileSync('src/app/layout.tsx', layout);
}

// 2. CSS global font
let css = fs.readFileSync('src/app/globals.css', 'utf8');
css = css.replace(/font-family:[^;]+;/, 'font-family: "Noto Serif Malayalam", "Inter", sans-serif;');
fs.writeFileSync('src/app/globals.css', css);

// 3. Register Page UI fixes
let regPage = fs.readFileSync('src/app/register/page.tsx', 'utf8');
// a) Remove "Orientation, Vision Building & Programme Design Camp"
regPage = regPage.replace(/<span[^>]*>Orientation, Vision Building & Programme Design Camp<\/span>/, '');
// b) Fix date / venue layout: reduce size, plane background, reduce gap
regPage = regPage.replace(
  /<div style={{ background: 'var\(--secondary\)', padding: '16px', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center', textAlign: 'center', marginBottom: '24px' }}>\s*<div style={{ fontWeight: '700', fontSize: '1\.1rem', color: 'var\(--primary\)' }}>\s*12 & 13 September 2026 <br\/> Neebar Gate Natural Resort, Kakkadampoyil\s*<\/div>\s*<\/div>/,
  `<div style={{ textAlign: 'center', marginBottom: '8px' }}>
    <div style={{ fontWeight: '500', fontSize: '0.85rem', color: '#64748b' }}>
      12 & 13 September 2026 <br/> Neebar Gate Natural Resort, Kakkadampoyil
    </div>
  </div>`
);
// Make sure paragraph is justified
regPage = regPage.replace(
  /<p style={{ fontSize: '1rem', color: '#475569', lineHeight: '1\.6', marginBottom: '16px' }}>/g,
  `<p style={{ fontSize: '1rem', color: '#475569', lineHeight: '1.6', marginBottom: '16px', textAlign: 'justify' }}>`
);

// c) Arrows in "Think → Brainstorm → Design → Commit"
regPage = regPage.replace(
  /Think <br\/> → <br\/> Brainstorm <br\/> → <br\/> Design <br\/> → <br\/> Commit/g,
  `Think <br/> <span style={{color:'var(--primary)'}}>→</span> <br/> Brainstorm <br/> <span style={{color:'var(--primary)'}}>→</span> <br/> Design <br/> <span style={{color:'var(--primary)'}}>→</span> <br/> Commit`
);

// d) Day 1 / Day 2 headers centered with shape and date
regPage = regPage.replace(
  /<h3 style={{ fontSize: "1\.2rem", color: "var\(--primary\)", borderBottom: "2px solid #f1f5f9", paddingBottom: "8px", marginBottom: "16px", marginTop: 0 }}>Day 1<\/h3>/g,
  `<div style={{ textAlign: 'center', margin: '32px 0 24px 0' }}>
    <h3 style={{ display: 'inline-block', background: 'var(--primary)', color: 'white', padding: '6px 20px', borderRadius: '20px', fontSize: '1.1rem', margin: '0' }}>Day 1</h3>
    <div style={{ fontSize: '0.8rem', fontWeight: '300', color: '#64748b', marginTop: '4px' }}>12 Sep 2026</div>
  </div>`
);
regPage = regPage.replace(
  /<h3 style={{ fontSize: '1\.2rem', color: 'var\(--primary\)', borderBottom: '2px solid #f1f5f9', paddingBottom: '8px', marginBottom: '16px', marginTop: '32px' }}>Day 2<\/h3>/g,
  `<div style={{ textAlign: 'center', margin: '32px 0 24px 0' }}>
    <h3 style={{ display: 'inline-block', background: 'var(--primary)', color: 'white', padding: '6px 20px', borderRadius: '20px', fontSize: '1.1rem', margin: '0' }}>Day 2</h3>
    <div style={{ fontSize: '0.8rem', fontWeight: '300', color: '#64748b', marginTop: '4px' }}>13 Sep 2026</div>
  </div>`
);
fs.writeFileSync('src/app/register/page.tsx', regPage);

// 4. Ticket Page (Ticket.tsx)
let ticket = fs.readFileSync('src/app/ticket/[id]/page.tsx', 'utf8');
// a) Designation and district on the same line, remove separate district div
ticket = ticket.replace(
  /<div style={{ fontSize: '0\.95rem', fontWeight: '500', opacity: 0\.95, marginBottom: '4px' }}>\s*\{registration\.designation\}\s*<\/div>\s*<div style={{ fontSize: '0\.85rem', opacity: 0\.8, lineHeight: 1\.2, marginBottom: '4px' }}>\s*\{registration\.district\}\s*<\/div>/g,
  `<div style={{ fontSize: '0.9rem', fontWeight: '500', opacity: 0.95, marginBottom: '6px' }}>
    {registration.designation} | {registration.district}
  </div>`
);
// b) QR Code up slightly and logo inside bottom part
ticket = ticket.replace(
  /<div style={{ \s*background: 'white', \s*padding: '32px 20px', \s*display: 'flex', \s*flexDirection: 'column', \s*alignItems: 'center' \s*}}>\s*<QRCodeSVG value=\{registration\.regNumber\} size=\{160\} level="M" \/>\s*<div style={{ fontSize: '0\.75rem', color: '#94a3b8', marginTop: '16px' }}>Scan for entry<\/div>\s*<\/div>/,
  `<div style={{ background: 'white', padding: '24px 20px 20px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
    <QRCodeSVG value={registration.regNumber} size={140} level="M" />
    <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '12px' }}>Scan for entry</div>
    <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'center' }}>
      <img src="/logo.png" alt="Logo" style={{ maxWidth: '180px', height: 'auto', objectFit: 'contain' }} />
    </div>
  </div>`
);
// Remove external logo
ticket = ticket.replace(
  /<div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'center' }}>\s*<img src="\/logo\.png" alt="Logo" style={{ maxWidth: '250px', height: 'auto', objectFit: 'contain' }} \/>\s*<\/div>/,
  ``
);
// Make corner logos white and slightly bigger
ticket = ticket.replace(
  /width: '55px', height: '55px'/g,
  `width: '65px', height: '65px', filter: 'brightness(0) invert(1)'`
);

// We must also fetch the photo from localStorage if we are removing it from firebase
ticket = ticket.replace(
  /const savedPhoto = sessionStorage\.getItem\(\`photo_\$\{phone\}\`\);/,
  `const savedPhoto = localStorage.getItem(\`photo_\${phone}\`) || sessionStorage.getItem(\`photo_\${phone}\`);`
);

fs.writeFileSync('src/app/ticket/[id]/page.tsx', ticket);

// 5. Admin Page: Add timestamp
let admin = fs.readFileSync('src/app/admin/page.tsx', 'utf8');
if (!admin.includes('<th>Date</th>')) {
  admin = admin.replace(
    /<th>District<\/th>/,
    `<th>District</th>\n              <th>Date</th>`
  );
  admin = admin.replace(
    /<td>\{reg\.district\}<\/td>/,
    `<td>{reg.district}</td>\n                <td style={{ fontSize: '0.8rem', color: '#64748b' }}>{reg.createdAt ? new Date(reg.createdAt.seconds * 1000).toLocaleDateString() : 'N/A'}</td>`
  );
}
fs.writeFileSync('src/app/admin/page.tsx', admin);

// 6. Registration form
let regForm = fs.readFileSync('src/app/registration-form/page.tsx', 'utf8');
// a) Conclave Registration -> Camp Registration
regForm = regForm.replace(/>Conclave Registration</, '>Camp Registration<');

// b) Change photo handling to square crop & localStorage
const oldPhotoLogic = `  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoBase64(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPhotoFileName('');
      setPhotoBase64('');
    }
  };`;

const newPhotoLogic = `  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const size = Math.min(img.width, img.height);
          canvas.width = 400;
          canvas.height = 400;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            const startX = (img.width - size) / 2;
            const startY = (img.height - size) / 2;
            ctx.drawImage(img, startX, startY, size, size, 0, 0, 400, 400);
            setPhotoBase64(canvas.toDataURL('image/jpeg', 0.8));
          }
        };
        img.src = reader.result as string;
      };
      reader.readAsDataURL(file);
    } else {
      setPhotoFileName('');
      setPhotoBase64('');
    }
  };`;
regForm = regForm.replace(oldPhotoLogic, newPhotoLogic);

// c) Save to localStorage instead of sessionStorage
regForm = regForm.replace(/sessionStorage\.setItem/g, 'localStorage.setItem');

fs.writeFileSync('src/app/registration-form/page.tsx', regForm);

console.log('UI Fixes Done');
