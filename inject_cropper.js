const fs = require('fs');
let code = fs.readFileSync('src/app/registration-form/page.tsx', 'utf8');

if (!code.includes("import Cropper")) {
  code = code.replace(
    /import \{ useRouter \} from 'next\/navigation';/,
    `import { useRouter } from 'next/navigation';\nimport Cropper from 'react-easy-crop';`
  );
}

// Inject getCroppedImg helper
if (!code.includes("getCroppedImg")) {
  code = code.replace(
    /export default function RegistrationForm\(\) \{/,
    `const getCroppedImg = async (imageSrc: string, pixelCrop: any): Promise<string> => {
  const image = new Image();
  image.src = imageSrc;
  await new Promise((resolve) => (image.onload = resolve));
  const canvas = document.createElement('canvas');
  canvas.width = 400;
  canvas.height = 400;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      400,
      400
    );
  }
  return canvas.toDataURL('image/jpeg', 0.8);
};

export default function RegistrationForm() {`
  );
}

// State variables for cropper
code = code.replace(
  /const \[photoBase64, setPhotoBase64\] = useState\(''\);/,
  `const [photoBase64, setPhotoBase64] = useState('');
  const [photoRaw, setPhotoRaw] = useState('');
  const [showCropper, setShowCropper] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);`
);

// Replace handlePhotoUpload
const oldUpload = `  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const size = Math.min(img.width, img.height);
          canvas.width = 400;
          canvas.height = 400;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            const startX = (img.width - size) / 2;
            const startY = (img.height - size) / 2;
            ctx.drawImage(img, startX, startY, size, size, 0, 0, 400, 400);
            setPhotoBase64(canvas.toDataURL('image/jpeg', 0.8));
          }
        };
        img.src = reader.result as string;
      };
      reader.readAsDataURL(file);
    } else {
      setPhotoFileName('');
      setPhotoBase64('');
    }
  };`;

const newUpload = `  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoRaw(reader.result as string);
        setShowCropper(true);
      };
      reader.readAsDataURL(file);
    } else {
      setPhotoFileName('');
      setPhotoRaw('');
      setPhotoBase64('');
    }
  };

  const onCropComplete = (croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const saveCrop = async () => {
    try {
      const croppedImage = await getCroppedImg(photoRaw, croppedAreaPixels);
      setPhotoBase64(croppedImage);
      setShowCropper(false);
    } catch (e) {
      console.error(e);
    }
  };`;

code = code.replace(oldUpload, newUpload);

// Add the cropper modal before the <form> return
code = code.replace(
  /<form onSubmit=\{handleSubmit\}/,
  `{showCropper && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', zIndex: 9999, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ position: 'relative', width: '90%', maxWidth: '400px', height: '400px', background: '#333' }}>
            <Cropper
              image={photoRaw}
              crop={crop}
              zoom={zoom}
              aspect={1}
              cropShape="round"
              showGrid={false}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
          </div>
          <div style={{ padding: '20px', width: '90%', maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <input
              type="range"
              value={zoom}
              min={1}
              max={3}
              step={0.1}
              aria-labelledby="Zoom"
              onChange={(e) => setZoom(Number(e.target.value))}
              style={{ width: '100%' }}
            />
            <div style={{ display: 'flex', gap: '12px' }}>
              <button type="button" onClick={() => setShowCropper(false)} style={{ flex: 1, padding: '12px', background: '#475569', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>Cancel</button>
              <button type="button" onClick={saveCrop} style={{ flex: 1, padding: '12px', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>Save Crop</button>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit}`
);

fs.writeFileSync('src/app/registration-form/page.tsx', code);
console.log('Cropper installed and injected!');
