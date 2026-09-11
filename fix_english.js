const fs = require('fs');

// 1. Revert English font to Inter in globals.css
let css = fs.readFileSync('src/app/globals.css', 'utf8');
css = css.replace(/font-family:\s*"Noto Serif Malayalam",\s*"Inter",\s*sans-serif;/g, 'font-family: "Inter", sans-serif;');
// Wait, to be safe, I'll just replace the body block font-family line:
css = css.replace(/body\s*\{\s*font-family:[^;]+;/g, 'body {\n  font-family: "Inter", sans-serif;');
fs.writeFileSync('src/app/globals.css', css);

// 2. Move Developed By higher up in layout.tsx
let layout = fs.readFileSync('src/app/layout.tsx', 'utf8');
layout = layout.replace(
  /<footer style=\{\{ textAlign: 'center', padding: '24px 20px', color: 'var\(--secondary-text\)', fontSize: '14px', lineHeight: '1\.6' \}\}>/,
  `<footer style={{ textAlign: 'center', padding: '0px 20px 24px', color: 'var(--secondary-text)', fontSize: '14px', lineHeight: '1.6', marginTop: '-10px' }}>`
);
fs.writeFileSync('src/app/layout.tsx', layout);
console.log('Font and layout fixed!');
