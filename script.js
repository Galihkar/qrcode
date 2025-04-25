// script.js
import { BrowserMultiFormatReader } from 'https://cdn.jsdelivr.net/npm/@zxing/browser@0.0.10/+esm';

let qrCode;
const { jsPDF } = window.jspdf;

// Generator Logic
const generateBtn = document.getElementById('generateBtn');
const downloadPNG = document.getElementById('downloadPNG');
const downloadJPG = document.getElementById('downloadJPG');
const downloadPDF = document.getElementById('downloadPDF');

if (generateBtn) {
  generateBtn.addEventListener('click', () => {
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

  downloadPNG.addEventListener('click', async () => {
    if (qrCode) {
      const blob = await qrCode.getRawData("png");
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "qr-code.png";
      link.click();
      URL.revokeObjectURL(url);
    }
  });

  downloadJPG.addEventListener('click', async () => {
    if (qrCode) {
      const blob = await qrCode.getRawData("jpeg");
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "qr-code.jpg";
      link.click();
      URL.revokeObjectURL(url);
    }
  });

  downloadPDF.addEventListener('click', async () => {
    if (qrCode) {
      const blob = await qrCode.getRawData("png");
      const url = URL.createObjectURL(blob);
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const qrSize = 80;
      const x = (pageWidth - qrSize) / 2;
      pdf.addImage(url, 'PNG', x, 40, qrSize, qrSize);
      pdf.save('qr-code.pdf');
      URL.revokeObjectURL(url);
    }
  });
}

// Decoder Logic
const barcodeInput = document.getElementById('barcodeInput');
const resultContainer = document.getElementById('result');

if (barcodeInput) {
  barcodeInput.addEventListener('change', async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const imageUrl = URL.createObjectURL(file);
    const img = new Image();
    img.src = imageUrl;
    img.classList.add('img-thumbnail', 'my-3');
    resultContainer.innerHTML = '';
    resultContainer.appendChild(img);

    img.onload = async () => {
      try {
        const reader = new BrowserMultiFormatReader();
        const result = await reader.decodeFromImageElement(img);
        resultContainer.innerHTML += `
          <div class="table-responsive">
            <table class="table table-bordered">
              <tr><th>Raw Text</th><td>${result.text}</td></tr>
              <tr><th>Barcode Format</th><td>${result.barcodeFormat}</td></tr>
              <tr><th>Result Metadata</th><td>${JSON.stringify(result.resultMetadata || {}, null, 2)}</td></tr>
            </table>
          </div>`;
      } catch (err) {
        resultContainer.innerHTML += `<div class="alert alert-danger">Gagal decode gambar: ${err.message}</div>`;
      }
    };
  });
}

// Auto-generate default QR
window.addEventListener('DOMContentLoaded', () => {
  const urlInput = document.getElementById('urlInput');
  const generateBtn = document.getElementById('generateBtn');
  if (urlInput && generateBtn) {
    urlInput.value = "https://instagram.com/galihkaruniap";
    generateBtn.click();
    urlInput.value = "";
  }
});
