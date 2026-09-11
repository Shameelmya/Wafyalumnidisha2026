const fs = require('fs');

let page = fs.readFileSync('src/app/register/page.tsx', 'utf8');

page = page.replace(
  /<div style=\{\{\s*background:\s*'var\(--primary\)',\s*color:\s*'white',\s*padding:\s*'12px 24px',\s*borderRadius:\s*'12px',\s*margin:\s*'32px 0 24px 0',\s*display:\s*'flex',\s*justifyContent:\s*'center',\s*alignItems:\s*'center',\s*gap:\s*'8px'\s*\}\}>\s*<span style=\{\{\s*fontWeight:\s*'bold',\s*fontSize:\s*'1\.1rem'\s*\}\}>Day 1<\/span>\s*<span style=\{\{\s*fontWeight:\s*'300',\s*fontSize:\s*'0\.95rem',\s*opacity:\s*0\.9\s*\}\}>- 12 Sep 2026<\/span>\s*<\/div>/g,
  `<tr>
    <td colSpan={2} style={{ padding: '32px 0 24px 0' }}>
      <div style={{ background: 'var(--primary)', color: 'white', padding: '12px 24px', borderRadius: '12px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>Day 1</span>
        <span style={{ fontWeight: '300', fontSize: '0.95rem', opacity: 0.9 }}>- 12 Sep 2026</span>
      </div>
    </td>
  </tr>`
);

page = page.replace(
  /<div style=\{\{\s*background:\s*'var\(--primary\)',\s*color:\s*'white',\s*padding:\s*'12px 24px',\s*borderRadius:\s*'12px',\s*margin:\s*'32px 0 24px 0',\s*display:\s*'flex',\s*justifyContent:\s*'center',\s*alignItems:\s*'center',\s*gap:\s*'8px'\s*\}\}>\s*<span style=\{\{\s*fontWeight:\s*'bold',\s*fontSize:\s*'1\.1rem'\s*\}\}>Day 2<\/span>\s*<span style=\{\{\s*fontWeight:\s*'300',\s*fontSize:\s*'0\.95rem',\s*opacity:\s*0\.9\s*\}\}>- 13 Sep 2026<\/span>\s*<\/div>/g,
  `<tr>
    <td colSpan={2} style={{ padding: '32px 0 24px 0' }}>
      <div style={{ background: 'var(--primary)', color: 'white', padding: '12px 24px', borderRadius: '12px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>Day 2</span>
        <span style={{ fontWeight: '300', fontSize: '0.95rem', opacity: 0.9 }}>- 13 Sep 2026</span>
      </div>
    </td>
  </tr>`
);

fs.writeFileSync('src/app/register/page.tsx', page);
console.log('Fixed table layout');
