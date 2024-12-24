import React, { useState } from 'react';
import RegisterComponent from '../components/Register';
import { validateEmail } from '../utils/helper';
import { register } from '../services/authService';

function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password1, setPassword1] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Name cannot be blank');
      return;
    }
    if (!validateEmail(email)) {
      setError('Invalid email address');
      return;
    }
    if (!password.trim()) {
      setError('Password cannot be blank');
      return;
    }
    if (!password1.trim()) {
      setError('Reentered Password cannot be blank');
      return;
    }
    if (password.trim() !== password1.trim()) {
      setError('Passwords do not match');
      return;
    }
    try {
      await register(name, email, password);
      setError('');
      // show success message
      alert('Registered successfully');
      // Redirect to login page
      window.history.back();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCancel = async (e) => {
    window.history.back();
  };

  return (
    <div>
      {error && <div className='error'>{error}</div>}
      <div>
        <RegisterComponent 
          name={name} 
          setName={setName} 
          email={email} 
          setEmail={setEmail} 
          password={password} 
          setPassword={setPassword} 
          password1={password1} 
          setPassword1={setPassword1} 
          handleSubmit={handleSubmit} 
          handleCancel={handleCancel} 
        />
      </div>
    </div>
  );
}

export default RegisterPage;