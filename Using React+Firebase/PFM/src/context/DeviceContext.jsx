import { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { useAuth } from './AuthContext';
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  doc, 
  updateDoc, 
  arrayUnion, 
  getDoc, 
  setDoc 
} from 'firebase/firestore';

const DeviceContext = createContext();

export const useDevice = () => {
  return useContext(DeviceContext);
};

export const DeviceProvider = ({ children }) => {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  // Load user's devices
  useEffect(() => {
    const fetchDevices = async () => {
      if (!currentUser) {
        setDevices([]);
        setLoading(false);
        return;
      }

      try {
        const userDocRef = doc(db, 'users', currentUser.uid);
        const userDoc = await getDoc(userDocRef);
        
        if (userDoc.exists() && userDoc.data().devices) {
          const userDevices = [];
          
          for (const deviceId of userDoc.data().devices) {
            const deviceDocRef = doc(db, 'devices', deviceId);
            const deviceDoc = await getDoc(deviceDocRef);
            
            if (deviceDoc.exists()) {
              userDevices.push({
                id: deviceDoc.id,
                ...deviceDoc.data()
              });
            }
          }
          
          setDevices(userDevices);
        } else {
          setDevices([]);
        }
      } catch (error) {
        console.error("Error fetching devices:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDevices();
  }, [currentUser]);

  // Add a new device 
  const addDevice = async (deviceId, deviceName) => {
    if (!currentUser) return { success: false, error: "User not authenticated" };

    try {
      console.log("Adding device:", deviceId, "with name:", deviceName);
      console.log("Current user:", currentUser.uid);
      
      // Check if device exists in the devices collection
      const deviceDocRef = doc(db, 'devices', deviceId);
      const deviceDoc = await getDoc(deviceDocRef);

      if (!deviceDoc.exists()) {
        // Create new device if it doesn't exist
        console.log("Device doesn't exist, creating new device");
        await setDoc(deviceDocRef, {
          name: deviceName || `Pet Feeder ${deviceId.substring(4, 8)}`,
          status: 'inactive',
          touchControl: false,
          timerSettings: { minutes: 0, active: false },
          lastFed: null,
          createdAt: new Date()
        });
      } else if (deviceName) {
        // Update existing device name if a custom name is provided
        console.log("Device exists, updating name to:", deviceName);
        await updateDoc(deviceDocRef, {
          name: deviceName
        });
      }

      // Add device to user's device list
      const userDocRef = doc(db, 'users', currentUser.uid);
      const userDoc = await getDoc(userDocRef);
      
      // If user document doesn't exist, create it
      if (!userDoc.exists()) {
        console.log("User document doesn't exist, creating it");
        await setDoc(userDocRef, {
          email: currentUser.email,
          createdAt: new Date(),
          devices: [deviceId]
        });
      } else {
        // Check if the device is already in the user's list
        if (userDoc.data().devices && userDoc.data().devices.includes(deviceId)) {
          console.log("Device already in user's list");
        } else {
          console.log("User document exists, updating it with new device");
          await updateDoc(userDocRef, {
            devices: arrayUnion(deviceId)
          });
        }
      }

      // Refresh devices
      const newDeviceDoc = await getDoc(deviceDocRef);
      
      // Check if device is already in the list
      const deviceExists = devices.some(device => device.id === deviceId);
      
      if (deviceExists) {
        // Update existing device
        setDevices(devices.map(device => 
          device.id === deviceId 
            ? { id: deviceId, ...newDeviceDoc.data() } 
            : device
        ));
      } else {
        // Add new device
        setDevices([...devices, { id: deviceId, ...newDeviceDoc.data() }]);
      }

      console.log("Device added successfully");
      return { success: true };
    } catch (error) {
      console.error("Error adding device:", error);
      return { success: false, error: error.message || "Unknown error" };
    }
  };

  // Update device settings
  const updateDeviceSettings = async (deviceId, settings) => {
    if (!currentUser) return;

    try {
      const deviceDocRef = doc(db, 'devices', deviceId);
      await updateDoc(deviceDocRef, settings);
      
      // Update local state
      setDevices(devices.map(device => {
        if (device.id === deviceId) {
          return { ...device, ...settings };
        }
        return device;
      }));

      return { success: true };
    } catch (error) {
      console.error("Error updating device:", error);
      return { success: false, error };
    }
  };

  const value = {
    devices,
    loading,
    addDevice,
    updateDeviceSettings
  };

  return (
    <DeviceContext.Provider value={value}>
      {children}
    </DeviceContext.Provider>
  );
}; 