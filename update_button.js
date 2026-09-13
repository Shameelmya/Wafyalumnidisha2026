const fs = require('fs');

let page = fs.readFileSync('src/app/page.tsx', 'utf8');

page = page.replace(
  /<a href="https:\/\/maps\.app\.goo\.gl\/kuQ67dZKdnrNCC6Q6"[^>]*>[\s\S]*?Location[\s\S]*?<\/a>/,
  `<a href="https://drive.google.com/drive/folders/1_AeffRs81XU_gC23jnaorRvkAeIymtBF?usp=sharing" target="_blank" rel="noopener noreferrer" className="btn-secondary" style={{ flex: 1, padding: '16px 0' }}>
            Gallery
          </a>`
);

fs.writeFileSync('src/app/page.tsx', page);
console.log('Location button changed to Gallery');
