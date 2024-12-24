import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../services/authService';
import LoginComponent from '../components/Login';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    Cookies.remove('userInfo'); // Remove the cookie when the component mounts
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userInfo = await login(email, password);
      setError('');
      Cookies.set('userInfo', JSON.stringify(userInfo), { expires: 1 }); // Set token cookie for 1 day
      alert('Logged in successfully');
      navigate('/main');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      {error && <div className='error'>{error}</div>}
      <div className="LoginPage">
        <LoginComponent 
          email={email} 
          setEmail={setEmail} 
          password={password} 
          setPassword={setPassword} 
          handleSubmit={handleSubmit} 
        />
        <Link to="/register">
          <button>Go To Registration</button>
        </Link>
      </div>
    </div>
  );
}

export default LoginPage;