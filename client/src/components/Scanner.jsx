import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

const Scanner = ({ onScanSuccess, onScanError }) => {
  const scannerRef = useRef(null);
  const html5QrCodeRef = useRef(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    return () => {
      stopScanner();
    };
  }, []);

  const startScanner = async () => {
    try {
      setError(null);
      const html5QrCode = new Html5Qrcode('scanner-region');
      html5QrCodeRef.current = html5QrCode;

      await html5QrCode.start(
        { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: { width: 280, height: 150 },
          aspectRatio: 1.0,
          formatsToSupport: [
            0,  // QR_CODE
            4,  // EAN_13
            3,  // EAN_8
            11, // UPC_A
            12, // UPC_E
            2,  // CODE_128
          ],
        },
        (decodedText) => {
          stopScanner();
          if (onScanSuccess) onScanSuccess(decodedText);
        },
        (errorMessage) => {
          // Ignore continuous scan errors (expected while searching)
        }
      );

      setIsScanning(true);
    } catch (err) {
      setError(
        err.toString().includes('NotAllowedError')
          ? 'Camera permission denied. Please allow camera access and try again.'
          : 'Unable to start camera. Please make sure no other app is using it.'
      );
      if (onScanError) onScanError(err);
    }
  };

  const stopScanner = async () => {
    if (html5QrCodeRef.current && html5QrCodeRef.current.isScanning) {
      try {
        await html5QrCodeRef.current.stop();
        html5QrCodeRef.current.clear();
      } catch (err) {
        console.error('Error stopping scanner:', err);
      }
    }
    setIsScanning(false);
  };

  return (
    <div className="scanner-container">
      <div id="scanner-region" ref={scannerRef} className="scanner-viewport"></div>

      {error && (
        <div className="scanner-error">
          <span className="error-icon">⚠️</span>
          <p>{error}</p>
        </div>
      )}

      {!isScanning && !error && (
        <button className="btn btn-primary scan-start-btn" onClick={startScanner}>
          <span className="btn-icon">📷</span>
          Start Camera
        </button>
      )}

      {isScanning && (
        <div className="scanner-instructions">
          <div className="pulse-dot"></div>
          <p>Point your camera at a product barcode</p>
          <button className="btn btn-secondary" onClick={stopScanner}>
            Stop Scanning
          </button>
        </div>
      )}
    </div>
  );
};

export default Scanner;
