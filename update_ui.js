const fs = require('fs');

// 1. Update src/app/register/page.tsx
let page = fs.readFileSync('src/app/register/page.tsx', 'utf8');

// Date & Venue
page = page.replace('12 & 13 September 2026 | Neebar Gate Natural Resort, Kakkadampoyil',
  '12 & 13 September 2026 <br/> Neebar Gate Natural Resort, Kakkadampoyil');

// Subtitle bold
page = page.replace('Orientation, Vision Building & Programme Design Camp',
  '<span style={{ fontWeight: 600 }}>Orientation, Vision Building & Programme Design Camp</span>');

// Central question paragraph: remove the box and bold
page = page.replace(
  /<div style={{\s*background:\s*'rgba\(0,198,255,0\.05\)',\s*padding:\s*'16px',\s*borderRadius:\s*'12px',\s*borderLeft:\s*'4px solid var\(--primary\)'\s*}}>\s*<p style={{\s*color:\s*'var\(--primary-alt\)',\s*fontWeight:\s*'600',\s*marginBottom:\s*'8px'\s*}}>\s*The central question of DISHA is:\s*<\/p>\s*<p style={{\s*fontSize:\s*'1\.1rem',\s*color:\s*'#1e293b',\s*fontStyle:\s*'italic',\s*lineHeight:\s*'1\.6'\s*}}>\s*“What meaningful difference can we create during our two-year tenure\?”\s*<\/p>\s*<\/div>/g,
  '<p style={{ fontSize: "1rem", color: "#334155", lineHeight: "1.6" }}>The central question of DISHA is: “What meaningful difference can we create during our two-year tenure?”</p>'
);

// Bullet points spacing & justify
page = page.replace(
  /<ul style={{ paddingLeft: '0', listStyleType: 'none', margin: '0', display: 'flex', flexDirection: 'column', gap: '12px' }}>/g,
  '<ul style={{ paddingLeft: "0", listStyleType: "none", margin: "0", display: "flex", flexDirection: "column", gap: "6px", textAlign: "justify" }}>'
);

// Schedule texts
page = page.replace('title="ഭക്ഷണം, ഉല്ലാസം, വിശ്രമം"', 'title="ഭക്ഷണം, വിശ്രമം"');
page = page.replace('title="ദൃശ്യം (Morning Vibe)"', 'title="ദൃശ്യം"');

// Session Re-numbering
page = page.replace('tag="Session 04" title="ദീപ്തി"', 'tag="Session 05" title="ദീപ്തി"');
page = page.replace('tag="Session 03" title="വശ്യം"', 'tag="Session 04" title="വശ്യം"');
page = page.replace('tag="Session 02" title="സ്പർശം"', 'tag="Session 03" title="സ്പർശം"');
page = page.replace('tag="Session 01" title="ദർശനം"', 'tag="Session 02" title="ദർശനം"');
page = page.replace('title="പഥം" desc=', 'tag="Session 01" title="പഥം" desc=');

// Add Day 1 heading
if (!page.includes('>Day 1</h3>')) {
  page = page.replace(
    '<ScheduleItem time="01:30 PM" title="റിപ്പോർട്ടിംഗ്" />',
    '<h3 style={{ fontSize: "1.2rem", color: "var(--primary)", borderBottom: "2px solid #f1f5f9", paddingBottom: "8px", marginBottom: "16px", marginTop: 0 }}>Day 1</h3>\n                  <ScheduleItem time="01:30 PM" title="റിപ്പോർട്ടിംഗ്" />'
  );
}

fs.writeFileSync('src/app/register/page.tsx', page);

// 2. Remove placeholders in src/app/registration-form/page.tsx
let form = fs.readFileSync('src/app/registration-form/page.tsx', 'utf8');
form = form.replace(/placeholder="e\.g\.[^"]*"/g, 'placeholder=""');
fs.writeFileSync('src/app/registration-form/page.tsx', form);

// 3. Update Noto Serif Malayalam globally
let css = fs.readFileSync('src/app/globals.css', 'utf8');
css = css.replace(/font-family:[^;]*;/, "font-family: 'Noto Serif Malayalam', 'Inter', sans-serif;");
fs.writeFileSync('src/app/globals.css', css);

console.log('Update done!');
