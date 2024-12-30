import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import OrdersComponent from '../components/Orders';
import { getOrders, cancelOrder, payOrder } from '../services/orderService';

function OrdersPage() {
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
  const [id, setId] = useState(0);
  const [name, setName] = useState('');
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const [filterText, setFilterText] = useState('');
  const [filterOrderId, setFilterOrderId] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [token, setToken] = useState('');
  const navigate = useNavigate();
  const timeoutRef = useRef(null);

  const fetchOrders = async () => {
    if (id > 0) {
      try {
        const fetchedOrders = await getOrders(token, page, id, filterText.trim(), filterOrderId.trim(), filterStatus.trim());
        setOrders(fetchedOrders.orders);
        setTotalPages(fetchedOrders.pages);
        handleReset();
      } catch (err) {
        setError(err.message);
      }
    }
  };

  useEffect(() => {
    const checkUser = async () => {
      const userInfo = Cookies.get('userInfo');
      if (!userInfo) {
        alert('User is not logged in');
        navigate('/');
        return;
      }
      const user = JSON.parse(userInfo);
      setId(user.id);
      setName(user.name);
      setToken(user.token);
      await fetchOrders();
    };

    checkUser();
  }, [id, navigate]);

  // useEffect(() => {
  //   const handleActivity = () => {
  //     if (timeoutRef.current) {
  //       clearTimeout(timeoutRef.current);
  //     }
  //     timeoutRef.current = setTimeout(() => {
  //       handleLogout();
  //     }, 60000); // 1 minute
  //   };

  //   window.addEventListener('mousemove', handleActivity);
  //   window.addEventListener('keydown', handleActivity);

  //   handleActivity(); // Initialize the timeout

  //   return () => {
  //     if (timeoutRef.current) {
  //       clearTimeout(timeoutRef.current);
  //     }
  //     window.removeEventListener('mousemove', handleActivity);
  //     window.removeEventListener('keydown', handleActivity);
  //   };
  // }, []);

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
  
  const handleLogout = () => {
    handleReset();
    Cookies.remove('userInfo'); // Remove the cookie when the component mounts
    window.history.back();
  };

  const handleSettings = () => {
    navigate('/settings');
  };

  const handleOrderClick = (id) => {
    handleReset();
    const selectedOrder = orders.find(order => order.id === id);
    setOrder(selectedOrder);
    setIsUpdateMode(true); // Enable update mode
  };

  const handleReset = () => {
    setOrder(blankOrder);
    setError('');
    setIsUpdateMode(false); // Disable update mode
  };

  const handleOrderPay = async () => {
    try {
      await payOrder(id);
      alert('Order updated successfully');
      fetchOrders();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleOrderCancel = async () => {
    try {
      await cancelOrder(id);
      ///*** increase inventory */
      alert('Order updated successfully');
      fetchOrders();
    } catch (err) {
      setError(err.message);
    }
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
      <div>
        <OrdersComponent 
          name={name}
          filterOrderId={filterOrderId}
          handleFilterOrderIdChange={handleFilterOrderIdChange}
          filterStatus={filterStatus}
          handleFilterStatusChange={handleFilterStatusChange}
          orders={orders}
          order={order}
          isUpdateMode={isUpdateMode}
          page={page}
          totalPages={totalPages}
          handleOrderClick={handleOrderClick}
          handlePageChange={handlePageChange}
          handleBack={handleBack}
          handleReset={handleReset}
          handleOrderPay={handleOrderPay}
          handleOrderCancel={handleOrderCancel}
          handleSettings={handleSettings}
          handleLogout={handleLogout}
        />
      </div>
    </div>
  );
};

export default OrdersPage;