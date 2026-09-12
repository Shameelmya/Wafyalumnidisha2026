const fs = require('fs');

// 1. Update registration-form/page.tsx (Districts)
let formPage = fs.readFileSync('src/app/registration-form/page.tsx', 'utf8');

const oldDistrictsList = /const districtsList = \[[\s\S]*?\];/;
const newDistrictsList = `const districtsList = [
  "Alappuzha", "Ernakulam", "Idukki & Kottayam", "Kannur", "Kasaragod",
  "Kollam", "Kozhikode", "Malappuram East", "Malappuram West", "Palakkad",
  "Pathanamthitta", "Thiruvananthapuram", "Thrissur", "Wayanad", "Karnataka", "Other"
];`;

formPage = formPage.replace(oldDistrictsList, newDistrictsList);
fs.writeFileSync('src/app/registration-form/page.tsx', formPage);

// 2. Update register/page.tsx (Schedule)
let regPage = fs.readFileSync('src/app/register/page.tsx', 'utf8');

const newSchedule = `                  <tr>
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
`;

// use a regular expression to replace everything between <tbody> and </tbody>
regPage = regPage.replace(/<tbody>[\s\S]*?<\/tbody>/, '<tbody>\n' + newSchedule + '                </tbody>');

fs.writeFileSync('src/app/register/page.tsx', regPage);
console.log('Update applied');
