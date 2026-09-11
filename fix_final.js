const fs = require('fs');

// 1. Add Noto Serif class to globals.css
let css = fs.readFileSync('src/app/globals.css', 'utf8');
if (!css.includes('.noto-serif-malayalam')) {
  css += `\n.noto-serif-malayalam {\n  font-family: 'Noto Serif Malayalam', serif;\n  font-optical-sizing: auto;\n  font-style: normal;\n}\n`;
  fs.writeFileSync('src/app/globals.css', css);
}

// 2. Change Day 1 & Day 2 layout in register/page.tsx
let page = fs.readFileSync('src/app/register/page.tsx', 'utf8');

// The original map loop for Day 1 and Day 2:
// <div key={index} style={{ background: 'var(--primary)', color: 'white', padding: '6px 24px', borderRadius: '24px', fontWeight: 'bold', fontSize: '1.2rem', marginBottom: '8px', display: 'inline-block' }}>
//   {day.day}
// </div>
// <div style={{ fontSize: '1rem', color: '#64748b', marginBottom: '24px' }}>{day.date}</div>

page = page.replace(
  /<div key=\{index\} style=\{\{\s*background:\s*'var\(--primary\)',\s*color:\s*'white',\s*padding:\s*'6px 24px',\s*borderRadius:\s*'24px',\s*fontWeight:\s*'bold',\s*fontSize:\s*'1\.2rem',\s*marginBottom:\s*'8px',\s*display:\s*'inline-block'\s*\}\}>\s*\{day\.day\}\s*<\/div>\s*<div style=\{\{\s*fontSize:\s*'1rem',\s*color:\s*'#64748b',\s*marginBottom:\s*'24px'\s*\}\}>\s*\{day\.date\}\s*<\/div>/g,
  `<div key={index} style={{ background: 'var(--primary)', color: 'white', padding: '12px 24px', borderRadius: '12px', marginBottom: '24px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
                     <span style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{day.day}</span>
                     <span style={{ fontWeight: '300', fontSize: '0.95rem', opacity: 0.9 }}>- {day.date}</span>
                   </div>`
);

// Add the font to Malayalam text (Morning Vibe)
// <div style={{ color: 'var(--primary)', fontWeight: 'bold', fontSize: '1rem', minWidth: '90px' }}>{session.time}</div>
// <div style={{ fontSize: '0.95rem', fontWeight: '500', color: 'var(--foreground)' }}>{session.title}</div>
// There is also "ദൃശ്യം (Morning Vibe)"
page = page.replace(
  /ദൃശ്യം \(Morning Vibe\)/g,
  '<span className="noto-serif-malayalam">ദൃശ്യം</span> (Morning Vibe)'
);

fs.writeFileSync('src/app/register/page.tsx', page);
console.log('Done!');
