import React from 'react';

function Main({ name, handleSettings, handleLogout }) {
  return (
    <div className="main">
      <br/>
      <div className='main-form-header'>
        <span>Hello {name}!</span>&nbsp;
        <button type="settings" onClick={handleSettings}>Settings</button>&nbsp;
        <button type="logout" onClick={handleLogout}>Logout</button>
      </div>
      <div className='main-form-body'>
        <h2>Shopping Cart</h2>
      </div>
    </div>
  );
}

export default Main;