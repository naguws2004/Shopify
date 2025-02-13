import React, { useState, useEffect } from 'react';
import { setCookie, getCookie } from '../common/cookieManager';
import SettingComponent from '../components/Setting';
import { updateUser, updateUserPassword } from '../services/userService';

function SettingPage() {
  const [error, setError] = useState('');
  const [id, setId] = useState(0);
  const [name, setName] = useState('');
  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [password1, setPassword1] = useState('');
  const [changePassword, setChangePassword] = useState(false);
  
  useEffect(() => {
    const userInfo = getCookie('userInfo');
    if (userInfo) {
      setId(userInfo.id);
      setName(userInfo.name);
      setToken(userInfo.token);
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
      const userInfo = getCookie('userInfo');
      userInfo.name = name;
      setCookie('userInfo', userInfo, { expires: 1 }); // Set token cookie for 1 day
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