import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Container, 
  Card, 
  CardTitle, 
  CardContent, 
  Button, 
  ErrorMessage 
} from '../components/styled/StyledComponents';
import { FaUser, FaEnvelope, FaSignOutAlt } from 'react-icons/fa';
import '../styles/Profile.css';

const Profile = () => {
  const { currentUser, logout } = useAuth();
  const [error, setError] = useState('');
  
  const handleLogout = async () => {
    try {
      setError('');
      await logout();
    } catch (err) {
      setError('Failed to log out');
      console.error(err);
    }
  };
  
  return (
    <Container>
      <div className="profile-container">
        <h1 className="profile-title">My Account</h1>
        
        {error && <ErrorMessage>{error}</ErrorMessage>}
        
        <Card className="profile-card">
          <CardTitle>Profile Information</CardTitle>
          <CardContent>
            <div className="profile-header">
              <div className="profile-image-container">
                {currentUser.photoURL ? (
                  <img 
                    src={currentUser.photoURL} 
                    alt="Profile" 
                    className="profile-avatar"
                  />
                ) : (
                  <FaUser />
                )}
              </div>
              <div className="profile-info">
                <h2 className="profile-name">
                  {currentUser.displayName || 'Pet Lover'}
                </h2>
                <p className="profile-email">
                  <FaEnvelope /> {currentUser.email}
                </p>
              </div>
            </div>
            
            <Button 
              onClick={handleLogout}
              className="edit-profile-button"
            >
              <FaSignOutAlt /> Sign Out
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardTitle>Account Settings</CardTitle>
          <CardContent>
            <p className="profile-description">
              Manage your account settings and preferences.
            </p>
            
            <div className="profile-form">
              <Button>Change Password</Button>
              <Button>Email Preferences</Button>
              <Button>Delete Account</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Container>
  );
};

export default Profile;

 