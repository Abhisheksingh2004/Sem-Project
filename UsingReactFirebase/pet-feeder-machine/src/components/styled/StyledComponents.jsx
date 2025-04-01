import styled from 'styled-components';

// General layout components
export const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
`;

export const MainContent = styled.main`
  min-height: calc(100vh - 80px);
  padding: 40px 0;
`;

// Navigation components
export const Navbar = styled.nav`
  background-color: #001a42;
  color: white;
  height: 80px;
  display: flex;
  align-items: center;
  padding: 0 20px;
  position: relative;
`;

export const Logo = styled.div`
  font-size: 24px;
  font-weight: bold;
  cursor: pointer;
  
  @media (max-width: 768px) {
    font-size: 20px;
  }
`;

export const NavLinks = styled.div`
  display: flex;
  margin-left: auto;
  gap: 30px;
  align-items: center;
  
  @media (max-width: 768px) {
    flex-direction: column;
    position: absolute;
    top: 80px;
    left: 0;
    right: 0;
    background-color: #001a42;
    padding: 20px;
    gap: 20px;
    align-items: flex-start;
    transform: ${props => props.open ? 'translateY(0)' : 'translateY(-150%)'};
    opacity: ${props => props.open ? '1' : '0'};
    visibility: ${props => props.open ? 'visible' : 'hidden'};
    transition: all 0.3s ease;
    z-index: 10;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
`;

export const NavLink = styled.a`
  color: white;
  text-decoration: none;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    opacity: 0.8;
  }
  
  @media (max-width: 768px) {
    width: 100%;
    padding: 10px 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }
`;

export const MobileMenuToggle = styled.button`
  display: none;
  background: transparent;
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
  margin-left: auto;
  
  @media (max-width: 768px) {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

export const Button = styled.button`
  background-color: ${props => props.primary ? '#7747e3' : 'white'};
  color: ${props => props.primary ? 'white' : '#001a42'};
  border: none;
  border-radius: 30px;
  padding: ${props => props.large ? '12px 24px' : '8px 16px'};
  font-size: ${props => props.large ? '18px' : '16px'};
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: ${props => props.block ? 'block' : 'inline-block'};
  width: ${props => props.block ? '100%' : 'auto'};

  &:hover {
    opacity: 0.9;
    transform: translateY(-2px);
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
    transform: none;
  }
  
  @media (max-width: 768px) {
    width: ${props => props.inNavbar ? '100%' : props.block ? '100%' : 'auto'};
    padding: ${props => props.inNavbar ? '10px 16px' : props.large ? '12px 24px' : '8px 16px'};
    margin: ${props => props.inNavbar ? '10px 0' : '0'};
  }
`;

export const UserAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #7747e3;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  cursor: pointer;
`;

export const ProfileDropdown = styled.div`
  position: absolute;
  top: 50px;
  right: 0;
  background-color: white;
  border-radius: 4px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  padding: 10px;
  z-index: 10;
  width: 150px;
  
  @media (max-width: 768px) {
    position: fixed;
    top: 80px;
    right: 20px;
  }
`;

export const ProfileMenuItem = styled.div`
  padding: 8px;
  cursor: pointer;
  color: ${props => props.logout ? 'red' : '#001a42'};
  border-bottom: ${props => props.logout ? 'none' : '1px solid #eee'};
  
  &:hover {
    background-color: #f5f5f5;
  }
`;

// Form components
export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-width: 400px;
  margin: 0 auto;
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const Input = styled.input`
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
`;

export const Label = styled.label`
  font-weight: 500;
`;

export const FormButton = styled(Button)`
  margin-top: 10px;
`;

export const ErrorMessage = styled.p`
  color: red;
  font-size: 14px;
`;

// Card components
export const Card = styled.div`
  background-color: white;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

export const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

export const CardTitle = styled.h2`
  margin: 0;
  font-size: 24px;
  color: #001a42;
`;

export const CardContent = styled.div`
  margin-bottom: 20px;
`;

export const CardFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 10px;
`;

// Hero section
export const HeroSection = styled.div`
  background-color: #001a42;
  color: white;
  padding: 80px 0;
  text-align: center;
`;

export const HeroTitle = styled.h1`
  font-size: 48px;
  margin-bottom: 20px;
`;

export const HeroSubtitle = styled.p`
  font-size: 20px;
  margin-bottom: 40px;
  opacity: 0.9;
`;

export const GoogleButton = styled(Button)`
  background-color: white;
  color: #4285F4;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  
  svg {
    font-size: 20px;
  }
`;

// Device control components
export const DeviceControlPanel = styled(Card)`
  margin-bottom: 30px;
  overflow: hidden;
  
  @media (max-width: 768px) {
    padding: 15px;
  }
  
  @media (max-width: 480px) {
    padding: 12px;
  }
`;

export const ControlRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
`;

export const ControlLabel = styled.h3`
  margin: 0;
  font-size: 18px;
`;

export const DeviceGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
`; 