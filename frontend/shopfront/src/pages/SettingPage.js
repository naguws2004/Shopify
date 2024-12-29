import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import SettingComponent from '../components/Setting';
import { updateUser, updateUserPassword } from '../services/authService';

function SettingPage() {
  const [error, setError] = useState('');
  const [id, setId] = useState(0);
  const [name, setName] = useState('');
  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [password1, setPassword1] = useState('');
  const [changePassword, setChangePassword] = useState(false);
  
  useEffect(() => {
    const userInfo = Cookies.get('userInfo');
    if (userInfo) {
      const user = JSON.parse(userInfo);
      setId(user.id);
      setName(user.name);
      setToken(user.token);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Name cannot be blank');
      return;
    }
    if (password.trim() !== password1.trim()) {
      setError('Passwords do not match');
      return;
    }
    try {
      if (!password.trim()) {
        await updateUser(token, id, { name: name });
      }
      else {
        await updateUserPassword(token, id, { name: name, password: password });
      }
      setError('');
      // show success message
      alert('Settings updated successfully');
      const userInfo = Cookies.get('userInfo');
      const user = JSON.parse(userInfo);
      user.name = name;
      Cookies.set('userInfo', JSON.stringify(user), { expires: 1 }); // Set token cookie for 1 day
      // Redirect to main page
      window.history.back();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCancel = async (e) => {
    e.preventDefault();
    window.history.back();
  };

  return (
    <div>
      {error && <div className='error'>{error}</div>}
      <div>
        <SettingComponent 
          name={name} 
          setName={setName} 
          password={password} 
          setPassword={setPassword} 
          password1={password1} 
          setPassword1={setPassword1} 
          changePassword={changePassword}
          setChangePassword={setChangePassword}
          handleSubmit={handleSubmit} 
          handleCancel={handleCancel} 
        />
      </div>
    </div>
  );
}

export default SettingPage;