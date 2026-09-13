const fs = require('fs');

let page = fs.readFileSync('src/app/frame/page.tsx', 'utf8');

const oldBlock = `{frameType !== 'none' && (
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '8px' }}>
              <button 
                onClick={() => setFrameType(frameType === 'PTR' ? 'LSC' : 'PTR')}
                className="btn-secondary"
                style={{
                  padding: '8px 16px',
                  fontSize: '0.9rem',
                  borderRadius: '20px'
                }}
              >
                Change frame to {frameType === 'PTR' ? 'Landscape' : 'Portrait'}
              </button>
            </div>
          )}`;

const newBlock = `{frameType !== 'none' && (
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', gap: '8px' }}>
              <button 
                onClick={() => setFrameType(frameType === 'PTR' ? 'LSC' : 'PTR')}
                className="btn-secondary"
                style={{
                  padding: '8px 16px',
                  fontSize: '0.85rem',
                  borderRadius: '20px'
                }}
              >
                Change to {frameType === 'PTR' ? 'Landscape' : 'Portrait'}
              </button>
              
              <label 
                className="btn-primary"
                style={{
                  padding: '8px 16px',
                  fontSize: '0.85rem',
                  borderRadius: '20px',
                  cursor: 'pointer'
                }}
              >
                Upload New Photo
                <input type="file" accept="image/*" onChange={handlePhotoUpload} style={{ display: 'none' }} />
              </label>
            </div>
          )}`;

page = page.replace(oldBlock, newBlock);

fs.writeFileSync('src/app/frame/page.tsx', page);
console.log('Top bar updated with upload button');
