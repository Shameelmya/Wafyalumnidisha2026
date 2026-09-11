const fs = require('fs');

let page = fs.readFileSync('src/app/registration-form/page.tsx', 'utf8');

// 1. Add getDoc to the import list
page = page.replace(
  /import \{ doc, getDocs, setDoc, serverTimestamp, runTransaction, collection \} from 'firebase\/firestore';/,
  "import { doc, getDoc, getDocs, setDoc, serverTimestamp, runTransaction, collection } from 'firebase/firestore';"
);

// 2. Replace the O(N) duplicate check with an O(1) check
const oldCheck = `      const qSnap = await getDocs(collection(db, 'registrations'));
      let isDuplicate = false;
      qSnap.forEach(docSnap => {
        if (normalizePhone(docSnap.id) === normPhone || normalizePhone(docSnap.data().phone || '') === normPhone) {
          isDuplicate = true;
        }
      });

      if (isDuplicate) {
        setError('Phone number is already registered.');
        setLoading(false);
        return;
      }

      const docRef = doc(db, 'registrations', normPhone);`;

const newCheck = `      const docRef = doc(db, 'registrations', normPhone);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setError('This phone number is already registered!');
        setLoading(false);
        return;
      }`;

page = page.replace(oldCheck, newCheck);

fs.writeFileSync('src/app/registration-form/page.tsx', page);
console.log('Fixed slow duplicate check logic!');
