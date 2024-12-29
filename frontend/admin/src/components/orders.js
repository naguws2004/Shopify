import React, { useState, useEffect } from 'react';
import { getOrders } from '../services/orderService';

const Orders = () => {
  const [error, setError] = useState('');
  const [orders, setOrders] = useState([]);
  const [filterText, setFilterText] = useState('');
  const [filterOrderId, setFilterOrderId] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchOrders = async () => {
    try {
      const fetchedOrders = await getOrders(page, filterText.trim(), filterOrderId.trim());
      setOrders(fetchedOrders.orders);
      setTotalPages(fetchedOrders.pages);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [page]);

  useEffect(() => {
    fetchOrders();
  }, [filterText]);

  useEffect(() => {
    fetchOrders();
  }, [filterOrderId]);

  const handleBack = () => {
    window.history.back();
  };
  
  const handleOrderClick = (id) => {
    const selectedOrder = orders.find(order => order.id === id);
    //setId(selectedProduct.id);
    //setProduct(selectedProduct);
    //setIsUpdateMode(true); // Enable update mode
  };

  const handleFilterTextChange = (e) => {
    setFilterText(e.target.value);
  };

  const handleFilterOrderIdChange = (e) => {
    setFilterOrderId(e.target.value);
  };
  
  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  return (
    <div>
      {error && <div className='error'>{error}</div>}
      <div className="product">
        <div className="product-list">
          <h2>Orders</h2>
          <div>
            <label>Filter:</label>
            <input type='text' placeholder="Customer Name" value={filterText} 
            onChange={handleFilterTextChange} />&nbsp;
            <input type='text' placeholder="Order Id" value={filterOrderId} 
            onChange={handleFilterOrderIdChange} />
          </div><br />
          {Array.isArray(orders) && orders.length > 0 ? (
            orders.map((element, index) => (
              <div key={element.id}>
                {index + ((page-1)*10) + 1}.&nbsp;
                <input type='text' value={element.id} readOnly />
                <input type='text' value={element.order_date} readOnly />
                <input type='text' value={element.name} readOnly />
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
        <div className='product-form'>
          <div className='product-form-header'>
            <span>Hello Admin!</span>&nbsp;
            <button type="back" onClick={handleBack}>Back to Main</button>
          </div>
          <br />
          <div className='product-form-body'>
            {/* <table className='product-form-table'>
              <tr>
                <td>
                    <label>Name:</label>
                <td>
                </td>
                    <input name="name" value={product.name} onChange={handleChange} placeholder="Name" required />
                </td>
              </tr>
              <tr>
                <td>
                  <label>Description:</label>
                  <td>
                </td>
                  <input name="description" value={product.description} onChange={handleChange} placeholder="Description" />
                </td>
              </tr>
              <tr>
                <td>
                  <label>Company:</label>
                  <td>
                </td>
                  <input name="company" value={product.company} onChange={handleChange} placeholder="Company" required />
                </td>
              </tr>
              <tr>
                <td>
                  <label>Category:</label>
                  <td>
                </td>
                  <input name="category" value={product.category} onChange={handleChange} placeholder="Category" required />
                </td>
              </tr>
              <tr>
                <td>
                  <label>Major Conditions:</label>
                  <td>
                </td>
                  <input name="major_conditions" value={product.major_conditions} onChange={handleChange} placeholder="Major Conditions" />
                </td>
              </tr>
              <tr>
                <td>
                  <label>Minor Conditions:</label>
                  <td>
                </td>
                  <input name="minor_conditions" value={product.minor_conditions} onChange={handleChange} placeholder="Minor Conditions" />
                </td>
              </tr>
              <tr>
                <td>
                  <label>Price:</label>
                  <td>
                </td>
                  <input name="price" type="number" value={product.price} onChange={handleChange} placeholder="Price" required />
                </td>
              </tr>
              <tr>
                <td>
                  <label>Inventory:</label>
                  <td>
                </td>
                  <input name="inventory" type="number" value={product.inventory} onChange={handleChange} placeholder="Inventory" required />
                </td>
              </tr>
              <tr>
                <td colSpan="2">
                  <br />
                  { <button onClick={handleReset}>Reset</button>&nbsp;
                  <button onClick={handleCreateProduct} disabled={isUpdateMode}>Create</button>&nbsp;
                  <button onClick={handleUpdateProduct} disabled={!isUpdateMode}>Update</button>&nbsp;
                  <button onClick={handleDeleteProduct} disabled={!isUpdateMode}>Delete</button> }
                </td>
              </tr>
            </table> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Orders;