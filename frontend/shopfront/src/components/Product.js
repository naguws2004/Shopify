import React from 'react';

function Product({ userName, name, description, company, category, major_conditions, minor_conditions, price, handleBack, handleSettings, handleLogout }) {
  return (
    <div className="main">
      <br/>
      <div className='main-form-header'>
        <span>Hello {userName}!</span>&nbsp;
        <button type="settings" onClick={handleSettings}>Settings</button>&nbsp;
        <button type="logout" onClick={handleLogout}>Logout</button>
      </div>
      <h2>Product</h2>
      <div className='main-form-header'>
        <button type="back" onClick={handleBack}>Back</button>
      </div><br />
      <div className="main-form-body">
        <table>
          <tr>
            <td>
              <label>Name:</label>
            </td>
            <td>
              <input
                type="name"
                value={name}
                readOnly
              />
            </td>
          </tr>
          <tr>
            <td>
              <label>Description:</label>
            </td>
            <td>
              <input
                type="description"
                value={description}
                readOnly
              />
            </td>
          </tr>
          <tr>
            <td>
              <label>Company:</label>
            </td>
            <td>
              <input
                type="company"
                value={company}
                readOnly
              />
            </td>
          </tr>
          <tr>
            <td>
              <label>Category:</label>
            </td>
            <td>
              <input
                type="category"
                value={category}
                readOnly
              />
            </td>
          </tr>
          <tr>
            <td>
              <label>Major Conditions:</label>
            </td>
            <td>
              <input
                type="major_conditions"
                value={major_conditions}
                readOnly
              />
            </td>
          </tr>
          <tr>
            <td>
              <label>Minor Conditions:</label>
            </td>
            <td>
              <input
                type="minor_conditions"
                value={minor_conditions}
                readOnly
              />
            </td>
          </tr>
          <tr>
            <td>
              <label>Price:</label>
            </td>
            <td>
              <input
                type="price"
                value={price}
                readOnly
              />
            </td>
          </tr>
        </table>
      </div>
    </div>
  );
}

export default Product;