const fs = require('fs');

let ticket = fs.readFileSync('src/app/ticket/[id]/page.tsx', 'utf8');

// Replace any styling on the photo image to enforce a rounded circle and objectFit cover.
ticket = ticket.replace(
  /<img\s+src=\{participant\.photoUrl \|\| '\/dummy-face\.png'\}\s+alt="Profile"\s+style={{([^}]*)}}/g,
  '<img src={participant.photoUrl || \\'/dummy-face.png\\'} alt="Profile" style={{ width: "120px", height: "120px", borderRadius: "50%", objectFit: "cover", margin: "0 auto", display: "block"'
);

// We should also replace the parent div if it has any conflicting border radius or styles, 
// but simply setting objectFit and borderRadius on the image is enough.

fs.writeFileSync('src/app/ticket/[id]/page.tsx', ticket);
console.log('Ticket image updated!');
