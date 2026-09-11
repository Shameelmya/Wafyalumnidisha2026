const fs = require('fs');
let f = fs.readFileSync('src/app/register/page.tsx', 'utf8');

// Justify all paragraph tags that look like <p style={{...}}>
f = f.replace(/<p style=\{\{(.*?)\}\}>/g, (match, styles) => {
  if (!styles.includes('textAlign')) {
    // Add textAlign: 'justify' if it's missing
    const newStyles = styles.trim() + ", textAlign: 'justify'";
    return `<p style={{ ${newStyles} }}>`;
  }
  return match;
});

// There is also a div around the bullet points that might need justify
f = f.replace(
  /<div style=\{\{\s*paddingLeft:\s*'16px',\s*display:\s*'flex',\s*flexDirection:\s*'column',\s*gap:\s*'8px'\s*\}\}>/g,
  `<div style={{ paddingLeft: '16px', display: 'flex', flexDirection: 'column', gap: '8px', textAlign: 'justify' }}>`
);

fs.writeFileSync('src/app/register/page.tsx', f);
console.log('Justified!');
