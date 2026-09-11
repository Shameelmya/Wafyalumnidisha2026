const fs = require('fs');
let page = fs.readFileSync('src/app/page.tsx', 'utf8');
let registerPage = fs.readFileSync('src/app/register/page.tsx', 'utf8');

// 1. Extract Concept Note and Schedule blocks from page.tsx
const conceptNoteStart = page.indexOf('{/* Concept Note */}');
const registerButtonStart = page.indexOf('{/* Register Button */}');
const blocksToMove = page.substring(conceptNoteStart, registerButtonStart);

// 2. Extract ScheduleItem function
const scheduleItemStart = page.indexOf('function ScheduleItem');
const scheduleItemCode = page.substring(scheduleItemStart);

// 3. Remove them from page.tsx
page = page.replace(blocksToMove, '');
page = page.replace(scheduleItemCode, '');
// Also remove showNote and showSchedule states from page.tsx
page = page.replace(/  const \[showNote, setShowNote\] = useState\(false\);\n/g, '');
page = page.replace(/  const \[showSchedule, setShowSchedule\] = useState\(false\);\n/g, '');

fs.writeFileSync('src/app/page.tsx', page);

// 4. Inject into registerPage
// Add showNote, showSchedule, showForm states
const stateInjection = "  const [showNote, setShowNote] = useState(false);\n  const [showSchedule, setShowSchedule] = useState(false);\n  const [showForm, setShowForm] = useState(false);\n";
registerPage = registerPage.replace("const [error, setError] = useState('');", "const [error, setError] = useState('');\n" + stateInjection);

// Replace <h1> and inject blocks
const blockInjection = `
      <h1 style={{ marginBottom: '24px', textAlign: 'center' }}>Conclave Registration</h1>
      
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '32px' }}>
` + blocksToMove + `
      </div>

      {!showForm ? (
        <button onClick={() => setShowForm(true)} className="btn-primary" style={{ marginBottom: '40px', padding: '20px', fontSize: '1.2rem' }}>
          Register Now
        </button>
      ) : (
`;

registerPage = registerPage.replace("<h1 style={{ marginBottom: '32px', textAlign: 'center' }}>Conclave Registration</h1>", blockInjection);

// Wrap form in closing tag
const closingInjection = `</form>
      )}
`;
registerPage = registerPage.replace("</form>", closingInjection);

// Add ScheduleItem
registerPage += '\n' + scheduleItemCode;

fs.writeFileSync('src/app/register/page.tsx', registerPage);
console.log('Done moving blocks.');
