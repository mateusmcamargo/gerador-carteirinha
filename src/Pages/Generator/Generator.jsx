import { useRef, useState } from 'react';
import QRCode               from 'qrcode';
import JsBarcode            from 'jsbarcode';
import './generator.css';

export function Generator() {

    const [textRA,         setTextRA]         = useState('');
    const [generated,      setGenerated]      = useState(false);
    const [fileLoad,       setFileLoad]       = useState(false);
    const [isDragging,     setIsDragging]     = useState(false);
    const [fileName,       setFileName]       = useState('Clique para escolher uma imagem ou solte uma aqui...');
    const [name,           setName]           = useState('');
    const [course,         setCourse]         = useState('');
    const [downloadMethod, setDownloadMethod] = useState('');

    const canvasRef = useRef();
    const [userPicture, setProfilePicture] = useState(null);

    // Drag events helpers
    const handleDrag = (e, dragging) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(dragging);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {

            const file = e.dataTransfer.files[0];
            const reader = new FileReader();

            reader.onload = () => {
                const img = new Image();
                img.src = reader.result;
                img.crossOrigin = 'anonymous';
                img.onload = () => setProfilePicture(img);

                setFileLoad(true);
                setFileName(file.name);
            };

            reader.readAsDataURL(file);
        }
    };

    const handleDownloadMethod = (event) => {
        setDownloadMethod(event.target.value);
    }

    const handleProfileImage = (event) => {

        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();

        reader.onload = () => {
            const img = new Image();
            img.src = reader.result;
            img.crossOrigin = 'anonymous';
            img.onload = () => setProfilePicture(img);
            setFileLoad(true);
            setFileName(file.name);
        };

        reader.readAsDataURL(file);

    };

    const generateImage = async () => {

        try {
            const imgBg  = new Image();
            imgBg.src    = 'https://mateusmcamargo.github.io/gerador-carteirinha/carteirinha_em_branco.svg';
            imgBg.width  = 1430;
            imgBg.height = 904;
            await imgBg.decode();

            const finalCanvas = canvasRef.current;
            const ctx = finalCanvas.getContext('2d');
            finalCanvas.width  = imgBg.width;
            finalCanvas.height = imgBg.height;
            ctx.drawImage(imgBg, 0, 0, imgBg.width, imgBg.height);

            // if textRA isnt empty
            if (textRA.trim()) {

                // create canvas element for qrcode
                const qrCanvas = document.createElement('canvas');

                let newTextRA = textRA.toString();
                if (textRA.charAt(0) !== '0') {
                    newTextRA = '0' + newTextRA;
                }

                // set qrcode for canvas
                await QRCode.toCanvas(qrCanvas, newTextRA, {
                    width: 285,
                    margin: 0,
                    color: {
                        light: '#F6F6ED',
                        dark: '#333333'
                    }
                });
                
                // try and draw qrcode on canvas on given coordinates, catching any errors
                try {
                    const posX = finalCanvas.width  - qrCanvas.width  - 94;
                    const posY = finalCanvas.height - qrCanvas.height - 396;
                    ctx.drawImage(qrCanvas, posX, posY);
                } catch (err) {
                    console.error('Erro ao desenhar QR code:', err);
                }

                // create canvas element for barcode
                const barcodeCanvas = document.createElement('canvas');

                // forces context for barcode
                barcodeCanvas.getContext('2d');

                // sets bar code for canvas
                JsBarcode(barcodeCanvas, newTextRA, {
                    format: 'CODE128',
                    width: 10.74,
                    height: 114,
                    displayValue: false,
                    fit: false,
                    margin: 0,
                    background: '#F6F6ED',
                    lineColor: '#333333'
                });

                // try and draw barcode on canvas on given coordinates, catching any errors
                try {
                    const posX = finalCanvas.width  - barcodeCanvas.width  - 95;
                    const posY = finalCanvas.height - barcodeCanvas.height - 203;
                    ctx.drawImage(barcodeCanvas, posX, posY);
                } catch (err) {
                    console.error('Erro ao desenhar código de barras:', err);
                }
            }

            // text color and align
            // DO NOT CHANGE ANY STYLING CODE FOR THE GENERATOR
            // UNLESS THE WHOLE CARD DESIGN IS ALREADY CHANGED
            ctx.fillStyle = '#333';
            ctx.textAlign = 'left';

            // text coordinates and margins. **DO NOT CHANGE**
            const textXStart        = 488;
            const textYName         = 254;
            const textYNameMargin   = 74;
            const textYUni          = textYName + textYNameMargin;
            const textYMargin       = 56;

            // name (bold)
            ctx.font = 'bold 34px sans-serif';
            ctx.fillText(name, textXStart, textYName); // X, Y

            // uni
            ctx.font = '32px sans-serif';
            ctx.fillText('Universidade Tecnológica Federal', textXStart, textYUni);

            // course
            ctx.fillText(course, textXStart, textYUni + (textYMargin * 1));

            // date (bold)
            ctx.font = 'bold 32px sans-serif';
            ctx.fillText('Data de validade: ', textXStart, textYUni + (textYMargin * 2));
            const textWidthDate = ctx.measureText('Data de validade: ').width;

            // date (value)
            ctx.font = '32px sans-serif';
            ctx.fillText('31/12/2025', textXStart + textWidthDate, textYUni + (textYMargin * 2));

            // registrarion (bold)
            ctx.font = 'bold 32px sans-serif';
            ctx.fillText('Registro de aluno: ', textXStart, textYUni + (textYMargin * 3));
            const textWidthRegistration = ctx.measureText('Registro de aluno: ').width;

            // registrarion (value)
            ctx.font = '32px sans-serif';
            if (textRA.charAt(0) === '0') {
                ctx.fillText(textRA.slice(1), textXStart + textWidthRegistration, textYUni + (textYMargin * 3));
            } else {
                ctx.fillText(textRA, textXStart + textWidthRegistration, textYUni + (textYMargin * 3));
            }

            // if user picture is submited
            if (userPicture) {
                // sets goal ratio
                const desiredRatio = 3 / 4;
                const img = userPicture;

                // sets cropping data
                let cropX = 0;
                let cropY = 0;
                let cropWidth = img.width;
                let cropHeight = img.height;

                // get current image ratio
                const currentRatio = img.width / img.height;

                if (currentRatio > desiredRatio) {
                    // cut horizontally
                    cropWidth = img.height * desiredRatio;
                    cropX     = (img.width - cropWidth) / 2;
                } else {
                    // cut vertically
                    cropHeight = img.width / desiredRatio;
                    cropY      = (img.height - cropHeight) / 2;
                }

                // draw picture on canvas **DO NOT CHANGE**
                ctx.drawImage(
                    img,
                    cropX, cropY,
                    cropWidth, cropHeight,
                    98, 224, // position in
                    358, 477 // final size (ex: 90 x 120)
                );
            }

            setGenerated(true);
            
        } catch (finalErr) {
            console.error('Erro geral na geração da imagem:', finalErr);
        }
    };  

    // downloads image (only works when deployed, probably WON' T work on local servers)
    // only works on 'https://' addresess
    const downloadImage = (method) => {
        
        const link = document.createElement('a');
        switch(method) {

            case 'name':
                link.download = `${name.toUpperCase()}.png`;
            break;

            case 'code':
                link.download = `${textRA}.png`;
                break;
                
            case 'both':
                link.download = `${textRA}-${name.toUpperCase()}.png`;
            break;
        }
        link.href = canvasRef.current.toDataURL();
        link.click();
    };

    return (
        <main id='generator'>
            <section className='section-input visible'>
                <h2>Gerador de Carteirinhas</h2>
                
                <div className='input-block file'>
                    <label className='actual-label'>Foto do aluno</label>
                    <label
                        className={`
                            dropzone pseudo-input
                            ${fileLoad   ? 'loaded'   : ''}
                            ${isDragging ? 'dragging' : ''}
                        `}
                        onDragOver={(event) => handleDrag(event, true)}
                        onDragLeave={(event) => handleDrag(event, false)}
                        onDrop={handleDrop}
                    >
                        <input
                            type='file'
                            accept='image/*'
                            onChange={handleProfileImage}
                        />
                        <i className={fileLoad ? 'fa-solid fa-file-image loaded' : 'fa-solid fa-file-import'}></i>
                        {fileName}
                    </label>
                </div>

                <div className='input-block name'>
                    <label className='actual-label'>Nome do aluno</label>
                    <input
                        type='text'
                        placeholder='Nome do aluno'
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                    />
                </div>
                
                <div className='input-block code-course'>
                    <div className='div-grid'>
                        <div>
                            <label className='actual-label'>RA</label>
                            <input
                                type='text'
                                placeholder='1234567'
                                value={textRA}
                                onChange={(event) => setTextRA(event.target.value)}
                            />
                        </div>

                        <div>
                            <label className='actual-label'>Curso do aluno</label>
                            <select
                                value={course}
                                onChange={(event) => setCourse(event.target.value)}
                            >
                                <option value="">Selecione o curso</option>
                                <option value="Engenharia de Computação">Engenharia de Computação</option>
                                <option value="Engenharia de Software">Engenharia de Software</option>
                                <option value="Análise e Desenvolv. de Sistemas">Análise e Desenvolvimento de Sistemas</option>
                                <option value="Licenciatura em Matemática">Licenciatura em Matemática</option>
                            </select>
                        </div>
                    </div>
                </div>

                <button onClick={generateImage}>Gerar Carteirinha</button>
            </section>

            <section className={`section-canva ${generated ? 'visible' : 'invisible'}`}>
                <canvas ref={canvasRef}></canvas>

                {generated && (
                    <>
                        <div className='input-block'>
                            <div className='download-methods'>
                                <label className='actual-label'>Nomear carteirinha por:</label>
                                <div className='radios'>
                                    <input
                                        type='radio'
                                        id='radio-name'
                                        name='download'
                                        value='name'
                                        checked={downloadMethod === 'name'}
                                        onChange={handleDownloadMethod}
                                        />
                                    <label className='pseudo-radio' htmlFor='radio-name'>Nome</label>

                                    <input
                                        type='radio'
                                        id='radio-code'
                                        name='download'
                                        value='code'
                                        checked={downloadMethod === 'code'}
                                        onChange={handleDownloadMethod}
                                        />
                                    <label className='pseudo-radio' htmlFor='radio-code'>RA</label>

                                    <input
                                        type='radio'
                                        id='radio-both'
                                        name='download'
                                        value='both'
                                        checked={downloadMethod === 'both'}
                                        onChange={handleDownloadMethod}
                                        />
                                    <label className='pseudo-radio' htmlFor='radio-both'>Ambos</label>
                            </div>
                        </div>
                        </div>

                        <button onClick={() => downloadImage(downloadMethod)}>
                            Baixar Carteirinha
                        </button>
                    </>
                )}
            </section>
        </main>
    );
}
