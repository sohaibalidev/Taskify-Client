import { Link } from 'react-router-dom';
import '../styles/NotFound.css';

const NotFound = () => {
    return (
        <div className="notfound-container">
            <div className="notfound-content">
                <h1>404</h1>
                <p>Oops! The page you're looking for doesn't exist.</p>
                <Link to="/" className="home-link">Go Back Home</Link>
            </div>
        </div>
    );
};

export default NotFound;
