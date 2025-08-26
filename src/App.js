// react
import { BrowserRouter as Router } from 'react-router-dom';

// components
import { AppRoutes } from './Routes/Routes';
import { Navbar } from './Components/Navbar/Navbar';

// css
import './app.css';
import { FloatingLogo } from './Components/FloatingLogo/FloatingLogo';

function App() {

    return (
        <div className='app'>
            <Router>
                <Navbar/>
                <FloatingLogo/>
                <AppRoutes/>
            </Router>
        </div>
    );
}

export default App;
