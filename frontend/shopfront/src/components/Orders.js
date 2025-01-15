import React from 'react';

function Orders({name, filterOrderId, handleFilterOrderIdChange, filterStatus, handleFilterStatusChange, orders, order, products, isUpdateMode, page, totalPages, handleOrderClick, handlePageChange, handleBack, handleReset, handleOrderPay, handleOrderCancel, handleOrderReturn, handleShowDetails, handleSettings, handleLogout }) {
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
                <input type='text' value={new Date(element.order_date).toISOString().slice(0, 10)} readOnly />
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
          <div className='order-form-form'>
            <div className='main-form-header'>
              <span>Hello {name}!</span>&nbsp;
              <button type="settings" onClick={handleSettings}>Settings</button>&nbsp;
              <button type="logout" onClick={handleLogout}>Logout</button>
            </div>
            <div className='order-form-header'>
              <button style={{margin: '10px'}} type="back" onClick={handleBack}>Back to Products</button>
            </div>
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
                    <button onClick={handleReset}>Reset</button>
                    {order.status === 'CONFIRMED' && (
                      <button onClick={handleOrderPay} disabled={!isUpdateMode}>Make Payment</button>
                    )}
                    {(order.status === 'CONFIRMED' || order.status === 'PAID') && (
                      <button onClick={handleOrderCancel} disabled={!isUpdateMode}>Cancel</button> 
                    )}
                    {(order.status === 'DISPATCHED') && (
                      <button onClick={handleOrderReturn} disabled={!isUpdateMode}>Return</button> 
                    )}
                  </td>
                </tr>
              </table>
            </div>
          </div>
          <div className='order-form-list'>
            <br />
            <div>Items</div><br />
            {Array.isArray(products) && products.length > 0 ? (
              products.map((element, index) => (
                <div key={element.id}>
                  {index + 1}.&nbsp;
                  <input type='text' value={element.name} readOnly />
                  <button onClick={() => handleShowDetails(element.id)}>Show Details</button>
                </div>
              ))
            ) : (
              <p>No items available</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Orders;