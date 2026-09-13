const fs = require('fs');

let page = fs.readFileSync('src/app/page.tsx', 'utf8');

const originalButtons = `<div style={{ display: 'flex', gap: '12px', width: '100%' }}>
          <Link href="/frame" className="btn-secondary" style={{ flex: 1, padding: '16px 0' }}>
            Frame
          </Link>
          <a href="https://drive.google.com/drive/folders/1_AeffRs81XU_gC23jnaorRvkAeIymtBF?usp=sharing" target="_blank" rel="noopener noreferrer" className="btn-secondary" style={{ flex: 1, padding: '16px 0' }}>
            Gallery
          </a>
        </div>`;

const newButtons = `<div style={{ display: 'flex', gap: '12px', width: '100%' }}>
          <a href="https://drive.google.com/drive/folders/1_AeffRs81XU_gC23jnaorRvkAeIymtBF?usp=sharing" target="_blank" rel="noopener noreferrer" className="btn-secondary" style={{ flex: 1, padding: '16px 0' }}>
            Gallery
          </a>
          <Link href="/frame" className="btn-secondary" style={{ flex: 1, padding: '16px 0' }}>
            Frame
          </Link>
        </div>`;

page = page.replace(originalButtons, newButtons);
fs.writeFileSync('src/app/page.tsx', page);
console.log('Buttons swapped');
