const fs = require('fs');

let page = fs.readFileSync('src/app/ticket/[id]/page.tsx', 'utf8');

// Increase disha.png size to 100px
page = page.replace(
  /width: '80px', height: '80px', filter: 'brightness\(0\) invert\(1\)'/g,
  "width: '100px', height: '100px', filter: 'brightness(0) invert(1)'"
);

// We should also probably adjust the 'top' position slightly up so it doesn't push down. It was top: 16px.
page = page.replace(
  /top: '16px', right: '20px', width: '100px'/g,
  "top: '6px', right: '16px', width: '100px'"
);

// Increase top padding above QR code
page = page.replace(
  /padding: '16px 20px 16px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center'/g,
  "padding: '36px 20px 16px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center'"
);

fs.writeFileSync('src/app/ticket/[id]/page.tsx', page);
console.log('Ticket UI fixed again!');
