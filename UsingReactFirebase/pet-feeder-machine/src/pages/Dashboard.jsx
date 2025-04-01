import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useDevice } from '../context/DeviceContext';
import { 
  Container, 
  Button, 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent,
  DeviceGrid,
} from '../components/styled/StyledComponents';
import { FaPlus, FaQrcode, FaEdit, FaCheck, FaTimes } from 'react-icons/fa';
import AddDeviceModal from '../components/AddDeviceModal';
import QrCodeScanner from '../components/QrCodeScanner';
import DeviceControlPanel from '../components/DeviceControlPanel';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const { currentUser } = useAuth();
  const { devices, loading, updateDeviceSettings } = useDevice();
  const navigate = useNavigate();
  
  const [showAddDeviceModal, setShowAddDeviceModal] = useState(false);
  const [showQrScanner, setShowQrScanner] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [editingDeviceId, setEditingDeviceId] = useState(null);
  const [editedName, setEditedName] = useState('');

  // Function to handle editing a device name
  const startEditingName = (device) => {
    setEditingDeviceId(device.id);
    setEditedName(device.name);
  };

  const cancelEditingName = () => {
    setEditingDeviceId(null);
    setEditedName('');
  };

  const saveDeviceName = async (deviceId) => {
    if (editedName.trim()) {
      try {
        await updateDeviceSettings(deviceId, { name: editedName.trim() });
        setEditingDeviceId(null);
      } catch (error) {
        console.error("Error updating device name:", error);
      }
    }
  };

  // Redirect if not logged in
  if (!currentUser) {
    navigate('/login');
    return null;
  }

  return (
    <Container>
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1 className="dashboard-title">My Devices</h1>
          <div className="dashboard-actions">
            <Button onClick={() => setShowQrScanner(true)}>
              <FaQrcode className="button-icon" /> Scan QR Code
            </Button>
            <Button primary onClick={() => setShowAddDeviceModal(true)}>
              <FaPlus className="button-icon" /> Add Device
            </Button>
          </div>
        </div>
        
        {loading ? (
          <p>Loading devices...</p>
        ) : devices.length === 0 ? (
          <Card>
            <CardContent>
              <p>You haven't added any devices yet. Click the "Add Device" button to get started.</p>
            </CardContent>
          </Card>
        ) : (
          <>
            {selectedDevice ? (
              <div>
                <div className="back-button">
                  <Button onClick={() => setSelectedDevice(null)}>
                    ← Back to Devices
                  </Button>
                </div>
                <DeviceControlPanel device={selectedDevice} />
              </div>
            ) : (
              <DeviceGrid>
                {devices.map(device => (
                  <Card key={device.id}>
                    <CardHeader>
                      {editingDeviceId === device.id ? (
                        <div className="device-name-edit">
                          <input
                            type="text"
                            className="device-name-input"
                            value={editedName}
                            onChange={(e) => setEditedName(e.target.value)}
                            autoFocus
                          />
                          <div className="name-edit-actions">
                            <FaCheck 
                              className="save-icon"
                              onClick={() => saveDeviceName(device.id)} 
                            />
                            <FaTimes 
                              className="cancel-icon"
                              onClick={cancelEditingName} 
                            />
                          </div>
                        </div>
                      ) : (
                        <>
                          <CardTitle>{device.name}</CardTitle>
                          <FaEdit 
                            className="edit-icon"
                            onClick={() => startEditingName(device)}
                          />
                        </>
                      )}
                    </CardHeader>
                    <CardContent>
                      <p className="device-info"><strong>Status:</strong> {device.status}</p>
                      <p className="device-info"><strong>Last Fed:</strong> {device.lastFed ? new Date(device.lastFed.toDate()).toLocaleString() : 'Never'}</p>
                      <p className="device-info"><strong>Device ID:</strong> <span className="device-id">{device.id}</span></p>
                    </CardContent>
                    <div className="device-actions">
                      <Button primary onClick={() => setSelectedDevice(device)}>
                        Control
                      </Button>
                    </div>
                  </Card>
                ))}
              </DeviceGrid>
            )}
          </>
        )}
      </div>

      {showAddDeviceModal && (
        <AddDeviceModal onClose={() => setShowAddDeviceModal(false)} />
      )}

      {showQrScanner && (
        <QrCodeScanner onClose={() => setShowQrScanner(false)} />
      )}
    </Container>
  );
};

export default Dashboard; 