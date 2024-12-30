import React, { useState, useEffect } from 'react';
import { getOrders, payOrder, dispatchOrder, cancelOrder } from '../services/orderService';

const Orders = () => {
  const blankOrder = {
    id: '',
    name: '',
    email: '',
    order_date: '',
    payment_date: '',
    dispatch_date: '',
    cancelled_date: '',
    status: ''
  };
  const [error, setError] = useState('');
  const [orders, setOrders] = useState([]);
  const [order, setOrder] = useState(blankOrder);
  const [id, setId] = useState('');
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const [filterText, setFilterText] = useState('');
  const [filterOrderId, setFilterOrderId] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchOrders = async () => {
    try {
      const fetchedOrders = await getOrders(page, filterText.trim(), filterOrderId.trim(), filterStatus.trim());
      setOrders(fetchedOrders.orders);
      setTotalPages(fetchedOrders.pages);
      handleReset();
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

  useEffect(() => {
    fetchOrders();
  }, [filterStatus]);

  useEffect(() => {
    handleReset();
  }, [orders]);

  const handleBack = () => {
    handleReset();
    window.history.back();
  };
  
  const handleOrderClick = (id) => {
    handleReset();
    const selectedOrder = orders.find(order => order.id === id);
    setId(selectedOrder.id);
    setOrder({
      ...selectedOrder,
      payment_date: selectedOrder.payment_date ? new Date(selectedOrder.payment_date).toISOString().slice(0, 10) : '',
      dispatch_date: selectedOrder.dispatch_date ? new Date(selectedOrder.dispatch_date).toISOString().slice(0, 10) : '',
      cancelled_date: selectedOrder.cancelled_date ? new Date(selectedOrder.cancelled_date).toISOString().slice(0, 10) : ''
    });
    setIsUpdateMode(true); // Enable update mode
  };

  const handleReset = () => {
    setOrder(blankOrder);
    setError('');
    setId('');
    setIsUpdateMode(false); // Disable update mode
  };

  const handleOrderPaid = async () => {
    if (!order.payment_date) {
      setError('Payment date cannot be blank');
      return;
    }
    try {
      await payOrder(id, order.payment_date);
      alert('Order updated successfully');
      fetchOrders();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleOrderDispatched = async () => {
    if (!order.dispatch_date) {
      setError('Dispatch date cannot be blank');
      return;
    }
    try {
      await dispatchOrder(id, order.dispatch_date);
      alert('Order updated successfully');
      fetchOrders();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleOrderCancel = async () => {
    if (!order.cancelled_date) {
      setError('Cancelled date cannot be blank');
      return;
    }
    try {
      await cancelOrder(id, order.cancelled_date);
      alert('Order updated successfully');
      fetchOrders();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setOrder({ ...order, [name]: value });
  };

  const handleFilterTextChange = (e) => {
    setFilterText(e.target.value);
  };

  const handleFilterOrderIdChange = (e) => {
    setFilterOrderId(e.target.value);
  };
  
  const handleFilterStatusChange = (e) => {
    setFilterStatus(e.target.value);
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
            <input type='text' placeholder="Status" value={filterStatus} 
            onChange={handleFilterStatusChange} />
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
             <table className='product-form-table'>
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
                    <label>Name:</label>
                <td>
                </td>
                    <input name="name" value={order.name} readOnly />
                </td>
              </tr>
              <tr>
                <td>
                  <label>Email:</label>
                  <td>
                </td>
                  <input name="email" value={order.email} readOnly />
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
              {(order.status === 'PENDING' || order.status === 'CANCELLED') && (
                <>
                  <tr>
                    <td>
                      <label>Payment Date:</label>
                    <td>
                    </td>
                      <input type='date' name="payment_date" value={order.payment_date} onChange={handleChange} placeholder="Payment Date" />
                    </td>
                  </tr>
                </>
              )}
              <tr>
              </tr>
              {(order.status === 'PAID' || order.status === 'CANCELLED') && (
                <>
                  <tr>
                    <td>
                      <label>Dispatched Date:</label>
                      <td>
                      </td>
                      <input type='date' name="dispatch_date" value={order.dispatch_date} onChange={handleChange} placeholder="Dispatch Date" />
                    </td>
                  </tr>
                </>
              )}
              <tr>
                <td>
                  <label>Cancelled Date:</label>
                  <td>
                  </td>
                  <input type='date' name="cancelled_date" value={order.cancelled_date} onChange={handleChange} placeholder="Cancelled Date" />
                </td>
              </tr>
              <tr>
                <td colSpan="2">
                  <br />
                  <button onClick={handleReset}>Reset</button>&nbsp;
                  {order.status === 'PENDING' && (
                    <button onClick={handleOrderPaid} disabled={!isUpdateMode}>Mark Paid</button>
                  )}&nbsp;
                  {order.status === 'PAID' && (
                    <button onClick={handleOrderDispatched} disabled={!isUpdateMode}>Mark Dispatch</button>
                  )}&nbsp;
                  <button onClick={handleOrderCancel} disabled={!isUpdateMode}>Cancel</button> 
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