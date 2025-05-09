import { useRef, useState } from 'react';
import QRCode from 'qrcode';
import JsBarcode from 'jsbarcode';

function App() {
  const [textoQR, setTextoQR] = useState('');
  const [textoBarra, setTextoBarra] = useState('');
  const [usarQR, setUsarQR] = useState(true);
  const [usarBarra, setUsarBarra] = useState(false);
  const [gerado, setGerado] = useState(false);
  const canvasRef = useRef();

  const gerarImagem = async () => {
    const fundo = new Image();
    fundo.src = '/sua-imagem.png'; // coloque sua imagem na pasta public/
    await fundo.decode();

    const finalCanvas = canvasRef.current;
    const ctx = finalCanvas.getContext('2d');
    finalCanvas.width = fundo.width;
    finalCanvas.height = fundo.height;
    ctx.drawImage(fundo, 0, 0);

    if (usarQR && textoQR.trim()) {
      const qrCanvas = document.createElement('canvas');
      await QRCode.toCanvas(qrCanvas, textoQR, { width: 204 });
      const posX = finalCanvas.width - qrCanvas.width - 63;
      const posY = finalCanvas.height - qrCanvas.height - 277;
      ctx.drawImage(qrCanvas, posX, posY);
    }

    if (usarBarra && textoBarra.trim()) {
      const barcodeCanvas = document.createElement('canvas');
      JsBarcode(barcodeCanvas, textoQR, {
        format: 'CODE128',
        width: 5.81,
        height: 63,
        displayValue: false,
      });
      const posX = finalCanvas.width - barcodeCanvas.width - 63;
      const posY = finalCanvas.height - barcodeCanvas.height - 139;
      ctx.drawImage(barcodeCanvas, posX, posY);
    }

    setGerado(true);
  };

  const baixarImagem = () => {
    const link = document.createElement('a');
    link.download = 'imagem_com_codigos.png';
    link.href = canvasRef.current.toDataURL();
    link.click();
  };

  return (
    <div style={{ textAlign: 'center', padding: '2rem' }}>
      <h1>Imagem com QR Code e Código de Barras</h1>

      <div style={{ marginBottom: '1rem' }}>
        <label>
          <input
            type="checkbox"
            checked={usarQR}
            onChange={() => setUsarQR(!usarQR)}
          />{' '}
          Incluir QR Code
        </label>
        <br />
        <input
          type="text"
          placeholder="Texto para QR Code"
          value={textoQR}
          onChange={(e) => setTextoQR(e.target.value)}
          style={{ padding: '0.5rem', width: '60%', marginTop: '0.5rem' }}
        />
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <label>
          <input
            type="checkbox"
            checked={usarBarra}
            onChange={() => setUsarBarra(!usarBarra)}
          />{' '}
          Incluir Código de Barras
        </label>
        <br />
        <input
          type="text"
          placeholder="Texto para Código de Barras"
          value={textoBarra}
          onChange={(e) => setTextoBarra(e.target.value)}
          style={{ padding: '0.5rem', width: '60%', marginTop: '0.5rem' }}
        />
      </div>

      <button onClick={gerarImagem} style={{ padding: '0.5rem 1rem' }}>
        Gerar Imagem
      </button>
      <br /><br />

      <canvas ref={canvasRef} style={{ border: '1px solid #ccc' }}></canvas>
      <br /><br />

      {gerado && (
        <button onClick={baixarImagem} style={{ padding: '0.5rem 1rem' }}>
          Baixar Imagem
        </button>
      )}
    </div>
  );
}

export default App;
