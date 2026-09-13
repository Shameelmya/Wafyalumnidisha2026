const fs = require('fs');

let page = fs.readFileSync('src/app/frame/page.tsx', 'utf8');

const oldLayout = `          {/* Always show Preview Area first once photo is uploaded */}
          <div style={{ position: 'relative', width: '100%', display: 'flex', justifyContent: 'center' }}>
            <div 
              ref={exportRef}
              style={{ 
                position: 'relative', 
                width: '100%', 
                maxWidth: '500px', 
                aspectRatio: frameType === 'PTR' ? '4/5' : frameType === 'LSC' ? '4/3' : '1/1',
                overflow: 'hidden',
                background: '#ccc'
              }}
            >
              {/* User Photo */}
              <img 
                src={photo} 
                alt="User photo" 
                style={{ 
                  position: 'absolute', 
                  top: 0, 
                  left: 0, 
                  width: '100%', 
                  height: '100%', 
                  objectFit: 'cover',
                  filter: getFilterStyle()
                }} 
              />
              
              {/* Frame Overlay */}
              {frameType !== 'none' && (
                <img 
                  src={frameType === 'PTR' ? '/PTR.png' : '/LSC.png'} 
                  alt="Frame" 
                  style={{ 
                    position: 'absolute', 
                    top: 0, 
                    left: 0, 
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'contain', 
                    objectPosition: 'bottom',
                    pointerEvents: 'none'
                  }} 
                />
              )}
            </div>

            {/* Quick change frame button overlay */}
            {frameType !== 'none' && (
              <button 
                onClick={() => setFrameType(frameType === 'PTR' ? 'LSC' : 'PTR')}
                style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  background: 'rgba(0,0,0,0.6)',
                  color: 'white',
                  border: '1px solid rgba(255,255,255,0.3)',
                  backdropFilter: 'blur(4px)',
                  borderRadius: '20px',
                  padding: '8px 16px',
                  fontSize: '0.85rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  zIndex: 10,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                }}
              >
                Change to {frameType === 'PTR' ? 'Landscape' : 'Portrait'}
              </button>
            )}
          </div>`;

const newLayout = `          {/* Always show Preview Area first once photo is uploaded */}
          
          {frameType !== 'none' && (
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
          )}

          <div style={{ position: 'relative', width: '100%', display: 'flex', justifyContent: 'center' }}>
            <div 
              ref={exportRef}
              style={{ 
                position: 'relative', 
                width: '100%', 
                maxWidth: '500px', 
                aspectRatio: frameType === 'PTR' ? '4/5' : frameType === 'LSC' ? '4/3' : '1/1',
                overflow: 'hidden',
                background: '#ccc'
              }}
            >
              {/* User Photo */}
              <img 
                src={photo} 
                alt="User photo" 
                style={{ 
                  position: 'absolute', 
                  top: 0, 
                  left: 0, 
                  width: '100%', 
                  height: '100%', 
                  objectFit: 'cover',
                  filter: getFilterStyle()
                }} 
              />
              
              {/* Frame Overlay */}
              {frameType !== 'none' && (
                <img 
                  src={frameType === 'PTR' ? '/PTR.png' : '/LSC.png'} 
                  alt="Frame" 
                  style={{ 
                    position: 'absolute', 
                    top: 'auto', 
                    bottom: 0, 
                    left: 0, 
                    width: '100%', 
                    height: 'auto', 
                    pointerEvents: 'none'
                  }} 
                />
              )}
            </div>
          </div>`;

page = page.replace(oldLayout, newLayout);

fs.writeFileSync('src/app/frame/page.tsx', page);
console.log('Button moved and frame alignment adjusted');
