import { useState } from 'react';
import { useDevice } from '../context/DeviceContext';
import { 
  Form, 
  FormGroup, 
  Label, 
  Input, 
  Button, 
  ErrorMessage 
} from './styled/StyledComponents';
import { FaTimes } from 'react-icons/fa';
import '../styles/Modal.css';

const AddDeviceModal = ({ onClose }) => {
  const [deviceId, setDeviceId] = useState('');
  const [deviceName, setDeviceName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { addDevice } = useDevice();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!deviceId.trim()) {
      return setError('Please enter a device ID');
    }

    // Validate device ID format
    const deviceIdPattern = /^PFM-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/;
    if (!deviceIdPattern.test(deviceId)) {
      return setError('Device ID must be in the format PFM-XXXX-XXXX-XXXX');
    }

    // Use default name if no custom name provided
    const nameToUse = deviceName.trim() || `Pet Feeder ${deviceId.substring(4, 8)}`;

    try {
      setError('');
      setLoading(true);
      
      console.log("Attempting to add device:", deviceId, "with name:", nameToUse);
      const result = await addDevice(deviceId, nameToUse);
      
      if (result?.success) {
        console.log("Device added successfully");
        setSuccess(true);
        setTimeout(() => {
          onClose();
        }, 2000);
      } else {
        console.error("Failed to add device:", result?.error);
        setError(`Failed to add device: ${result?.error || 'Unknown error'}`);
      }
    } catch (err) {
      console.error("Error in handleSubmit:", err);
      setError(`An error occurred: ${err.message || 'Unknown error'}`);
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
        
        <h2 className="modal-title">Add New Device</h2>

        {success ? (
          <div className="success-message">
            Device added successfully!
          </div>
        ) : (
          <>
            <p className="modal-help-text">
              Enter the unique Device ID located on your Pet Feeder Machine or from the packaging.
            </p>
            
            {error && <ErrorMessage>{error}</ErrorMessage>}
            
            <Form onSubmit={handleSubmit}>
              <FormGroup>
                <Label htmlFor="deviceId">Device ID</Label>
                <Input
                  id="deviceId"
                  type="text"
                  value={deviceId}
                  onChange={(e) => setDeviceId(e.target.value)}
                  placeholder="e.g., PFM-1234-5678-90AB"
                  required
                />
                <small className="format-hint">Format: PFM-XXXX-XXXX-XXXX</small>
              </FormGroup>

              <FormGroup>
                <Label htmlFor="deviceName">Device Name (Optional)</Label>
                <Input
                  id="deviceName"
                  type="text"
                  value={deviceName}
                  onChange={(e) => setDeviceName(e.target.value)}
                  placeholder="e.g., Kitchen Feeder, Doggo's Bowl"
                />
                <small className="format-hint">Personalize your device for easy identification</small>
              </FormGroup>
              
              <div className="modal-actions">
                <Button 
                  type="button" 
                  onClick={onClose}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button 
                  primary 
                  type="submit"
                  disabled={loading}
                >
                  {loading ? 'Adding...' : 'Add Device'}
                </Button>
              </div>
            </Form>
          </>
        )}
      </div>
    </div>
  );
};

export default AddDeviceModal; 