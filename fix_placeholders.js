const fs = require('fs');

let page = fs.readFileSync('src/app/registration-form/page.tsx', 'utf8');

const replacements = [
  'placeholder="Enter your full name"',
  'placeholder="Select your designation"',
  'placeholder="E.g. Vice President"',
  'placeholder="Select your district"',
  'placeholder="Your District Name"',
  'placeholder="10-digit mobile number"',
  'placeholder="WhatsApp mobile number"'
];

for (const r of replacements) {
  // We use replaceAll or regex to catch all instances
  page = page.split(r).join('placeholder=""');
}

fs.writeFileSync('src/app/registration-form/page.tsx', page);
console.log('Placeholders cleared!');
