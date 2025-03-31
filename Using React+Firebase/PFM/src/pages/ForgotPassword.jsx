import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Container, 
  Form, 
  FormGroup, 
  Label, 
  Input, 
  FormButton, 
  ErrorMessage 
} from '../components/styled/StyledComponents';
import '../styles/ForgotPassword.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const { resetPassword } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      return setError('Please enter your email address');
    }

    try {
      setError('');
      setMessage('');
      setLoading(true);
      await resetPassword(email);
      setMessage('Check your email for password reset instructions');
    } catch (err) {
      setError('Failed to reset password');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <div className="forgot-password-container">
        <h1 className="forgot-password-title">
          Reset Password
        </h1>
        
        {error && <ErrorMessage>{error}</ErrorMessage>}
        {message && (
          <div className="success-message">
            {message}
          </div>
        )}
        
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="email">Email address</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </FormGroup>
          
          <FormButton 
            primary 
            block 
            type="submit"
            disabled={loading}
          >
            Reset Password
          </FormButton>
        </Form>
        
        <div className="auth-links">
          <Link to="/login" className="auth-link">
            Back to Login
          </Link>
          <Link to="/signup" className="auth-link">
            Create an account
          </Link>
        </div>
      </div>
    </Container>
  );
};

export default ForgotPassword; 