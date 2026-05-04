import { useState, useEffect } from 'react';
import { getSystemStatus } from '../services/api';

const ApiStatus = () => {
  const [status, setStatus] = useState('checking'); // 'checking', 'up', 'down'

  useEffect(() => {
    let mounted = true;

    const checkStatus = async () => {
      try {
        const res = await getSystemStatus();
        if (mounted && res.success) {
          setStatus(res.services.openfoodfacts);
        }
      } catch (err) {
        if (mounted) {
          setStatus('down');
        }
      }
    };

    // Initial check
    checkStatus();

    // Poll every 30 seconds
    const interval = setInterval(checkStatus, 30000);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="api-status-badge" title="Open Food Facts Search API Status">
      <div className={`status-dot ${status}`}></div>
      <span className="status-text">
        {status === 'checking' ? 'Checking API...' : status === 'up' ? 'Global Search Online' : 'Global Search Offline'}
      </span>
    </div>
  );
};

export default ApiStatus;
