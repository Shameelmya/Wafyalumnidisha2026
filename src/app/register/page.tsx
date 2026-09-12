"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

function ScheduleItem({ time, title, desc, tag, isBreak }: { time: string, title: string, desc?: string, tag?: string, isBreak?: boolean }) {
  return (
    <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
      <td style={{ padding: '16px 12px', verticalAlign: 'top', width: '100px', fontWeight: '700', color: 'var(--primary)', fontSize: '0.9rem' }}>
        {time}
      </td>
      <td style={{ padding: '16px 12px', verticalAlign: 'top', position: 'relative' }}>
        <div style={{ position: 'absolute', left: 0, top: '24px', bottom: '24px', width: '2px', background: isBreak ? '#e2e8f0' : 'var(--primary)', opacity: isBreak ? 0.5 : 0.2 }}></div>
        <div style={{ paddingLeft: '16px' }}>
          {tag && <div style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--primary)', letterSpacing: '0.05em', marginBottom: '4px', textTransform: 'uppercase' }}>{tag}</div>}
          <div style={{ fontSize: isBreak ? '0.9rem' : '1.05rem', fontWeight: isBreak ? '500' : '700', color: isBreak ? '#94a3b8' : 'var(--foreground)', fontFamily: '"Noto Serif Malayalam", serif', display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '6px' }}>
            {title} {desc && <span style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: '500' }}>{desc}</span>}
          </div>
        </div>
      </td>
    </tr>
  );
}

export default function ConceptPage() {
  const router = useRouter();
  const [showNote, setShowNote] = useState(true);
  const [showSchedule, setShowSchedule] = useState(false);

  return (
    <div className="container animate-fade-in" style={{ paddingTop: '40px', paddingBottom: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      
      <button onClick={() => router.push('/')} style={{ background: 'transparent', color: 'var(--primary-alt)', fontWeight: '600', marginBottom: '24px', fontSize: '1rem', padding: '0', border: 'none', cursor: 'pointer', alignSelf: 'flex-start' }}>
        &larr; Home
      </button>

      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '40px' }}>
        
        {/* Concept Note */}
        <div style={{ background: 'var(--card-bg)', borderRadius: '16px', padding: '24px 32px', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)', border: '1px solid #f1f5f9' }}>
          <button 
            onClick={() => setShowNote(!showNote)} 
            style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'transparent', color: 'var(--foreground)', fontSize: '1.25rem', fontWeight: '700', border: 'none', cursor: 'pointer', padding: 0 }}
          >
            What's Disha 2026?
            <span style={{ fontSize: '1.5rem', fontWeight: '300', color: 'var(--primary)', lineHeight: 1 }}>{showNote ? '-' : '+'}</span>
          </button>
          
          {showNote && (
            <div style={{ marginTop: '32px', fontSize: '0.95rem', lineHeight: '1.7', color: 'var(--secondary-text)' }}>
              
              <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                <h3 style={{ color: 'var(--primary)', marginBottom: '8px', fontSize: '1.5rem', fontWeight: '800', lineHeight: '1.2' }}>DISHA 2026<br/>WAFY LEADERS MEET</h3>
                <p style={{ fontWeight: '500', color: 'var(--foreground)', fontSize: '0.9rem', marginBottom: '12px', textAlign: 'justify', hyphens: 'auto', WebkitHyphens: 'auto', textJustify: 'inter-word' }}></p>
                <div style={{ display: 'inline-block', fontSize: '0.85rem', fontWeight: '600', color: '#475569' }}>
                  12 & 13 September 2026 <br/> Neebar Gate Natural Resort, Kakkadampoyil
                </div>
                <div style={{ marginTop: '24px', borderBottom: '1px solid #e2e8f0', width: '50%', margin: '24px auto 0' }}></div>
              </div>

              <div style={{ marginBottom: '32px' }}>
                <p style={{ marginBottom: '16px', textAlign: 'justify', hyphens: 'auto', WebkitHyphens: 'auto', textJustify: 'inter-word' }}>Leadership is not merely managing an organisation; it is the ability to visualise possibilities, identify needs, inspire people and transform ideas into meaningful action.</p>
                <p style={{ marginBottom: '24px', textAlign: 'justify', hyphens: 'auto', WebkitHyphens: 'auto', textJustify: 'inter-word' }}>DISHA 2026 is conceived as a two-day orientation and vision-building camp for the newly elected WAFY leaders, marking the beginning of their two-year tenure. The camp aims to inspire leaders to think beyond routine activities and envision innovative initiatives for the educational, intellectual and social empowerment of the WAFY community and society at large.</p>
                
                <p style={{ marginBottom: '12px', color: 'var(--foreground)', fontWeight: '700', textAlign: 'justify', hyphens: 'auto', WebkitHyphens: 'auto', textJustify: 'inter-word' }}>The Central Question of DISHA</p>
                <p style={{ marginBottom: '24px', fontWeight: '500', color: '#334155', textAlign: 'justify', hyphens: 'auto', WebkitHyphens: 'auto', textJustify: 'inter-word' }}>“What meaningful difference can we create during our two-year tenure?”</p>
                
                <p style={{ marginBottom: '16px', textAlign: 'justify', hyphens: 'auto', WebkitHyphens: 'auto', textJustify: 'inter-word' }}>Participants will come prepared to think, brainstorm and design. Each committee will examine the needs and opportunities within its area, develop innovative ideas and translate them into programmes that can create sustainable impact.</p>
              </div>

              <div style={{ marginBottom: '32px' }}>
                <h4 style={{ color: 'var(--foreground)', fontSize: '1.1rem', fontWeight: '700', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ width: '20px', height: '2px', background: 'var(--primary)' }}></span>
                  The DISHA Approach
                </h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px', justifyContent: 'center', alignItems: 'center' }}>
                   {['Think', 'Brainstorm', 'Design', 'Commit'].map((step, idx) => (
                     <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ color: 'var(--primary)', fontWeight: '700', fontSize: '0.9rem' }}>{step}</div>
                        {idx !== 3 && <div style={{ color: '#cbd5e1', fontWeight: '400', fontSize: '0.8rem' }}>→</div>}
                     </div>
                   ))}
                </div>
                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                  <p style={{ fontWeight: '600', color: '#64748b', marginBottom: '4px', textAlign: 'justify', hyphens: 'auto', WebkitHyphens: 'auto', textJustify: 'inter-word' }}>DISHA seeks to move:</p>
                  <p style={{ fontWeight: '500', color: 'var(--foreground)', textAlign: 'justify', hyphens: 'auto', WebkitHyphens: 'auto', textJustify: 'inter-word' }}>Leadership → Vision → Ideas → Programmes → Impact</p>
                </div>
                <p>Thus, the camp will function not merely as an orientation programme, but as a creative laboratory for developing WAFY's future programmes.</p>
              </div>

              <div style={{ marginBottom: '40px' }}>
                <h4 style={{ color: 'var(--foreground)', fontSize: '1.1rem', fontWeight: '700', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ width: '20px', height: '2px', background: 'var(--primary)' }}></span>
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
                    { title: 'National Empowerment Mission', desc: 'Expand and replicate WAFY\'s educational empowerment initiatives for rural and underserved communities across India.' },
                    { title: 'Debate Council', desc: 'Function as an academic think tank, organising consultations, debates and intellectual forums on contemporary issues and generating informed perspectives and recommendations.' }
                  ].map((item, idx) => (
                    <div key={idx} style={{ background: '#ffffff', border: '1px solid #f1f5f9', borderRadius: '12px', padding: '20px' }}>
                      <div style={{ color: 'var(--primary)', fontWeight: '700', fontSize: '0.9rem', marginBottom: '8px' }}>{item.title}</div>
                      <div style={{ color: '#64748b', fontSize: '0.85rem', lineHeight: '1.6' }}>{item.desc}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px' }}>
                <div>
                  <h4 style={{ color: 'var(--foreground)', fontSize: '1.1rem', fontWeight: '700', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ width: '20px', height: '2px', background: 'var(--primary)' }}></span>
                    Expected Outcome
                  </h4>
                  <p style={{ marginBottom: '16px', fontSize: '0.9rem', textAlign: 'justify', hyphens: 'auto', WebkitHyphens: 'auto', textJustify: 'inter-word' }}>Every committee should ideally leave the camp with a clear two-year action direction:</p>
                  <ul style={{ paddingLeft: "0", listStyleType: "none", margin: "0", display: "flex", flexDirection: "column", gap: "6px", textAlign: "left" }}>
                    {['A vision for its area of responsibility', 'Key challenges and opportunities', 'Innovative programme ideas', 'Priority initiatives and flagship programmes', 'A preliminary implementation plan', 'Possible collaborators and resource persons'].map((li, i) => (
                      <li key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                        <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>•</span>
                        <span style={{ fontSize: '0.9rem', color: '#475569', lineHeight: '1.5' }}>{li}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 style={{ color: 'var(--foreground)', fontSize: '1.1rem', fontWeight: '700', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ width: '20px', height: '2px', background: 'var(--primary)' }}></span>
                    Objectives of the Camp
                  </h4>
                  <ul style={{ paddingLeft: "0", listStyleType: "none", margin: "0", display: "flex", flexDirection: "column", gap: "6px", textAlign: "left" }}>
                    {['Orient newly elected leaders towards purposeful and visionary leadership.', 'Identify challenges and develop innovative solutions through collective action.', 'Design state, district and specialised flagship programmes and initiatives.', 'Strengthen grassroots leadership and activate district and constituency committees.', 'Create pathways to higher education, competitive examinations and professional excellence.', 'Extend educational empowerment to rural and underserved communities.', 'Develop a clear two-year vision, priorities and action framework for the new leadership.'].map((li, i) => (
                      <li key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                        <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>•</span>
                        <span style={{ fontSize: '0.9rem', color: '#475569', lineHeight: '1.5' }}>{li}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

            </div>
          )}
        </div>

        {/* Schedule */}
        <div style={{ background: 'var(--card-bg)', borderRadius: '16px', padding: '24px 32px', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)', border: '1px solid #f1f5f9' }}>
          <button 
            onClick={() => setShowSchedule(!showSchedule)} 
            style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'transparent', color: 'var(--foreground)', fontSize: '1.25rem', fontWeight: '700', border: 'none', cursor: 'pointer', padding: 0 }}
          >
            Programme Schedule
            <span style={{ fontSize: '1.5rem', fontWeight: '300', color: 'var(--primary)', lineHeight: 1 }}>{showSchedule ? '-' : '+'}</span>
          </button>
          
          {showSchedule && (
            <div style={{ marginTop: '32px' }}>
              

              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <tbody>
                  <tr>
    <td colSpan={2} style={{ padding: '32px 0 24px 0' }}>
      <div style={{ background: 'var(--primary)', color: 'white', padding: '12px 24px', borderRadius: '12px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>Day 1</span>
        <span style={{ fontWeight: '300', fontSize: '0.95rem', opacity: 0.9 }}>- 12 Sep 2026</span>
      </div>
    </td>
  </tr>
                  <ScheduleItem time="01:30 PM" title="റിപ്പോർട്ടിംഗ്" />
                  <ScheduleItem time="02:00 PM" title="രജിസ്ട്രേഷൻ" />
                  <ScheduleItem time="02:30 PM" tag="Session 01" title="പഥം" desc="🎙️ ഡോ. നൗഫൽ വാഫി മേലാറ്റൂർ (ക്യാമ്പ് ഡയറക്ടർ)" />
                  <ScheduleItem time="02:45 PM" tag="Session 02" title="ദർശനം" desc="🎙️ ഡോ. ഇദ് രീസ്" />
                  <ScheduleItem time="04:00 PM" title="(ബ്രേക്ക്)" isBreak />
                  <ScheduleItem time="04:15 PM" tag="Session 03" title="സ്പർശം" desc="🎙️ അബൂബക്കർ ഹുദവി" />
                  <ScheduleItem time="05:30 PM" title="പ്രാർത്ഥന, ചായ, ഉല്ലാസം" isBreak />
                  <ScheduleItem time="07:00 PM" tag="Session 04" title="വശ്യം" desc="🎙️ ഡോ.അബ്ദുൽ ബർറ് വാഫി" />
                  <ScheduleItem time="07:30 PM" tag="Session 05" title="ദീപ്തി" desc="🎙️ ഉസ്താദ് അബ്ദുൽ ഹക്കീം ഫൈസി ആദൃശ്ശേരി" />
                  <ScheduleItem time="09:00 PM" title="പ്രാർത്ഥന, ഭക്ഷണം" isBreak />
                  <ScheduleItem time="10:00 PM" tag="Session 06" title="സ്ഫുരണം" desc="🎙️ ഡോ.അലി ഹുസൈൻ വാഫി" />
                  
                  <tr>
    <td colSpan={2} style={{ padding: '32px 0 24px 0' }}>
      <div style={{ background: 'var(--primary)', color: 'white', padding: '12px 24px', borderRadius: '12px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>Day 2</span>
        <span style={{ fontWeight: '300', fontSize: '0.95rem', opacity: 0.9 }}>- 13 Sep 2026</span>
      </div>
    </td>
  </tr>
                  
                  <ScheduleItem time="05:00 AM" title="പ്രാർത്ഥന" isBreak />
                  <ScheduleItem time="06:00 AM" tag="Session 07" title="ദൃശ്യം" desc="(Morning Vibe)" />
                  <ScheduleItem time="08:00 AM" title="പ്രഭാത ഭക്ഷണം" isBreak />
                  <ScheduleItem time="08:30 AM" tag="Session 07" title="ദിശൻ" desc="(ബ്രെയിൻ സ്റ്റോമിംഗ്)" />
                  <ScheduleItem time="10:00 AM" title="(Break)" isBreak />
                  <ScheduleItem time="10:15 AM" tag="Session 09" title="സമന്വയം" desc="(ചർച്ച)" />
                  <ScheduleItem time="11:30 AM" tag="Session 10" title="സമാപ്തി" desc="(ക്ലോസിങ് സെറിമണി)" />
                </tbody>
              </table>
            </div>
          )}
        </div>
        
      </div>

      <button onClick={() => router.push('/registration-form')} className="btn-primary" style={{ marginBottom: '40px', padding: '20px', fontSize: '1.2rem' }}>
        Register Now
      </button>

    </div>
  );
}
