import React from 'react';

function Orders({name, filterOrderId, handleFilterOrderIdChange, filterStatus, handleFilterStatusChange, orders, order, isUpdateMode, page, totalPages, handleOrderClick, handlePageChange, handleBack, handleReset, handleOrderPay, handleOrderCancel, handleSettings, handleLogout }) {
  return (
    <div>
      <div className="order">
        <div className="order-list">
          <h2>Orders</h2>
          <div>
            <label>Filter:</label>
            <input type='text' placeholder="Order Id" value={filterOrderId} 
            onChange={handleFilterOrderIdChange} />
            <input type='text' placeholder="Status" value={filterStatus} 
            onChange={handleFilterStatusChange} />
          </div><br />
          {Array.isArray(orders) && orders.length > 0 ? (
            orders.map((element, index) => (
              <div key={element.id}>
                {index + ((page-1)*10) + 1}.&nbsp;
                <input type='text' value={element.id} readOnly />
                <input type='text' value={element.order_date} readOnly />
                <input type='text' value={element.status} readOnly />
                <button onClick={() => handleOrderClick(element.id)}>Edit</button>
              </div>
            ))
          ) : (
            <p>No orders available</p>
          )}
          <br />
          <div>
            <button onClick={() => handlePageChange(page - 1)} disabled={page === 1}>Previous</button>&nbsp;
            <span>Page {page} of {totalPages}</span>&nbsp;
            <button onClick={() => handlePageChange(page + 1)} disabled={page === totalPages}>Next</button>
          </div>
          <br />
        </div>
        <div className='order-form'>
          <div className='main-form-header'>
            <span>Hello {name}!</span>&nbsp;
            <button type="settings" onClick={handleSettings}>Settings</button>&nbsp;
            <button type="logout" onClick={handleLogout}>Logout</button>
          </div>
          <br/>
          <div className='order-form-header'>
            <button type="back" onClick={handleBack}>Back to Main</button>
          </div>
          <br />
          <div className='order-form-body'>
             <table className='order-form-table'>
             <tr>
                <td>
                    <label>Order Id:</label>
                <td>
                </td>
                    <input name="id" value={order.id} readOnly />
                </td>
              </tr>
              <tr>
                <td>
                  <label>Order Date:</label>
                  <td>
                </td>
                  <input name="order_date" value={order.order_date} readOnly />
                </td>
              </tr>
              <tr>
                <td>
                  <label>Status:</label>
                  <td>
                </td>
                  <input name="status" value={order.status} readOnly />
                </td>
              </tr>
              <tr>
                <td colSpan="2">
                  <br />
                  <button onClick={handleReset}>Reset</button>&nbsp;
                  {order.status === 'PENDING' && (
                    <button onClick={handleOrderPay} disabled={!isUpdateMode}>Make Payment</button>
                  )}&nbsp;
                  {order.status !== 'CANCELLED' && (
                    <button onClick={handleOrderCancel} disabled={!isUpdateMode}>Cancel</button> 
                  )}
                </td>
              </tr>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Orders;