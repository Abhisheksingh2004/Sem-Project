import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Container, 
  Form, 
  FormGroup, 
  Label, 
  Input, 
  FormButton, 
  ErrorMessage,
  GoogleButton
} from '../components/styled/StyledComponents';
import { FaGoogle } from 'react-icons/fa';
import '../styles/Auth.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setError('');
      setLoading(true);
      await login(email, password);
      navigate('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      setError('Failed to log in. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setError('');
      setLoading(true);
      await loginWithGoogle();
      navigate('/dashboard');
    } catch (error) {
      console.error('Google login error:', error);
      setError('Failed to log in with Google. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <div className="auth-container">
        <h1 className="auth-title">
          Log In
        </h1>
        
        {error && <ErrorMessage>{error}</ErrorMessage>}
        
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="email">Email address or phone number</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </FormGroup>
          
          <FormButton 
            primary 
            block 
            type="submit"
            disabled={loading}
          >
            Log In
          </FormButton>
        </Form>
        
        <div className="divider">or</div>
        
        <GoogleButton 
          block 
          onClick={handleGoogleLogin}
          disabled={loading}
        >
          <FaGoogle /> Continue with Google
        </GoogleButton>
        
        <Link to="/signup" className="auth-link">
          Don't have an account? Sign Up
        </Link>
      </div>
    </Container>
  );
};

export default Login; 