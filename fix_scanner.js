const fs = require('fs');

let page = fs.readFileSync('src/app/admin/scanner/page.tsx', 'utf8');

page = page.replace(
  /<p><strong>School:<\/strong> \{userData\.school\}<\/p>\s*<p><strong>Designation:<\/strong> \{userData\.position\}<\/p>/g,
  `<p><strong>District:</strong> {userData.district}</p>
            <p><strong>Designation:</strong> {userData.designation}</p>`
);

fs.writeFileSync('src/app/admin/scanner/page.tsx', page);
console.log('Scanner fields updated.');
