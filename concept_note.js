const fs = require('fs');
let page = fs.readFileSync('src/app/register/page.tsx', 'utf8');

const conceptNoteStart = page.indexOf('{/* Concept Note */}');
const scheduleStart = page.indexOf('{/* Schedule */}');

const originalNote = page.substring(conceptNoteStart, scheduleStart);

const newNote = `{/* Concept Note */}
        <div style={{ background: 'var(--card-bg)', borderRadius: '12px', padding: '24px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' }}>
          <button 
            onClick={() => setShowNote(!showNote)} 
            style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'transparent', color: 'var(--foreground)', fontSize: '1.25rem', fontWeight: '700', border: 'none', cursor: 'pointer', padding: 0 }}
          >
            Concept Note
            <span style={{ color: 'var(--primary)', transition: 'transform 0.2s', transform: showNote ? 'rotate(180deg)' : 'rotate(0)' }}>▼</span>
          </button>
          
          {showNote && (
            <div style={{ marginTop: '24px', fontSize: '0.95rem', lineHeight: '1.7', color: 'var(--secondary-text)' }}>
              
              <div style={{ textAlign: 'center', marginBottom: '32px', paddingBottom: '24px', borderBottom: '1px solid #e2e8f0' }}>
                <h3 style={{ color: 'var(--primary)', marginBottom: '12px', fontSize: '1.5rem', fontWeight: '800', letterSpacing: '0.05em' }}>DISHA 2026<br/>WAFY LEADERS MEET</h3>
                <p style={{ fontWeight: '600', color: 'var(--foreground)', fontSize: '1.05rem', marginBottom: '8px' }}>Orientation, Vision Building & Programme Design Camp</p>
                <div style={{ display: 'inline-block', background: '#f1f5f9', padding: '6px 12px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: '600', color: '#475569' }}>
                  12 & 13 September 2026 | Neebar Gate Natural Resort, Kakkadampoyil
                </div>
              </div>

              <div style={{ marginBottom: '32px' }}>
                <p style={{ marginBottom: '16px' }}>Leadership is not merely managing an organisation; it is the ability to visualise possibilities, identify needs, inspire people and transform ideas into meaningful action.</p>
                <p style={{ marginBottom: '16px' }}>DISHA 2026 is conceived as a two-day orientation and vision-building camp for the newly elected WAFY leaders, marking the beginning of their two-year tenure. The camp aims to inspire leaders to think beyond routine activities and envision innovative initiatives for the educational, intellectual and social empowerment of the WAFY community and society at large.</p>
                
                <div style={{ background: '#f8fafc', borderLeft: '4px solid var(--primary)', padding: '20px', borderRadius: '0 8px 8px 0', margin: '24px 0' }}>
                  <p style={{ color: '#475569', fontSize: '0.9rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>The Central Question of DISHA</p>
                  <p style={{ color: 'var(--primary)', fontSize: '1.15rem', fontWeight: '700', lineHeight: '1.5' }}>“What meaningful difference can we create during our two-year tenure?”</p>
                </div>
                
                <p style={{ marginBottom: '16px' }}>Participants will come prepared to think, brainstorm and design. Each committee will examine the needs and opportunities within its area, develop innovative ideas and translate them into programmes that can create sustainable impact.</p>
              </div>

              <div style={{ marginBottom: '32px' }}>
                <h4 style={{ color: 'var(--foreground)', fontSize: '1.1rem', fontWeight: '700', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ width: '24px', height: '2px', background: 'var(--primary)' }}></span>
                  The DISHA Approach
                </h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '16px', justifyContent: 'center' }}>
                   {['Think', 'Brainstorm', 'Design', 'Commit'].map((step, idx) => (
                     <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ background: 'var(--primary)', color: 'white', padding: '6px 16px', borderRadius: '20px', fontWeight: '600', fontSize: '0.85rem' }}>{step}</div>
                        {idx !== 3 && <div style={{ color: '#cbd5e1', fontWeight: 'bold' }}>→</div>}
                     </div>
                   ))}
                </div>
                <p style={{ textAlign: 'center', marginBottom: '16px', fontWeight: '500', color: '#64748b' }}>DISHA seeks to move: Leadership → Vision → Ideas → Programmes → Impact</p>
                <p>Thus, the camp will function not merely as an orientation programme, but as a creative laboratory for developing WAFY's future programmes.</p>
              </div>

              <div style={{ marginBottom: '32px' }}>
                <h4 style={{ color: 'var(--foreground)', fontSize: '1.1rem', fontWeight: '700', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ width: '24px', height: '2px', background: 'var(--primary)' }}></span>
                  Thematic Brainstorming
                </h4>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
                  {[
                    { title: 'State Committee', desc: 'Develop innovative, large-scale flagship programmes for the educational and intellectual empowerment of the Muslim Ummah.' },
                    { title: 'District Committees', desc: 'Strengthen district and constituency-level activities and transform constituencies into active centres of leadership and social engagement.' },
                    { title: 'Social Empowerment Mission', desc: 'Design training programmes for human development, leadership, life skills, employability and social responsibility.' },
                    { title: 'WAY Book', desc: 'Identify and nurture thinkers, writers and intellectual contributors among WAFY graduates.' },
                    { title: 'WAY Media', desc: 'Develop presenters, communicators and media talents through innovative media and digital platforms.' },
                    { title: 'Higher Education Council', desc: 'Create pathways for higher education, competitive examinations, high-profile government jobs and professional opportunities.' },
                    { title: 'National Empowerment Mission', desc: 'Expand and replicate WAFY\\'s educational empowerment initiatives for rural and underserved communities across India.' },
                    { title: 'Debate Council', desc: 'Function as an academic think tank, organising consultations, debates and intellectual forums on contemporary issues and generating informed perspectives and recommendations.' }
                  ].map((item, idx) => (
                    <div key={idx} style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                      <div style={{ color: 'var(--primary)', fontWeight: '700', fontSize: '0.9rem', marginBottom: '8px' }}>{item.title}</div>
                      <div style={{ color: '#475569', fontSize: '0.85rem', lineHeight: '1.6' }}>{item.desc}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
                <div>
                  <h4 style={{ color: 'var(--foreground)', fontSize: '1.1rem', fontWeight: '700', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ width: '24px', height: '2px', background: 'var(--primary)' }}></span>
                    Expected Outcome
                  </h4>
                  <p style={{ marginBottom: '12px', fontSize: '0.9rem' }}>Every committee should ideally leave the camp with a clear two-year action direction:</p>
                  <ul style={{ paddingLeft: '0', listStyleType: 'none', margin: '0', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {['A vision for its area of responsibility', 'Key challenges and opportunities', 'Innovative programme ideas', 'Priority initiatives and flagship programmes', 'A preliminary implementation plan', 'Possible collaborators and resource persons'].map((li, i) => (
                      <li key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                        <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>•</span>
                        <span style={{ fontSize: '0.9rem', color: '#475569' }}>{li}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 style={{ color: 'var(--foreground)', fontSize: '1.1rem', fontWeight: '700', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ width: '24px', height: '2px', background: 'var(--primary)' }}></span>
                    Objectives of the Camp
                  </h4>
                  <ul style={{ paddingLeft: '0', listStyleType: 'none', margin: '0', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {['Orient newly elected leaders towards purposeful and visionary leadership.', 'Identify challenges and develop innovative solutions through collective action.', 'Design state, district and specialised flagship programmes and initiatives.', 'Strengthen grassroots leadership and activate district and constituency committees.', 'Create pathways to higher education, competitive examinations and professional excellence.', 'Extend educational empowerment to rural and underserved communities.', 'Develop a clear two-year vision, priorities and action framework for the new leadership.'].map((li, i) => (
                      <li key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                        <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>•</span>
                        <span style={{ fontSize: '0.9rem', color: '#475569' }}>{li}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

            </div>
          )}
        </div>\n\n        `;

page = page.replace(originalNote, newNote);
fs.writeFileSync('src/app/register/page.tsx', page);
console.log('Concept note redesigned successfully!');
