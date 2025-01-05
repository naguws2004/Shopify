import React from 'react';

function Main({ name, company, handleCompanyChange, category, handleCategoryChange, major_conditions, handleMajorConditionsChange, minor_conditions, handleMinorConditionsChange, handleSettings, handleLogout, handleSaveProceed, handleResetQuery }) {
  return (
    <div className="main">
      <br/>
      <div className='main-form-header'>
        <span>Hello {name}!</span>&nbsp;
        <button type="settings" onClick={handleSettings}>Settings</button>&nbsp;
        <button type="logout" onClick={handleLogout}>Logout</button>
      </div>
      <h2>Products Query</h2>
      <div className='main-form-header'>
        <button onClick={() => handleResetQuery()}>Reset Query</button>&nbsp;
        <button onClick={() => handleSaveProceed()}>Save & Proceed</button>&nbsp;
      </div><br />
      <div className='main-form-body'>
        <br />
        <table>
          <tbody>
            <tr>
              <td>Which company products are you searching for:</td>
              <td><input type="text" placeholder="Company Name" value={company} 
                    onChange={handleCompanyChange} />
              </td>
            </tr>
            <tr>
              <td>Which category of products are you searching for:</td>
              <td><input type="text" placeholder="Category Name" value={category} 
                    onChange={handleCategoryChange} />
              </td>
            </tr>
            <tr>
              <td>What are the major conditions for which you are searching for:</td>
              <td><input type="text" placeholder="Major conditions" value={major_conditions} 
                    onChange={handleMajorConditionsChange} />
              </td>
            </tr>
            <tr>
              <td>What are the minor conditions for which you are searching for:</td>
              <td><input type="text" placeholder="Minor conditions" value={minor_conditions} 
                    onChange={handleMinorConditionsChange} />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Main;