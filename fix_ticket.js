const fs = require('fs');

let ticket = fs.readFileSync('src/app/ticket/[id]/page.tsx', 'utf8');

const newTicketLayout = `<div ref={ticketRef} id="export-ticket" style={{ 
          background: 'white', 
          borderRadius: '20px',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}>
          
          {/* Top Colored Part */}
          <div style={{ 
            background: 'linear-gradient(135deg, var(--primary), var(--primary-alt))', 
            color: 'white', 
            padding: '40px 20px 24px 20px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            position: 'relative'
          }}>
            {/* Corner Logos */}
            <div style={{ position: 'absolute', top: '20px', left: '20px', width: '65px', height: '65px', filter: 'brightness(0) invert(1)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent' }}>
              <img src="/alum.png" alt="Alumni Logo" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
            </div>
            <div style={{ position: 'absolute', top: '20px', right: '20px', width: '65px', height: '65px', filter: 'brightness(0) invert(1)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent' }}>
              <img src="/disha.png" alt="Disha Logo" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
            </div>

            <div style={{ fontSize: '0.75rem', letterSpacing: '0.05em', opacity: 0.9, marginBottom: '16px', textTransform: 'uppercase', fontWeight: '600', background: 'rgba(0,0,0,0.2)', padding: '4px 12px', borderRadius: '12px', marginTop: '20px' }}>
              ID: {registration.regNumber}
            </div>

            <div style={{ width: '120px', height: '120px', borderRadius: '50%', overflow: 'hidden', marginBottom: '16px', display: 'flex', justifyContent: 'center', alignItems: 'center', border: '1px solid rgba(255,255,255,0.4)', padding: '2px' }}>
               <img src={photo} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
            </div>
            
            <div style={{ fontSize: '1.4rem', fontWeight: '700', marginBottom: '8px', lineHeight: 1.2 }}>
              {toTitleCase(registration.name)}
            </div>
            <div style={{ fontSize: '0.8rem', fontWeight: '500', opacity: 0.9, marginBottom: '6px' }}>
              {registration.designation} | {registration.district}
            </div>
            <div style={{ fontSize: '0.75rem', opacity: 0.8, lineHeight: 1.2 }}>
              Ph: {phone}
            </div>
          </div>

          {/* Dashed Divider Line with Hole Punches */}
          <div style={{ position: 'relative', width: '100%', height: '24px', background: 'white' }}>
            <div style={{ position: 'absolute', top: '11px', left: '10px', right: '10px', borderTop: '2px dashed rgba(0,0,0,0.15)' }}></div>
            <div style={{ position: 'absolute', top: '2px', left: '-10px', width: '20px', height: '20px', borderRadius: '50%', background: '#fafafa', zIndex: 2 }}></div>
            <div style={{ position: 'absolute', top: '2px', right: '-10px', width: '20px', height: '20px', borderRadius: '50%', background: '#fafafa', zIndex: 2 }}></div>
          </div>

          {/* Bottom White Part */}
          <div style={{ background: 'white', padding: '16px 20px 24px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <QRCodeSVG value={registration.regNumber} size={130} level="M" />
            <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '12px' }}>Scan for entry</div>
            <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}>
              <img src="/logo.png" alt="Logo" style={{ maxWidth: '160px', height: 'auto', objectFit: 'contain' }} />
            </div>
          </div>

        </div>`;

ticket = ticket.replace(/<div ref=\{ticketRef\} id="export-ticket"[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/, newTicketLayout + '\n      </div>');

fs.writeFileSync('src/app/ticket/[id]/page.tsx', ticket);
console.log('Ticket fixed!');
