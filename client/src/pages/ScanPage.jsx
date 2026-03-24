import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Scanner from '../components/Scanner';

const ScanPage = () => {
  const navigate = useNavigate();
  const [manualBarcode, setManualBarcode] = useState('');

  const handleScanSuccess = (barcode) => {
    navigate(`/product/${barcode}`);
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (manualBarcode.trim() && /^\d{8,13}$/.test(manualBarcode.trim())) {
      navigate(`/product/${manualBarcode.trim()}`);
    }
  };

  return (
    <div className="page scan-page">
      <div className="page-header">
        <h1 className="page-title">Scan Barcode</h1>
        <p className="page-subtitle">Point your camera at a product barcode</p>
      </div>

      <Scanner
        onScanSuccess={handleScanSuccess}
        onScanError={(err) => console.error('Scan error:', err)}
      />

      <div className="manual-entry">
        <div className="hero-divider">
          <span>or enter manually</span>
        </div>
        <form className="manual-form" onSubmit={handleManualSubmit}>
          <input
            type="text"
            className="manual-input"
            placeholder="Enter barcode number (e.g., 8901063090019)"
            value={manualBarcode}
            onChange={(e) => setManualBarcode(e.target.value.replace(/\D/g, ''))}
            maxLength={13}
            inputMode="numeric"
          />
          <button
            type="submit"
            className="btn btn-primary"
            disabled={!/^\d{8,13}$/.test(manualBarcode)}
          >
            Look Up
          </button>
        </form>
      </div>
    </div>
  );
};

export default ScanPage;
