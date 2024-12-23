import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import MainComponent from '../components/Main';

function NotePage() {
  const [error, setError] = useState('');
  const [id, setId] = useState(0);
  const [name, setName] = useState('');
  const [token, setToken] = useState('');
  const navigate = useNavigate();
  const timeoutRef = useRef(null);
  
  useEffect(() => {
    const userCookie = Cookies.get('userInfo');
    if (!userCookie) {
      alert('User is not logged in');
      navigate('/');
      return;
    }
    const user = JSON.parse(userCookie);
    console.log(user.token);
    setName(user.Name);
    setToken(user.token);
  }, [name]);

  useEffect(() => {
    const handleActivity = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        handleLogout();
      }, 60000); // 1 minute
    };

    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('keydown', handleActivity);

    handleActivity(); // Initialize the timeout

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keydown', handleActivity);
    };
  }, []);

  const handleLogout = () => {
    handleReset();
    Cookies.remove('userInfo'); // Remove the cookie when the component mounts
    window.history.back();
  };

  const handleSettings = () => {
    alert('Settings clicked');
    //window.history.back();
  };

  const handleReset = () => {
    setError('');
    setId(0);
  };
  
  return (
    <div>
      {error && <div className='error'>{error}</div>}
      <div>
        <MainComponent 
          name={name} 
          handleSettings={handleSettings} 
          handleLogout={handleLogout} 
        />
      </div>
    </div>
  );
}

export default NotePage;