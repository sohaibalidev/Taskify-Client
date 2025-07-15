import { useState, useEffect } from 'react';
import axios from 'axios';

const RETRY_IN = 30

const HealthCheckWrapper = ({ children }) => {
    const [isServerOnline, setIsServerOnline] = useState(null);
    const [retryIn, setRetryIn] = useState(RETRY_IN);
    const [retryTimer, setRetryTimer] = useState(null);
    const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

    const checkHealth = async () => {
        try {
            await axios.get(`${BACKEND_URL}/api/health`);
            setIsServerOnline(true);

            clearInterval(retryTimer);
        } catch (err) {
            setIsServerOnline(false);
            setRetryIn(RETRY_IN);
        }
    };

    useEffect(() => {
        checkHealth();
    }, []);

    useEffect(() => {
        if (!isServerOnline) {
            const interval = setInterval(() => {
                setRetryIn(prev => {
                    if (prev <= 1) {
                        checkHealth();
                        return RETRY_IN;
                    }
                    return prev - 1;
                });
            }, 1000);
            setRetryTimer(interval);
            return () => clearInterval(interval);
        }
    }, [isServerOnline]);

    if (isServerOnline === null) {
        return (
            <div className="loading-screen">
                <div className="spinner" />
                <p>Checking server status...</p>
            </div>
        );
    }

    if (!isServerOnline) {
        return (
            <div className="offline-screen">
                <h2>Server Unavailable</h2>
                <p>
                    Our backend server is currently not responding. This can happen when the system is restarting or temporarily unreachable.
                </p>
                <p>
                    <strong>No action needed.</strong> We're automatically retrying every few seconds and will reconnect once the server is back online.
                </p>
                <p>
                    Next attempt in <strong>{retryIn}</strong> second{retryIn !== 1 ? 's' : ''}...
                </p>

                <div className="progress-bar-wrapper">
                    <div
                        className="progress-bar"
                        style={{ width: `${((RETRY_IN - retryIn) / RETRY_IN) * 100}%` }}
                    ></div>
                </div>

                <button className="retry-button" onClick={checkHealth}>
                    Retry Now
                </button>
            </div>
        );
    }

    return <>{children}</>;
};

export default HealthCheckWrapper;
