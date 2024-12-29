import React from 'react';

function Shipping({ name, address, setAddress, city, setCity, state, setState, pincode, setPincode, contactno, setContactno, handleSettings, handleLogout, handleCreateOrder, handleBackToCart }) {
  return (
    <div className="main">
      <br/>
      <div className='main-form-header'>
        <span>Hello {name}!</span>&nbsp;
        <button type="settings" onClick={handleSettings}>Settings</button>&nbsp;
        <button type="logout" onClick={handleLogout}>Logout</button>
      </div>
      <h2>Shipping Address</h2>
      <div className='main-form-header'>
        <button onClick={() => handleBackToCart()}>Back to Cart</button>&nbsp;
        <button onClick={() => handleCreateOrder()}>Create Order</button>&nbsp;
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
              <label>Address:</label>
            </td>
            <td>
              <input
                type="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </td>
          </tr>
          <tr>
            <td>
              <label>City:</label>
            </td>
            <td>
              <input
                type="city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
              />
            </td>
          </tr>
          <tr>
            <td>
              <label>State:</label>
            </td>
            <td>
              <input
                type="state"
                value={state}
                onChange={(e) => setState(e.target.value)}
                required
              />
            </td>
          </tr>
          <tr>
            <td>
              <label>Pin Code:</label>
            </td>
            <td>
              <input
                type="pincode"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                required
              />
            </td>
          </tr>
          <tr>
            <td>
              <label>Contact Number:</label>
            </td>
            <td>
              <input
                type="contactno"
                value={contactno}
                onChange={(e) => setContactno(e.target.value)}
                required
              />
            </td>
          </tr>
        </table>
      </div>
    </div>
  );
}

export default Shipping;