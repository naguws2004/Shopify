import React, { useState, useEffect } from 'react';

function Main({ filterText, products, cart, name, page, totalPages, handleFilterTextChange, handlePageChange, handleSettings, handleLogout, handleAddToCart, handleShowDetails, handleSaveProceed, handleResetCart, handlePreviousOrders }) {
  return (
    <div className="main">
      <br/>
      <div className='main-form-header'>
        <span>Hello {name}!</span>&nbsp;
        <button type="settings" onClick={handleSettings}>Settings</button>&nbsp;
        <button type="logout" onClick={handleLogout}>Logout</button>
      </div>
      <h2>Shopping Cart</h2>
      <div className='main-form-header'>
        <button onClick={() => handlePreviousOrders()}>Previous Orders</button>&nbsp;
        <button onClick={() => handleResetCart()} disabled={cart.length === 0}>Reset Cart</button>&nbsp;
        <button onClick={() => handleSaveProceed()} disabled={cart.length === 0}>Save & Proceed</button>&nbsp;
      </div><br />
      <div className='main-form-body'>
        <div>
          <label>Filter:</label>
          <input type='text' placeholder="Product Name" value={filterText} 
          onChange={handleFilterTextChange} />
        </div><br />
        {Array.isArray(products) && products.length > 0 ? (
          products.map((element, index) => (
            <div key={element.id}>
              {index + ((page-1)*8) + 1}.&nbsp;
              <input type='text' value={element.name} readOnly />
              <input type='text' value={element.company} readOnly />
              <input type='text' value={element.category} readOnly />
              <input type='text' value={element.price} readOnly />&nbsp;
              <button
                  className={cart.includes(element.id) ? 'remove-from-cart' : 'add-to-cart'}
                  onClick={() => {
                    handleAddToCart(element.id);
                  }}
                >
                  {cart.includes(element.id) ? 'Remove from Cart' : 'Add to Cart'}
              </button>&nbsp;
              <button onClick={() => handleShowDetails(element.id)}>Show Details</button>&nbsp;
            </div>
          ))
        ) : (
          <p>No products available</p>
        )}
        <br />
        <div>
          <button onClick={() => handlePageChange(page - 1)} disabled={page === 1}>Previous</button>&nbsp;
          <span>Page {page} of {totalPages}</span>&nbsp;
          <button onClick={() => handlePageChange(page + 1)} disabled={page === totalPages}>Next</button>
        </div>
      </div>
    </div>
  );
}

export default Main;