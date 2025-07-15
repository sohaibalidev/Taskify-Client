import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import HealthCheckWrapper from './components/HealthCheckWrapper';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <HealthCheckWrapper>
        <App />
    </HealthCheckWrapper>
);
