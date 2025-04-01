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
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  
  // State for schedule
  const [schedules, setSchedules] = useState(device?.schedules || []);
  const [newSchedule, setNewSchedule] = useState({
    day: 'Monday',
    time: '08:00 AM',
    duration: '',
    enabled: true
  });

  // Handle window resize for responsive design
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
  
  // Convert 24h time to 12h AM/PM format
  const convertTo12Hour = (time24h) => {
    if (!time24h) return '';
    
    // Check if already in 12-hour format
    if (time24h.includes('AM') || time24h.includes('PM')) {
      return time24h;
    }
    
    const [hours, minutes] = time24h.split(':');
    const hour = parseInt(hours, 10);
    
    if (hour === 0) {
      return `12:${minutes} AM`;
    } else if (hour < 12) {
      return `${hour}:${minutes} AM`;
    } else if (hour === 12) {
      return `12:${minutes} PM`;
    } else {
      return `${hour - 12}:${minutes} PM`;
    }
  };
  
  // Convert 12h time back to 24h format for storage
  const convertTo24Hour = (time12h) => {
    if (!time12h) return '';
    
    // Check if already in 24-hour format
    if (!time12h.includes('AM') && !time12h.includes('PM')) {
      return time12h;
    }
    
    const isPM = time12h.includes('PM');
    const timeOnly = time12h.replace(/\s*[AP]M/, '');
    const [hours, minutes] = timeOnly.split(':');
    let hour = parseInt(hours, 10);
    
    if (isPM && hour < 12) {
      hour += 12;
    } else if (!isPM && hour === 12) {
      hour = 0;
    }
    
    return `${hour.toString().padStart(2, '0')}:${minutes}`;
  };
  
  const handleAddSchedule = async () => {
    if (!newSchedule.duration || newSchedule.duration < 1) {
      alert('Please enter a valid duration (1-30 seconds)');
      return;
    }
    
    // Convert time to 24h format for storage
    const updatedSchedule = {
      ...newSchedule,
      time24h: convertTo24Hour(newSchedule.time)
    };
    
    const updatedSchedules = [...schedules, updatedSchedule];
    
    setUpdating(true);
    try {
      await updateDeviceSettings(device.id, { 
        schedules: updatedSchedules
      });
      setSchedules(updatedSchedules);
      setNewSchedule({
        day: 'Monday',
        time: '08:00 AM',
        duration: '',
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
        
        {/* Touch Control Section */}
        <div className="control-section touch-control-section">
          <CardTitle className="control-header">
            <FaPowerOff /> Touch Control
          </CardTitle>
          <div className="touch-control-container">
            <p className="touch-description">
              Enable or disable physical touch controls on the device
            </p>
            <Button 
              primary={touchControl}
              onClick={handleTouchControl}
              disabled={updating}
              className="touch-control-button"
            >
              {touchControl ? 'Enabled' : 'Disabled'}
            </Button>
          </div>
        </div>
        
        {/* Timer Control Section */}
        <div className="control-section timer-control-section">
          <CardTitle className="control-header">
            <FaClock /> Timer Control
          </CardTitle>
          <div className="timer-control-container">
            <p className="timer-description">
              Set a timer to automatically dispense food
            </p>
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
          </div>
          
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
        </div>
        
        {/* Schedule Control Section */}
        <div className="control-section schedule-control-section">
          <CardTitle className="control-header">
            <FaCalendarAlt /> Schedule Feedings
          </CardTitle>
          
          <div className="schedule-form">
            <p className="schedule-description">
              Create a schedule for automatic feedings
            </p>
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
              
              <div className="time-input-container">
                <Input 
                  type="time"
                  value={convertTo24Hour(newSchedule.time)}
                  onChange={(e) => setNewSchedule({
                    ...newSchedule, 
                    time: convertTo12Hour(e.target.value)
                  })}
                  className="time-input-hidden"
                />
                <select
                  value={newSchedule.time.split(' ')[0]}
                  onChange={(e) => {
                    const hourMin = e.target.value;
                    const period = newSchedule.time.includes('PM') ? 'PM' : 'AM';
                    setNewSchedule({...newSchedule, time: `${hourMin} ${period}`});
                  }}
                  className="hour-select"
                >
                  {[
                    '12:00', '12:30', 
                    '1:00', '1:30', 
                    '2:00', '2:30', 
                    '3:00', '3:30', 
                    '4:00', '4:30', 
                    '5:00', '5:30', 
                    '6:00', '6:30',
                    '7:00', '7:30',
                    '8:00', '8:30',
                    '9:00', '9:30',
                    '10:00', '10:30',
                    '11:00', '11:30',
                  ].map(time => (
                    <option key={time} value={time}>{time}</option>
                  ))}
                </select>
                
                <select
                  value={newSchedule.time.split(' ')[1]}
                  onChange={(e) => {
                    const hourMin = newSchedule.time.split(' ')[0];
                    setNewSchedule({...newSchedule, time: `${hourMin} ${e.target.value}`});
                  }}
                  className="ampm-select"
                >
                  <option value="AM">AM</option>
                  <option value="PM">PM</option>
                </select>
              </div>
              
              <Input 
                type="number"
                min="1"
                max="30"
                value={newSchedule.duration}
                onChange={(e) => setNewSchedule({...newSchedule, duration: parseInt(e.target.value) || ''})}
                placeholder="Duration in seconds"
                className="duration-input"
                required
              />
              
              <Button 
                primary 
                onClick={handleAddSchedule}
                disabled={updating}
                className="add-button"
              >
                <FaPlus /> {!isMobile && "Add"}
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
                    <p className="schedule-time">{schedule.time || convertTo12Hour(schedule.time24h)}</p>
                    <p className="schedule-duration">
                      Duration: {schedule.duration}s
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
                      aria-label="Delete schedule"
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
      </ControlPanel>
      
      <Card>
        <CardTitle className="history-title">
          <FaHistory /> Feeding History
        </CardTitle>
        {device.lastFed ? (
          <div className="history-entry">
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