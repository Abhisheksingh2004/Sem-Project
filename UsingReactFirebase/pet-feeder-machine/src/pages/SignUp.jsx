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

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    try {
      setError('');
      setLoading(true);
      await signup(email, password);
      navigate('/dashboard');
    } catch (error) {
      console.error('Signup error:', error);
      setError('Failed to create an account. Email may already be in use.');
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
      setError('Failed to sign up with Google. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <div className="auth-container">
        <h1 className="auth-title">
          Create an Account
        </h1>
        
        {error && <ErrorMessage>{error}</ErrorMessage>}
        
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

          <FormGroup>
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </FormGroup>
          
          <FormButton 
            primary 
            block 
            type="submit"
            disabled={loading}
          >
            Sign Up
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
        
        <Link to="/login" className="auth-link">
          Already have an account? Log In
        </Link>
      </div>
    </Container>
  );
};

export default SignUp; 