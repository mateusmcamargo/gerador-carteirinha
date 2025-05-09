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
    try {
      const fundo = new Image();
      fundo.src = 'https://mateusmcamargo.github.io/code-generator/img.png';
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
        try {
          ctx.drawImage(qrCanvas, posX, posY);
        } catch (err) {
          console.error('Erro ao desenhar QR code:', err);
        }
      }
  
      if (usarBarra && textoBarra.trim()) {
        const barcodeCanvas = document.createElement('canvas');
        barcodeCanvas.getContext('2d'); // força contexto
        try {
          JsBarcode(barcodeCanvas, textoBarra, {
            format: 'CODE128',
            width: 5.81,
            height: 63,
            displayValue: false,
          });
          const posX = finalCanvas.width - barcodeCanvas.width - 63;
          const posY = finalCanvas.height - barcodeCanvas.height - 139;
          ctx.drawImage(barcodeCanvas, posX, posY);
        } catch (err) {
          console.error('Erro ao desenhar código de barras:', err);
        }
      }
  
      setGerado(true);
    } catch (erroFinal) {
      console.error('Erro geral na geração da imagem:', erroFinal);
    }
  };  

  const baixarImagem = () => {
    const link = document.createElement('a');
    link.download = 'carteirinha.png';
    link.href = canvasRef.current.toDataURL();
    link.click();
  };

  return (
    <div style={{ textAlign: 'center', padding: '2rem' }}>
      <h1>carteirinha com qr code e codigo de barras</h1>

      <div style={{ marginBottom: '1rem' }}>
        <label>
          <input
            type="checkbox"
            checked={usarQR}
            onChange={() => setUsarQR(!usarQR)}
          />{' '}
          incluir matricula
        </label>
        <br />
        <input
          type="text"
          placeholder="matricula"
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
          incluir RA
        </label>
        <br />
        <input
          type="text"
          placeholder="RA"
          value={textoBarra}
          onChange={(e) => setTextoBarra(e.target.value)}
          style={{ padding: '0.5rem', width: '60%', marginTop: '0.5rem' }}
        />
      </div>

      <button onClick={gerarImagem} style={{ padding: '0.5rem 1rem' }}>
        gerar carteirinha
      </button>
      <br /><br />

      <canvas ref={canvasRef} style={{ border: '1px solid #ccc' }}></canvas>
      <br /><br />

      {gerado && (
        <button onClick={baixarImagem} style={{ padding: '0.5rem 1rem' }}>
          baixar carteirinha
        </button>
      )}
    </div>
  );
}

export default App;
