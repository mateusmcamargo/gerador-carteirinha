import { NavLink } from 'react-router-dom';
import './navbar.css';
export function Navbar() {

    return (
        <section className='navbar'>
            <div className='logo'>
                <div className='img'></div>
                <h1>DACOMP</h1>
            </div>
            <nav>
                <NavLink to='/user' className={({isActive}) => isActive ? 'active' : ''}>
                   <i className='fa-regular fa-user'></i>
                   <span>Usuário</span>
                </NavLink>
                <NavLink to='/' className={({isActive}) => isActive ? 'active' : ''}>
                   <i className='fa-regular fa-rectangle-list'></i>
                   <span>Gerador</span>
                </NavLink>
                <NavLink to='/database' className={({isActive}) => isActive ? 'active' : ''}>
                   <i className='fa-regular fa-id-card'></i>
                   <span>Carteirinhas</span>
                </NavLink>
            </nav>

            <div className='footer'>
                <span>
                    Desenvolvido por
                    <a href='https://github.com/mateusmcamargo' target='_blank' rel='noopener noreferrer'>
                        <i className='fa-brands fa-github'></i>
                        mateusmcamargo
                    </a>
                </span>
            </div>
        </section>
    );
}