import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../services/authService';
import { getCartByUserId } from '../services/cartService';
import LoginComponent from '../components/Login';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showCookieWarning, setShowCookieWarning] = useState(true);
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
      const cart = await getCartByUserId(userInfo.token, userInfo.id);
      if (cart.length > 0) {
        navigate('/cart');
        return;
      }
      navigate('/main');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleAcceptCookies = () => {
    setShowCookieWarning(false);
    // You can also set a cookie to remember the user's choice
    document.cookie = "cookiesAccepted=true; path=/; max-age=31536000"; // 1 year
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
          showCookieWarning={showCookieWarning}
          handleAcceptCookies={handleAcceptCookies}
          handleSubmit={handleSubmit} 
        />
        <Link to="/register">
          <button>Register</button>
        </Link>
      </div>
    </div>
  );
}

export default LoginPage;