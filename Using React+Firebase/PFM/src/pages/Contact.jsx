import { useState } from 'react';
import { 
  Container,
  FormGroup,
  Label,
  Input,
  FormButton,
  Card
} from '../components/styled/StyledComponents';
import { FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import '../styles/Contact.css';

const Contact = () => {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    
    fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: formData
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setSubmitted(true);
          e.target.reset();
          setError(null);
        } else {
          setError("Form submission failed. Please try again.");
          console.error("Form submission error:", data);
        }
      })
      .catch(err => {
        console.error("Form submission exception:", err);
        setError("Something went wrong. Please try again later.");
      });
    
    // Show success message
    setSubmitted(true);
    
    // Reset form after submission (optional)
    setTimeout(() => {
      setSubmitted(false);
      setError(null);
    }, 5000);
  };

  return (
    <Container>
      <div className="contact-container">
        <h1 className="contact-title">
          Contact Us
        </h1>
        
        {/* Contact info cards in a row on desktop, column on mobile */}
        <div className="contact-cards-container">
          <ContactInfoCard 
            icon={<FaPhone />}
            title="Phone"
            info="8626010324"
            link="tel:8626010324"
          />
          <ContactInfoCard 
            icon={<FaEnvelope />}
            title="Email"
            info="singhabhi292004@gmail.com"
            link="mailto:singhabhi292004@gmail.com"
          />
          <ContactInfoCard 
            icon={<FaMapMarkerAlt />}
            title="Address"
            info="VCET Vasai Mumbai"
            link="https://maps.google.com/?q=VCET+Vasai+Mumbai"
          />
        </div>
        
        <div className="contact-form-container">
          <Card>
            <h2 className="form-title">
              Send Us a Message
            </h2>
            
            {submitted ? (
              <div className="success-message">
                Thank you for your message! We'll get back to you soon.
              </div>
            ) : error ? (
              <div className="error-message">
                {error}
              </div>
            ) : (
              <form 
                className="contact-form"
                action="https://api.web3forms.com/submit" 
                method="POST"
                onSubmit={handleSubmit}
              >
                <input 
                  type="hidden" 
                  name="access_key" 
                  value="33e4e93b-7317-4517-aa82-66f2823faf11" 
                />
                
                {/* Add your email to ensure delivery to the correct address */}
                <input type="hidden" name="from_name" value="Pet Feeder Machine Website" />
                <input type="hidden" name="subject" value="New Contact Form Submission" />
                <input type="hidden" name="redirect" value="https://web3forms.com/success" />
                
                <div className="form-grid">
                  <FormGroup>
                    <Label htmlFor="name">Your Name</Label>
                    <input
                      className="contact-form-input"
                      id="name"
                      name="name"
                      type="text"
                      placeholder="Your Name"
                      required
                    />
                  </FormGroup>
                  
                  <FormGroup>
                    <Label htmlFor="email">Email Address</Label>
                    <input
                      className="contact-form-input"
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Your Email"
                      required
                    />
                  </FormGroup>
                </div>
                
                <FormGroup>
                  <Label htmlFor="phone">Phone Number</Label>
                  <input
                    className="contact-form-input"
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="Your Phone Number"
                    required
                  />
                </FormGroup>
                
                <FormGroup>
                  <Label htmlFor="message">Message</Label>
                  <textarea
                    className="contact-form-textarea"
                    id="message"
                    name="message"
                    placeholder="Your Message"
                    rows="5"
                    required
                  />
                </FormGroup>
                
                {/* Add a honeypot field to prevent spam */}
                <input type="checkbox" name="botcheck" className="honeypot" />
                
                <button type="submit" className="contact-submit-button">
                  Send Message
                </button>
              </form>
            )}
          </Card>
        </div>
      </div>
    </Container>
  );
};

const ContactInfoCard = ({ icon, title, info, link }) => {
  return (
    <Card className="info-card">
      <div className="icon-container">
        {icon}
      </div>
      <h3 className="info-title">{title}</h3>
      {link ? (
        <a href={link} className="info-link" target="_blank" rel="noopener noreferrer">
          <p className="info-text">{info}</p>
        </a>
      ) : (
        <p className="info-text">{info}</p>
      )}
    </Card>
  );
};

export default Contact; 