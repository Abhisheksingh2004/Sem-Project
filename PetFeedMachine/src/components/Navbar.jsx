import { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Navbar as NavbarContainer, 
  Logo, 
  NavLinks, 
  NavLink, 
  Button, 
  UserAvatar,
  MobileMenuToggle,
  ProfileDropdown,
  ProfileMenuItem
} from './styled/StyledComponents';
import { FaBars, FaTimes } from 'react-icons/fa';
import '../styles/Navbar.css';

const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Close mobile menu when resizing to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <NavbarContainer>
      <Logo onClick={() => navigate('/')}>Pet Feeder Machine</Logo>
      
      <MobileMenuToggle onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
        {mobileMenuOpen ? <FaTimes /> : <FaBars />}
      </MobileMenuToggle>
      
      <NavLinks open={mobileMenuOpen}>
        <NavLink as={Link} to="/">HOME</NavLink>
        {currentUser && <NavLink as={Link} to="/dashboard">DASHBOARD</NavLink>}
        <NavLink as={Link} to="/shop">SHOP</NavLink>
        <NavLink as={Link} to="/contact">CONTACT</NavLink>
        
        {!currentUser ? (
          <Button primary inNavbar onClick={() => navigate('/login')}>
            Log In
          </Button>
        ) : (
          <div className="dropdown-container">
            <UserAvatar 
              onClick={() => setShowProfileMenu(!showProfileMenu)}
            >
              {currentUser.email.charAt(0).toUpperCase()}
            </UserAvatar>
            
            {showProfileMenu && (
              <ProfileDropdown>
                <ProfileMenuItem
                  onClick={() => {
                    navigate('/profile');
                    setShowProfileMenu(false);
                    setMobileMenuOpen(false);
                  }}
                >
                  My Account
                </ProfileMenuItem>
                <ProfileMenuItem 
                  logout
                  onClick={() => {
                    handleLogout();
                    setShowProfileMenu(false);
                    setMobileMenuOpen(false);
                  }}
                >
                  Logout
                </ProfileMenuItem>
              </ProfileDropdown>
            )}
          </div>
        )}
      </NavLinks>
    </NavbarContainer>
  );
};

export default Navbar; 