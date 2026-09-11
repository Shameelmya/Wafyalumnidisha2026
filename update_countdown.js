const fs = require('fs');

let page = fs.readFileSync('src/app/page.tsx', 'utf8');

page = page.replace(
  /new Date\("2026-09-12T09:00:00"\)/g,
  `new Date("2026-09-12T14:30:00")`
);

page = page.replace(
  /\/\/ SEP 12 2026, 09:00 AM target date/g,
  `// SEP 12 2026, 02:30 PM target date`
);

fs.writeFileSync('src/app/page.tsx', page);
console.log('Countdown target time updated to 2:30 PM');
