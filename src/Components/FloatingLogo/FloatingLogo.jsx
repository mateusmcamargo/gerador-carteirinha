import { useState } from 'react';
import './floatingLogo.css';
import { Link } from 'react-router-dom';

export function FloatingLogo() {

    const [scale,   setScale]   = useState(1);
    const [visible, setVisible] = useState(true);

    function handleButtonClose() {
        setScale(0);
        setTimeout(() => {
            setVisible(false);
        }, 500);
    }

    return (
        <>
        {visible && (
            <div
                className='floating-logo'
                style={{scale: scale}}
            >
                <button onClick={handleButtonClose}>
                    <i className='fa-solid fa-xmark'/>
                </button>
                <a href='https://www.instagram.com/dacompcp/' target='_blank' rel='noopener noreferrer'></a>
            </div>
        )}
        </>
    );
}