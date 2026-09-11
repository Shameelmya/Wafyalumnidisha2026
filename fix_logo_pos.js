const fs = require('fs');

let page = fs.readFileSync('src/app/ticket/[id]/page.tsx', 'utf8');

page = page.replace(
  /top: '6px', right: '16px', width: '100px'/g,
  "top: '6px', right: '8px', width: '100px'"
);

fs.writeFileSync('src/app/ticket/[id]/page.tsx', page);
console.log('Logo shifted right');
