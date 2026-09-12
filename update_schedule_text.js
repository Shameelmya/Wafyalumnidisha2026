const fs = require('fs');

let page = fs.readFileSync('src/app/register/page.tsx', 'utf8');

page = page.replace(/title="\([^"]*ബ്രേക്ക്[^"]*\)"/g, 'title="ബ്രേക്ക്"');
page = page.replace(/title="\(Break\)"/g, 'title="ബ്രേക്ക്"');
page = page.replace(/desc="\(Morning Vibe\)"/g, 'desc="(മോർണിംഗ് വൈബ്)"');

fs.writeFileSync('src/app/register/page.tsx', page);
console.log('Text updated');
