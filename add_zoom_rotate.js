const fs = require('fs');

let page = fs.readFileSync('src/app/frame/page.tsx', 'utf8');

// 1. Add state for zoom, rotate, pan
if (!page.includes('const [zoom, setZoom]')) {
  page = page.replace(
    'const [temperature, setTemperature] = useState(0);',
    `const [temperature, setTemperature] = useState(0); 

  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [panX, setPanX] = useState(0);
  const [panY, setPanY] = useState(0);

  const resetAdjustments = () => {
    setContrast(100);
    setSaturation(100);
    setBrightness(100);
    setTemperature(0);
    setZoom(1);
    setRotation(0);
    setPanX(0);
    setPanY(0);
  };`
  );
}

// 2. Add transform to user photo
page = page.replace(
  'filter: getFilterStyle()',
  'filter: getFilterStyle(),\n                  transform: `scale(${zoom}) rotate(${rotation}deg) translate(${panX}%, ${panY}%)`'
);

// 3. Add Reset button and new sliders to the Adjust Photo panel
const oldPanelStart = `<h3 style={{ marginBottom: '16px', fontSize: '1.1rem' }}>Adjust Photo</h3>`;
const newPanelStart = `<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '1.1rem', margin: 0 }}>Adjust Photo</h3>
                <button onClick={resetAdjustments} style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem', fontWeight: '600' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path><polyline points="3 3 3 8 8 8"></polyline></svg>
                  Reset
                </button>
              </div>`;
page = page.replace(oldPanelStart, newPanelStart);

const slidersToAdd = `                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem', fontWeight: '600' }}>
                    <span>Zoom</span>
                    <span>{zoom.toFixed(1)}x</span>
                  </div>
                  <input type="range" min="0.5" max="3" step="0.1" value={zoom} onChange={(e) => setZoom(Number(e.target.value))} style={{ width: '100%' }} />
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem', fontWeight: '600' }}>
                    <span>Rotate</span>
                    <span>{rotation}°</span>
                  </div>
                  <input type="range" min="-180" max="180" value={rotation} onChange={(e) => setRotation(Number(e.target.value))} style={{ width: '100%' }} />
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem', fontWeight: '600' }}>
                    <span>Move X-Axis</span>
                    <span>{panX}%</span>
                  </div>
                  <input type="range" min="-100" max="100" value={panX} onChange={(e) => setPanX(Number(e.target.value))} style={{ width: '100%' }} />
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem', fontWeight: '600' }}>
                    <span>Move Y-Axis</span>
                    <span>{panY}%</span>
                  </div>
                  <input type="range" min="-100" max="100" value={panY} onChange={(e) => setPanY(Number(e.target.value))} style={{ width: '100%' }} />
                </div>\n`;

// Insert new sliders before the Brightness slider
page = page.replace(
  `<div>\n                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem', fontWeight: '600' }}>\n                    <span>Brightness</span>`,
  slidersToAdd + `                <div>\n                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem', fontWeight: '600' }}>\n                    <span>Brightness</span>`
);

fs.writeFileSync('src/app/frame/page.tsx', page);
console.log('Added zoom, rotate, pan and reset controls');
