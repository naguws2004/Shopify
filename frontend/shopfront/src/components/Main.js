import React from 'react';

function Main({ name, handleSettings, handleLogout }) {
  return (
    <div className='main-form-header'>
      <span>Hello {name}!</span>&nbsp;
      <button type="settings" onClick={handleSettings}>Settings</button>&nbsp;
      <button type="logout" onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default Main;