const fs = require('fs');
let c = fs.readFileSync('src/app/ticket/[id]/page.tsx', 'utf8');

// The photo div currently looks like:
// <div style={{ width: '120px', height: '120px', borderRadius: '50%', overflow: 'hidden', marginBottom: '16px', display: 'flex', justifyContent: 'center', alignItems: 'center', border: '1px solid rgba(255,255,255,0.4)', padding: '2px' }}>

// Actually wait, let me check what it currently looks like.
c = c.replace(
  /boxShadow:\s*'0 4px 15px rgba\(0,0,0,0\.2\)',?\s*/g,
  ''
);

fs.writeFileSync('src/app/ticket/[id]/page.tsx', c);
console.log('Shadow removed!');
