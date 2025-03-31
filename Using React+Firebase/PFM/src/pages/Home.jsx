import { useNavigate } from 'react-router-dom';
import { 
  Container, 
  HeroSection, 
  HeroTitle, 
  HeroSubtitle, 
  Button,
  Card,
  CardTitle,
  CardContent,
} from '../components/styled/StyledComponents';
import { FaPaw, FaMobile, FaClock, FaShieldAlt } from 'react-icons/fa';
import '../styles/Home.css';

const Home = () => {
  const navigate = useNavigate();

  return (
    <>
      <HeroSection>
        <Container>
          <HeroTitle>Because Every Meal Matters</HeroTitle>
          <HeroSubtitle>Designed with Love, Built for Pets</HeroSubtitle>
          <Button 
            primary 
            large 
            onClick={() => navigate('/dashboard')}
          >
            Controls Panel
          </Button>
        </Container>
      </HeroSection>

      <Container>
        <div className="home-container">
          <h2 className="section-title">
            The Smart Way to Feed Your Pet
          </h2>

          <div className="features-grid">
            <FeatureCard 
              icon={<FaPaw size={40} />}
              title="Pet-Friendly Design"
              description="Crafted with your pet's comfort and accessibility in mind."
            />
            <FeatureCard 
              icon={<FaMobile size={40} />}
              title="Remote Control"
              description="Control feeding times from anywhere using your smartphone."
            />
            <FeatureCard 
              icon={<FaClock size={40} />}
              title="Scheduled Feeding"
              description="Set up regular feeding times for consistency and health."
            />
            <FeatureCard 
              icon={<FaShieldAlt size={40} />}
              title="Secure & Reliable"
              description="Built with high-quality materials and secure technology."
            />
          </div>

          <div className="feature-row">
            <div className="feature-image">
              <img 
                src="https://images.unsplash.com/photo-1583337130417-3346a1be7dee?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80" 
                alt="Dog with food bowl" 
                className="feature-img"
              />
            </div>
            <div className="feature-text">
              <h2 className="feature-title">Never Miss a Meal Again</h2>
              <p className="feature-description">
                Our Pet Feeder Machine ensures your beloved pets are fed on time, every time. Whether you're stuck in traffic, working late, or on vacation, you can rest easy knowing your furry friends are well taken care of.
              </p>
              <p className="feature-description">
                The easy-to-use interface allows you to schedule meals, control portions, and even dispense food on demand with just a tap on your smartphone.
              </p>
              <Button primary onClick={() => navigate('/shop')}>
                Shop Now
              </Button>
            </div>
          </div>

          <div className="setup-section">
            <h2 className="feature-title">Setup Your Device in Minutes</h2>
            <p className="setup-description">
              Getting started is simple. Connect your Pet Feeder Machine to your WiFi network, scan the QR code, and start controlling your pet's feeding schedule instantly.
            </p>
            <Button primary large onClick={() => navigate('/login')}>
              Get Started
            </Button>
          </div>
        </div>
      </Container>
    </>
  );
};

const FeatureCard = ({ icon, title, description }) => {
  return (
    <Card className="feature-card">
      <div className="feature-icon">
        {icon}
      </div>
      <CardTitle className="card-title">{title}</CardTitle>
      <CardContent className="card-content">{description}</CardContent>
    </Card>
  );
};

export default Home; 