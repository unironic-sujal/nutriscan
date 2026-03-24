import { useEffect, useRef, useState } from 'react';
import { BrowserMultiFormatReader, NotFoundException } from '@zxing/library';

const Scanner = ({ onScanSuccess, onScanError }) => {
  const videoRef = useRef(null);
  const codeReaderRef = useRef(null);
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
      
      // ZXing scanner implementation
      const codeReader = new BrowserMultiFormatReader();
      codeReaderRef.current = codeReader;

      const videoInputDevices = await codeReader.listVideoInputDevices();
      if (!videoInputDevices || videoInputDevices.length === 0) {
        throw new Error("No camera found on this device.");
      }
      
      // Look specifically for a back-facing camera
      let selectedDeviceId = videoInputDevices[0].deviceId;
      for (const device of videoInputDevices) {
        const label = device.label.toLowerCase();
        if (label.includes('back') || label.includes('environment') || label.includes('rear')) {
          selectedDeviceId = device.deviceId;
          break;
        }
      }

      // Start continuous scanning
      codeReader.decodeFromVideoDevice(
        selectedDeviceId,
        videoRef.current,
        (result, err) => {
          if (result) {
            stopScanner();
            if (onScanSuccess) onScanSuccess(result.getText());
          }
          if (err && !(err instanceof NotFoundException)) {
            // Log true errors, ignore NotFound (which just means scanning the current frame)
            console.error("ZXing Decoding Error:", err);
          }
        }
      );
      
      setIsScanning(true);
    } catch (err) {
      console.error('Camera Init Error:', err);
      setError(
        err.toString().includes('NotAllowedError') || err.message?.includes('Permission')
          ? 'Camera permission denied. Please allow camera access and try again.'
          : 'Unable to start camera. Make sure no other app is using it.'
      );
      if (onScanError) onScanError(err);
    }
  };

  const stopScanner = () => {
    if (codeReaderRef.current) {
      codeReaderRef.current.reset(); // detaches camera feed and stops decoding
      codeReaderRef.current = null;
    }
    setIsScanning(false);
  };

  return (
    <div className="scanner-container">
      <div className="scanner-viewport" style={{ position: 'relative', overflow: 'hidden', borderRadius: 'var(--radius-lg)' }}>
        <video 
          ref={videoRef} 
          style={{ width: '100%', height: '100%', objectFit: 'cover', minHeight: '250px', background: '#000' }}
          autoPlay 
          playsInline 
          muted
        ></video>
      </div>

      {error && (
        <div className="scanner-error">
          <span className="error-icon">⚠️</span>
          <p>{error}</p>
        </div>
      )}

      {!isScanning && !error && (
        <button className="btn btn-primary scan-start-btn" onClick={startScanner}>
          <span className="btn-icon">📷</span>
          Start ZXing Camera
        </button>
      )}

      {isScanning && (
        <div className="scanner-instructions">
          <div className="pulse-dot"></div>
          <p>Advanced Analysis Active: Frame the barcode</p>
          <button className="btn btn-secondary" onClick={stopScanner}>
            Stop Scanning
          </button>
        </div>
      )}
    </div>
  );
};

export default Scanner;
