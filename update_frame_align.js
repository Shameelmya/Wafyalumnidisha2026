const fs = require('fs');

let page = fs.readFileSync('src/app/frame/page.tsx', 'utf8');

page = page.replace(
  /objectFit: 'contain', \s*pointerEvents: 'none'/g,
  `objectFit: 'contain', 
                    objectPosition: 'bottom',
                    pointerEvents: 'none'`
);

fs.writeFileSync('src/app/frame/page.tsx', page);
console.log('Frame aligned to bottom');
