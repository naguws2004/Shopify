import React from 'react';

function Order({ order, products, name, totalPrice, handleSettings, handleLogout, handleShowDetails, handleMakePayment, handleCancelOrder }) {
  return (
    <div className="main">
      <br/>
      <div className='main-form-header'>
        <span>Hello {name}!</span>&nbsp;
        <button type="settings" onClick={handleSettings}>Settings</button>&nbsp;
        <button type="logout" onClick={handleLogout}>Logout</button>
      </div>
      <h2>Your Order</h2>
      <div className='main-form-header'>
        <button onClick={() => handleCancelOrder()}>Cancel Order</button>&nbsp;
        <button onClick={() => handleMakePayment()}>Make Payment</button>&nbsp;
      </div><br />
      <div className='main-form-body'>
        <div>
          <table>
            <tr>
              <td>
                <label>Order Id:</label>
              </td>
              <td>
                <input type='text' value={order.id} readOnly />
              </td>
            </tr>
            <tr>
              <td>
                <label>Order Date:</label>
              </td>
              <td>
                <input type='text' value={order.order_date} readOnly />
              </td>
            </tr>
            <tr>
              <td>
                <label>Total Price:</label>
              </td>
              <td>
                <input type='text' value={totalPrice} readOnly />
              </td>
            </tr>
          </table>
        </div>
        <br />
        {Array.isArray(products) && products.length > 0 ? (
          products.map((element, index) => (
            <div key={element.id}>
              {index + 1}.&nbsp;
              <input type='text' value={element.name} readOnly />
              <input type='text' value={element.company} readOnly />
              <input type='text' value={element.category} readOnly />
              <input type='text' value={element.price} readOnly />&nbsp;
              <button onClick={() => handleShowDetails(element.id)}>Show Details</button>&nbsp;
            </div>
          ))
        ) : (
          <p>No products available</p>
        )}
        <br />
      </div>
    </div>
  );
}

export default Order;