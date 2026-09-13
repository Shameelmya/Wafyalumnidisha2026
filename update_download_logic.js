const fs = require('fs');

let page = fs.readFileSync('src/app/frame/page.tsx', 'utf8');

const oldFunctions = `  const handleDownload = async () => {
    if (exportRef.current) {
      const canvas = await html2canvas(exportRef.current, {
        scale: 4, 
        useCORS: true,
        allowTaint: true,
        backgroundColor: null
      });
      const image = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = image;
      link.download = \`Framed_Photo.png\`;
      link.click();
    }
  };

  const handleShare = async () => {
    if (exportRef.current && navigator.share) {
      const canvas = await html2canvas(exportRef.current, {
        scale: 4,
        useCORS: true,
        allowTaint: true,
        backgroundColor: null
      });
      canvas.toBlob(async (blob) => {
        if (blob) {
          const file = new File([blob], \`Framed_Photo.png\`, { type: 'image/png' });
          try {
            await navigator.share({
              title: 'DISHA 2026',
              text: 'Check out my DISHA 2026 framed photo!',
              files: [file]
            });
          } catch (err) {
            console.error('Share failed', err);
          }
        }
      });
    } else {
      alert("Sharing is not supported on this device/browser.");
    }
  };`;

const newFunctions = `  const generateHighQualityImage = async (): Promise<Blob | null> => {
    if (!photo) return null;
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        const frameImg = new Image();
        frameImg.crossOrigin = "anonymous";
        if (frameType === 'none') {
           resolve(null);
           return;
        }
        
        frameImg.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = frameImg.width;
          canvas.height = frameImg.height;
          const ctx = canvas.getContext("2d");
          if (!ctx) {
            resolve(null);
            return;
          }
          
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          const photoAspect = img.width / img.height;
          const frameAspect = canvas.width / canvas.height;
          
          let drawW, drawH, drawX, drawY;
          
          if (photoAspect > frameAspect) {
             drawH = canvas.height;
             drawW = img.width * (canvas.height / img.height);
             drawX = (canvas.width - drawW) / 2;
             drawY = 0;
          } else {
             drawW = canvas.width;
             drawH = img.height * (canvas.width / img.width);
             drawX = 0;
             drawY = (canvas.height - drawH) / 2;
          }

          ctx.save();
          
          const cx = canvas.width / 2;
          const cy = canvas.height / 2;
          
          ctx.translate(cx, cy);
          ctx.rotate((rotation * Math.PI) / 180);
          ctx.scale(zoom, zoom);
          ctx.translate((panX / 100) * canvas.width, (panY / 100) * canvas.height);
          ctx.translate(-cx, -cy);

          let filterStr = \`contrast(\${contrast}%) saturate(\${saturation}%) brightness(\${brightness}%)\`;
          if (temperature > 0) {
            filterStr += \` sepia(\${temperature}%) hue-rotate(-\${temperature / 2}deg)\`;
          } else if (temperature < 0) {
            const coolVal = Math.abs(temperature);
            filterStr += \` hue-rotate(\${coolVal / 2}deg) sepia(\${coolVal / 2}%) saturate(\${100 + coolVal}%)\`;
          }
          ctx.filter = filterStr;

          ctx.drawImage(img, drawX, drawY, drawW, drawH);
          ctx.restore();

          ctx.drawImage(frameImg, 0, 0, canvas.width, canvas.height);

          canvas.toBlob((blob) => {
            resolve(blob);
          }, 'image/png', 1.0);
        };
        
        frameImg.src = frameType === 'PTR' ? '/PTR.png' : '/LSC.png';
      };
      img.src = photo;
    });
  };

  const handleDownload = async () => {
    const blob = await generateHighQualityImage();
    if (blob) {
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = \`Framed_Photo.png\`;
      link.click();
      URL.revokeObjectURL(url);
    }
  };

  const handleShare = async () => {
    const blob = await generateHighQualityImage();
    if (blob && navigator.share) {
      const file = new File([blob], \`Framed_Photo.png\`, { type: 'image/png' });
      try {
        await navigator.share({
          title: 'DISHA 2026',
          text: 'Check out my DISHA 2026 framed photo!',
          files: [file]
        });
      } catch (err) {
        console.error('Share failed', err);
      }
    } else if (!navigator.share) {
      alert("Sharing is not supported on this device/browser.");
    }
  };`;

page = page.replace(oldFunctions, newFunctions);

fs.writeFileSync('src/app/frame/page.tsx', page);
console.log('Download logic updated to native Canvas generation for high quality');
