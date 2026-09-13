const fs = require('fs');

let page = fs.readFileSync('src/app/frame/page.tsx', 'utf8');

const oldControls = `          ) : (
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
              <button onClick={() => setFrameType('none')} className="btn-secondary" style={{ flex: 1, padding: '12px' }}>Remove Frame</button>
              <button onClick={() => setShowEdit(!showEdit)} className="btn-primary" style={{ flex: 1, padding: '12px' }}>{showEdit ? 'Hide Edit' : 'Edit Photo'}</button>
            </div>
          )}`;

const newControls = `          ) : (
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
              <button onClick={() => setShowEdit(!showEdit)} className="btn-secondary" style={{ flex: 1, padding: '12px', fontSize: '0.9rem' }}>
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                  {showEdit ? 'Hide Edit' : 'Edit Photo'}
                </span>
              </button>
              <button onClick={handleDownload} className="btn-primary" style={{ flex: 1, padding: '12px', fontSize: '0.9rem' }}>
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                  Download
                </span>
              </button>
              <button onClick={handleShare} className="btn-primary" style={{ flex: 1, padding: '12px', fontSize: '0.9rem' }}>
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>
                  Share
                </span>
              </button>
            </div>
          )}`;

page = page.replace(oldControls, newControls);

const exportButtonsRegex = /\{\/\* Export Buttons \*\/\}\s*\{frameType !== 'none' && \(\s*<div style=\{\{ display: 'flex', gap: '12px', marginTop: '16px' \}\}>[\s\S]*?<\/div>\s*\)\}/;

page = page.replace(exportButtonsRegex, '');

fs.writeFileSync('src/app/frame/page.tsx', page);
console.log('Buttons updated');
