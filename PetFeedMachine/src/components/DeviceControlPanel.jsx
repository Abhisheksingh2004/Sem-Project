import { useState, useEffect, useRef } from 'react';
import { useDevice } from '../context/DeviceContext';
import { 
  DeviceControlPanel as ControlPanel, 
  ControlRow, 
  ControlLabel, 
  Button, 
  Input, 
  Card, 
  CardTitle 
} from './styled/StyledComponents';
import { FaPowerOff, FaClock, FaHistory, FaCalendarAlt, FaPlus, FaTrash } from 'react-icons/fa';
import '../styles/DeviceControl.css';

const DeviceControlPanel = ({ device }) => {
  const { updateDeviceSettings } = useDevice();
  const [minutes, setMinutes] = useState(device?.timerSettings?.minutes || 0);
  const [updating, setUpdating] = useState(false);
  const [touchControl, setTouchControl] = useState(device?.touchControl || false);
  const [countdown, setCountdown] = useState(0);
  const [timerActive, setTimerActive] = useState(device?.timerSettings?.active || false);
  const countdownRef = useRef(null);
  
  // State for schedule
  const [schedules, setSchedules] = useState(device?.schedules || []);
  const [newSchedule, setNewSchedule] = useState({
    day: 'Monday',
    time: '08:00',
    duration: 5,
    enabled: true
  });

  // Update local state when device changes
  useEffect(() => {
    if (device) {
      setTouchControl(device.touchControl || false);
      setMinutes(device?.timerSettings?.minutes || 0);
      setSchedules(device?.schedules || []);
      setTimerActive(device?.timerSettings?.active || false);
    }
  }, [device]);

  // Initialize countdown when component mounts or device changes
  useEffect(() => {
    if (device?.timerSettings?.active) {
      const timerDuration = device.timerSettings.minutes * 60; // in seconds
      setCountdown(timerDuration);
      setTimerActive(true);
    } else {
      setTimerActive(false);
      setCountdown(0);
    }
  }, [device?.id, device?.timerSettings?.active, device?.timerSettings?.minutes]);

  // Timer countdown effect
  useEffect(() => {
    // Clear any existing interval
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
      countdownRef.current = null;
    }
    
    if (timerActive && countdown > 0) {
      countdownRef.current = setInterval(() => {
        setCountdown(prevCountdown => {
          if (prevCountdown <= 1) {
            clearInterval(countdownRef.current);
            countdownRef.current = null;
            return 0;
          }
          return prevCountdown - 1;
        });
      }, 1000);
    }
    
    return () => {
      if (countdownRef.current) {
        clearInterval(countdownRef.current);
        countdownRef.current = null;
      }
    };
  }, [timerActive, countdown]);
  
  const handleTouchControl = async () => {
    setUpdating(true);
    // Update local state immediately for responsive UI
    const newTouchControlState = !touchControl;
    setTouchControl(newTouchControlState);
    
    try {
      await updateDeviceSettings(device.id, { 
        touchControl: newTouchControlState,
        lastFed: !newTouchControlState ? device.lastFed : new Date()
      });
    } catch (error) {
      // Revert local state if server update fails
      setTouchControl(!newTouchControlState);
      console.error("Error toggling touch control:", error);
    } finally {
      setUpdating(false);
    }
  };
  
  const handleStartTimer = async () => {
    if (minutes <= 0) return;
    
    setUpdating(true);
    // Update local state immediately for responsive UI
    const timerDuration = parseInt(minutes);
    setTimerActive(true);
    setCountdown(timerDuration * 60);
    
    try {
      await updateDeviceSettings(device.id, { 
        timerSettings: {
          minutes: timerDuration,
          active: true,
          startTime: new Date().getTime()
        }
      });
    } catch (error) {
      // Revert local state if server update fails
      setTimerActive(false);
      setCountdown(0);
      console.error("Error setting timer:", error);
    } finally {
      setUpdating(false);
    }
  };
  
  const handleStopTimer = async () => {
    setUpdating(true);
    // Update local state immediately
    setTimerActive(false);
    setCountdown(0);
    
    try {
      await updateDeviceSettings(device.id, { 
        timerSettings: {
          minutes: device.timerSettings.minutes,
          active: false
        }
      });
    } catch (error) {
      // Restore previous state if API call fails
      setTimerActive(true);
      setCountdown(device.timerSettings.minutes * 60);
      console.error("Error stopping timer:", error);
    } finally {
      setUpdating(false);
    }
  };
  
  // Format countdown time as MM:SS
  const formatCountdown = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  const handleAddSchedule = async () => {
    const updatedSchedules = [...schedules, newSchedule];
    
    setUpdating(true);
    try {
      await updateDeviceSettings(device.id, { 
        schedules: updatedSchedules
      });
      setSchedules(updatedSchedules);
      setNewSchedule({
        day: 'Monday',
        time: '08:00',
        duration: 5,
        enabled: true
      });
    } catch (error) {
      console.error("Error adding schedule:", error);
    } finally {
      setUpdating(false);
    }
  };
  
  const handleRemoveSchedule = async (index) => {
    const updatedSchedules = schedules.filter((_, i) => i !== index);
    
    setUpdating(true);
    try {
      await updateDeviceSettings(device.id, { 
        schedules: updatedSchedules
      });
      setSchedules(updatedSchedules);
    } catch (error) {
      console.error("Error removing schedule:", error);
    } finally {
      setUpdating(false);
    }
  };

  const handleScheduleToggle = async (index) => {
    const updatedSchedules = [...schedules];
    updatedSchedules[index].enabled = !updatedSchedules[index].enabled;
    
    setUpdating(true);
    try {
      await updateDeviceSettings(device.id, { 
        schedules: updatedSchedules
      });
      setSchedules(updatedSchedules);
    } catch (error) {
      console.error("Error toggling schedule:", error);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <>
      <ControlPanel>
        <CardTitle>{device.name} Control Panel</CardTitle>
        
        <div className="control-section">
          <ControlRow>
            <ControlLabel>Touch Control</ControlLabel>
            <Button 
              primary={touchControl}
              onClick={handleTouchControl}
              disabled={updating}
              className="timer-input"
            >
              {touchControl ? 'On' : 'Off'}
            </Button>
          </ControlRow>
          
          <ControlRow>
            <ControlLabel>Timer Control</ControlLabel>
            <div className="timer-control-row">
              <Input 
                type="number"
                min="1"
                max="120"
                value={minutes}
                onChange={(e) => setMinutes(e.target.value)}
                placeholder="Minutes"
                className="timer-input"
                disabled={timerActive}
              />
              {!timerActive ? (
                <Button 
                  primary 
                  onClick={handleStartTimer}
                  disabled={updating || minutes <= 0}
                >
                  Start Timer
                </Button>
              ) : (
                <Button 
                  onClick={handleStopTimer}
                  disabled={updating}
                >
                  Stop Timer
                </Button>
              )}
            </div>
          </ControlRow>
          
          {timerActive && (
            <div className="timer-active-box">
              <p className="timer-info">
                <FaClock /> Timer active: {device?.timerSettings?.minutes || minutes} minutes
              </p>
              <div className="timer-countdown">
                Remaining: {formatCountdown(countdown)}
              </div>
            </div>
          )}
          
          {/* Schedule Control Section */}
          <div className="control-section">
            <CardTitle className="schedule-header">
              <FaCalendarAlt /> Schedule Feedings
            </CardTitle>
            
            <div className="schedule-form">
              <div className="schedule-form-row">
                <select 
                  value={newSchedule.day}
                  onChange={(e) => setNewSchedule({...newSchedule, day: e.target.value})}
                  className="day-select"
                >
                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                    <option key={day} value={day}>{day}</option>
                  ))}
                </select>
                
                <Input 
                  type="time"
                  value={newSchedule.time}
                  onChange={(e) => setNewSchedule({...newSchedule, time: e.target.value})}
                  className="time-input"
                />
                
                <Input 
                  type="number"
                  min="1"
                  max="30"
                  value={newSchedule.duration}
                  onChange={(e) => setNewSchedule({...newSchedule, duration: parseInt(e.target.value) || 5})}
                  placeholder="Seconds"
                  className="duration-input"
                />
                
                <Button 
                  primary 
                  onClick={handleAddSchedule}
                  disabled={updating}
                  className="add-button"
                >
                  <FaPlus /> Add
                </Button>
              </div>
              <div className="duration-help">
                Duration: How long to dispense food (in seconds)
              </div>
            </div>
            
            {schedules.length > 0 ? (
              <div className="schedules-container">
                {schedules.map((schedule, index) => (
                  <div 
                    key={index}
                    className={`schedule-item ${!schedule.enabled ? 'disabled' : ''}`}
                  >
                    <div>
                      <p className="schedule-day">{schedule.day}</p>
                      <p className="schedule-time">{schedule.time}</p>
                      <p className="schedule-duration">
                        Duration: {schedule.duration || 5}s
                      </p>
                    </div>
                    <div className="schedule-actions">
                      <Button 
                        primary={schedule.enabled}
                        onClick={() => handleScheduleToggle(index)}
                        disabled={updating}
                        className="status-button"
                      >
                        {schedule.enabled ? 'Active' : 'Paused'}
                      </Button>
                      <Button 
                        onClick={() => handleRemoveSchedule(index)}
                        disabled={updating}
                        className="delete-button"
                      >
                        <FaTrash />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="empty-schedule">
                No scheduled feedings. Add one to get started.
              </p>
            )}
          </div>
        </div>
      </ControlPanel>
      
      <Card>
        <CardTitle className="history-title">Feeding History</CardTitle>
        {device.lastFed ? (
          <div className="history-entry">
            <FaHistory />
            <div>
              <p><strong>Last Fed:</strong></p>
              <p>{new Date(device.lastFed.toDate()).toLocaleString()}</p>
            </div>
          </div>
        ) : (
          <p>No feeding history yet.</p>
        )}
      </Card>
    </>
  );
};

export default DeviceControlPanel; 