let qrCode;

document.getElementById('generateBtn').addEventListener('click', () => {
  const url = document.getElementById('urlInput').value.trim();
  const linecolor = document.getElementById('linecolor').value;
  const backcolor = document.getElementById('backcolor').value;
  const dotStyle = document.getElementById('dotStyle').value;
  const logoFile = document.getElementById('logoInput').files[0];
  const qrcodeContainer = document.getElementById('qrcode');
  const downloadSection = document.getElementById('downloadSection');
  const { jsPDF } = window.jspdf;


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

document.getElementById('downloadPNG').addEventListener('click', async () => {
  if (qrCode) {
    const blob = await qrCode.getRawData("png"); // Mendapatkan blob untuk PNG
    const url = URL.createObjectURL(blob); // Membuat URL untuk blob

    const link = document.createElement("a");
    link.href = url;
    link.download = "qr-code.png";
    link.click();

    // Menghapus object URL setelah selesai digunakan
    URL.revokeObjectURL(url);
  }
});

document.getElementById('downloadJPG').addEventListener('click', async () => {
  if (qrCode) {
    const blob = await qrCode.getRawData("jpeg"); // Mendapatkan blob untuk JPEG
    const url = URL.createObjectURL(blob); // Membuat URL untuk blob

    const link = document.createElement("a");
    link.href = url;
    link.download = "qr-code.jpg";
    link.click();

    // Menghapus object URL setelah selesai digunakan
    URL.revokeObjectURL(url);
  }
});

document.getElementById('downloadPDF').addEventListener('click', async () => {
  if (qrCode) {
    const blob = await qrCode.getRawData("png"); // Ambil blob PNG
    const url = URL.createObjectURL(blob); // Buat URL dari blob

    const { jsPDF } = window.jspdf; // Ekstrak jsPDF dari window.jspdf
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const qrSize = 80;
    const x = (pageWidth - qrSize) / 2;

    pdf.addImage(url, 'PNG', x, 40, qrSize, qrSize);
    pdf.save('qr-code.pdf');

    URL.revokeObjectURL(url);
  }
});

// Preview QR Code default saat halaman pertama dibuka
window.addEventListener('DOMContentLoaded', () => {
  document.getElementById('urlInput').value = "https://instagram.com/galihkaruniap";
  document.getElementById('generateBtn').click();
  document.getElementById('urlInput').value = "";
});
