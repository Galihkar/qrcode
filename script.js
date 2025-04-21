let qrCode;

document.getElementById('generateBtn').addEventListener('click', () => {
  const url = document.getElementById('urlInput').value.trim();
  const linecolor = document.getElementById('linecolor').value;
  const backcolor = document.getElementById('backcolor').value;
  const dotStyle = document.getElementById('dotStyle').value;
  const logoFile = document.getElementById('logoInput').files[0];
  const qrcodeContainer = document.getElementById('qrcode');
  const downloadSection = document.getElementById('downloadSection');

  if (!url) {
    alert("Masukkan URL terlebih dahulu.");
    return;
  }

  qrcodeContainer.innerHTML = "";
  downloadSection.hidden = true;

  const generateQRCode = (logoImage = null) => {
    qrCode = new QRCodeStyling({
      width: 300,
      height: 300,
      type: "canvas",
      data: url,
      image: logoImage,
      dotsOptions: {
        color: linecolor,
        type: dotStyle
      },
      backgroundOptions: {
        color: backcolor
      },
      imageOptions: {
        crossOrigin: "anonymous",
        margin: 10
      }
    });

    qrCode.append(qrcodeContainer);
    downloadSection.hidden = false;
  };

  if (logoFile) {
    const reader = new FileReader();
    reader.onload = function (e) {
      generateQRCode(e.target.result);
    };
    reader.readAsDataURL(logoFile);
  } else {
    generateQRCode();
  }
});

document.getElementById('downloadPNG').addEventListener('click', () => {
  if (qrCode) {
    qrCode.download({ name: "qr-code", extension: "png" });
  }
});

document.getElementById('downloadJPG').addEventListener('click', async () => {
  if (qrCode) {
    const canvas = await qrCode.getRawData("jpeg");
    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/jpeg");
    link.download = "qr-code.jpg";
    link.click();
  }
});

document.getElementById('downloadPDF').addEventListener('click', async () => {
  if (qrCode) {
    const canvas = await qrCode.getRawData("png");
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const qrSize = 80;

    const x = (pageWidth - qrSize) / 2;
    pdf.addImage(imgData, 'PNG', x, 40, qrSize, qrSize);
    pdf.save('qr-code.pdf');
  }
});

// Preview QR Code default saat halaman pertama dibuka
window.addEventListener('DOMContentLoaded', () => {
  document.getElementById('urlInput').value = "https://instagram.com/galihkaruniap";
  document.getElementById('generateBtn').click();
  document.getElementById('urlInput').value = "";
});
