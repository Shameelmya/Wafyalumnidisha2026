const fs = require('fs');

// 1. Fix register/page.tsx
let regPage = fs.readFileSync('src/app/register/page.tsx', 'utf8');

// Remove DISHA 2026 Leaders Conclave heading
regPage = regPage.replace(
  /<div style=\{\{\s*textAlign:\s*'center',\s*marginBottom:\s*'32px'\s*\}\}>\s*<h3 style=\{\{\s*color:\s*'var\(--primary\)',\s*fontSize:\s*'1\.4rem',\s*fontWeight:\s*'800'\s*\}\}>DISHA 2026<\/h3>\s*<p style=\{\{\s*fontWeight:\s*'600',\s*color:\s*'var\(--foreground\)',\s*fontSize:\s*'1rem',\s*textAlign:\s*'justify',\s*hyphens:\s*'auto',\s*WebkitHyphens:\s*'auto',\s*textJustify:\s*'inter-word'\s*\}\}>Leaders' Conclave<\/p>\s*<\/div>/g,
  ''
);

// Fix Day 2 heading to match Day 1 exactly
regPage = regPage.replace(
  /<tr><td colSpan=\{2\} style=\{\{\s*padding:\s*'32px 0 16px',\s*fontWeight:\s*'800',\s*color:\s*'var\(--foreground\)',\s*fontSize:\s*'1\.1rem',\s*textAlign:\s*'center'\s*\}\}>Day 2 \(13 Sep 2026\)<\/td><\/tr>/g,
  `<tr>
    <td colSpan={2} style={{ padding: '32px 0 24px 0' }}>
      <div style={{ background: 'var(--primary)', color: 'white', padding: '12px 24px', borderRadius: '12px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>Day 2</span>
        <span style={{ fontWeight: '300', fontSize: '0.95rem', opacity: 0.9 }}>- 13 Sep 2026</span>
      </div>
    </td>
  </tr>`
);

// Fix bullet points alignment in 'What is Disha'
regPage = regPage.replace(/textAlign: "justify"/g, 'textAlign: "left"');

fs.writeFileSync('src/app/register/page.tsx', regPage);


// 2. Fix registration-form/page.tsx (Add back designation and district placeholders)
let formPage = fs.readFileSync('src/app/registration-form/page.tsx', 'utf8');

formPage = formPage.replace(
  /<SearchableDropdown \s*options=\{designationsList\} \s*value=\{formData\.designation\} \s*onChange=\{\(val\) => setFormData\(\{ \.\.\.formData, designation: val \}\)\} \s*placeholder="" \s*\/>/g,
  `<SearchableDropdown 
            options={designationsList} 
            value={formData.designation} 
            onChange={(val) => setFormData({ ...formData, designation: val })} 
            placeholder="Select your designation" 
          />`
);

formPage = formPage.replace(
  /<SearchableDropdown \s*options=\{districtsList\} \s*value=\{formData\.district\} \s*onChange=\{\(val\) => setFormData\(\{ \.\.\.formData, district: val \}\)\} \s*placeholder="" \s*\/>/g,
  `<SearchableDropdown 
            options={districtsList} 
            value={formData.district} 
            onChange={(val) => setFormData({ ...formData, district: val })} 
            placeholder="Select your district" 
          />`
);

fs.writeFileSync('src/app/registration-form/page.tsx', formPage);

console.log('Fixed headings, placeholders, and alignment');
