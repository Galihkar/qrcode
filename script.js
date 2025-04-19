let qr;

document.getElementById('generateBtn').addEventListener('click', () => {
  const url = document.getElementById('urlInput').value.trim();
  const logoFile = document.getElementById('logoInput').files[0];
  const qrcodeContainer = document.getElementById('qrcode');
  const downloadBtn = document.getElementById('downloadBtn');
  const linecolor = document.getElementById('linecolor').value;
  const backcolor = document.getElementById('backcolor').value;

  if (!url) {
    alert("Please enter a valid URL.");
    return;
  }

  qrcodeContainer.innerHTML = "";
  downloadBtn.hidden = true;

  const tempDiv = document.createElement("div");
  qrcodeContainer.appendChild(tempDiv);

  const qr = new QRCode(tempDiv, {
    text: url,
    width: 256,
    height: 256,
    colorDark: linecolor,
    colorLight: backcolor,
    correctLevel: QRCode.CorrectLevel.H
  });

  setTimeout(() => {
    const imgTag = tempDiv.querySelector("img");
    if (!imgTag) return;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = imgTag.naturalWidth;
    canvas.height = imgTag.naturalHeight;

    ctx.drawImage(imgTag, 0, 0);

    if (logoFile) {
      const reader = new FileReader();
      reader.onload = function (e) {
        const logo = new Image();
        logo.onload = function () {
          // Tentukan ukuran logo relatif terhadap QR
          const maxLogoSize = canvas.width * 0.25;
          let logoWidth = logo.width;
          let logoHeight = logo.height;

          // Skala proporsional
          const scale = Math.min(maxLogoSize / logoWidth, maxLogoSize / logoHeight);
          logoWidth *= scale;
          logoHeight *= scale;

          const x = (canvas.width - logoWidth) / 2;
          const y = (canvas.height - logoHeight) / 2;

          // Tambahkan border putih
          const padding = 8;
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(x - padding, y - padding, logoWidth + 2 * padding, logoHeight + 2 * padding);

          // Gambar logo
          ctx.drawImage(logo, x, y, logoWidth, logoHeight);

          qrcodeContainer.innerHTML = "";
          qrcodeContainer.appendChild(canvas);

          downloadBtn.href = canvas.toDataURL("image/png");
          downloadBtn.hidden = false;
        };
        logo.src = e.target.result;
      };
      reader.readAsDataURL(logoFile);
    } else {
      qrcodeContainer.innerHTML = "";
      qrcodeContainer.appendChild(canvas);

      downloadBtn.href = canvas.toDataURL("image/png");
      downloadBtn.hidden = false;
    }
  }, 300);
});
