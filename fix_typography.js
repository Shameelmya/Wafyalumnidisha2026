const fs = require('fs');
let c = fs.readFileSync('src/app/register/page.tsx', 'utf8');

// We want to add hyphens: 'auto', WebkitHyphens: 'auto', textJustify: 'inter-word' 
// to any style object that has textAlign: 'justify'.

c = c.replace(
  /textAlign:\s*'justify'/g,
  "textAlign: 'justify', hyphens: 'auto', WebkitHyphens: 'auto', textJustify: 'inter-word'"
);

fs.writeFileSync('src/app/register/page.tsx', c);
console.log('Typography fixed!');
