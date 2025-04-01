import { useState, useEffect } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { useDevice } from '../context/DeviceContext';
import { Button, ErrorMessage } from './styled/StyledComponents';
import { FaTimes, FaQrcode } from 'react-icons/fa';
import '../styles/Modal.css';

const QrCodeScanner = ({ onClose }) => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [deviceId, setDeviceId] = useState('');
  const [scannerInitialized, setScannerInitialized] = useState(false);
  const { addDevice } = useDevice();

  useEffect(() => {
    // Initialize HTML5 QR scanner
    const html5QrCode = new Html5Qrcode("qr-reader");
    
    const qrCodeSuccessCallback = async (decodedText) => {
      // Stop scanning
      try {
        await html5QrCode.stop();
        setDeviceId(decodedText);
        handleAddDevice(decodedText);
      } catch (err) {
        console.error("Failed to stop scanner", err);
      }
    };
    
    const config = { fps: 10, qrbox: { width: 250, height: 250 } };

    // Start scanner
    const startScanner = async () => {
      try {
        setError('');
        await html5QrCode.start(
          { facingMode: "environment" }, 
          config,
          qrCodeSuccessCallback,
          (errorMessage) => {
            // Don't show errors for ongoing scanning
            console.log(errorMessage);
          }
        );
        setScannerInitialized(true);
      } catch (err) {
        console.error("QR Scanner error:", err);
        setError('Could not access camera. Please ensure you have given camera permissions.');
      }
    };

    startScanner();

    // Clean up
    return () => {
      if (scannerInitialized) {
        html5QrCode.stop().catch(err => console.error("Failed to clear scanner", err));
      }
    };
  }, []);

  const handleAddDevice = async (scannedDeviceId) => {
    try {
      setError('');
      setLoading(true);
      
      const result = await addDevice(scannedDeviceId);
      
      if (result?.success) {
        setSuccess(true);
        setTimeout(() => {
          onClose();
        }, 2000);
      } else {
        setError('Failed to add device. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <button 
          onClick={onClose}
          className="close-button"
        >
          <FaTimes />
        </button>
        
        <h2 className="modal-title">Scan Device QR Code</h2>
        
        {deviceId && !error ? (
          <div className="device-found">
            <h3 className="device-name">Device found!</h3>
            <p>Device ID: {deviceId}</p>
            {loading && <p>Adding device...</p>}
            {success && (
              <div className="success-message">
                Device added successfully!
              </div>
            )}
          </div>
        ) : (
          <p className="modal-help-text">
            Position the QR code from your Pet Feeder device within the scanner frame.
          </p>
        )}

        {error && <ErrorMessage>{error}</ErrorMessage>}
        
        {!deviceId && (
          <div id="qr-reader" className="qr-reader"></div>
        )}
        
        <div className="modal-actions">
          <Button onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QrCodeScanner; 