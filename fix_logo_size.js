const fs = require('fs');

let page = fs.readFileSync('src/app/ticket/[id]/page.tsx', 'utf8');

page = page.replace(
  /top: '6px', right: '8px', width: '100px', height: '100px'/g,
  "top: '12px', right: '16px', width: '75px', height: '75px'"
);

fs.writeFileSync('src/app/ticket/[id]/page.tsx', page);
console.log('Logo size reduced');
