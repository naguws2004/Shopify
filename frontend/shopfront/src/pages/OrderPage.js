import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getCookie } from '../common/cookieManager';
import { encryptString, decryptString } from '../common/encryptionManager';
import OrderComponent from '../components/Order';
import { getOrderByOrderId, getOrderDetailsByOrderId, cancelOrder, payOrder } from '../services/orderService';

function OrderPage() {
  const { order_id } = useParams();
  const [orderId, setOrderId] = useState('');
  const [error, setError] = useState('');
  const [order, setOrder] = useState({});
  const [products, setProducts] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [id, setId] = useState(0);
  const [name, setName] = useState('');
  const [token, setToken] = useState('');
  const navigate = useNavigate();
  const timeoutRef = useRef(null);
  
  const fetchOrder = async () => {
    try {
      const oid = decryptString(order_id);
      setOrderId(oid);
      const fetchOrder = await getOrderByOrderId(token, oid);
      if (fetchOrder.length > 0) {
        const selectedOrder = fetchOrder[0];
        setOrder({
          ...selectedOrder,
          order_date: selectedOrder.order_date ? new Date(selectedOrder.order_date).toISOString().slice(0, 10) : '',
          payment_date: selectedOrder.payment_date ? new Date(selectedOrder.payment_date).toISOString().slice(0, 10) : '',
          dispatch_date: selectedOrder.dispatch_date ? new Date(selectedOrder.dispatch_date).toISOString().slice(0, 10) : '',
          cancelled_date: selectedOrder.cancelled_date ? new Date(selectedOrder.cancelled_date).toISOString().slice(0, 10) : ''
        });
        const fetchProducts = await getOrderDetailsByOrderId(token, oid);
        setProducts(fetchProducts);
        const sum = fetchProducts.reduce((acc, item) => acc + parseFloat(item.price), 0);
        setTotalPrice(sum.toFixed(2));
      }
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    const checkUser = async () => {
      const userInfo = getCookie('userInfo');
      if (!userInfo) {
        alert('User is logging out');
        navigate('/');
        return;
      }
      setId(userInfo.id);
      setName(userInfo.name);
      setToken(userInfo.token);
      if (id > 0) await fetchOrder();
    };

    checkUser();
  }, [id, navigate]);

  useEffect(() => {
    const handleActivity = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        handleLogout();
      }, 300000); // 5 minute
    };

    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('keydown', handleActivity);

    handleActivity(); // Initialize the timeout

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keydown', handleActivity);
    };
  }, []);

  const handleLogout = () => {
    alert('User is logging out');
    navigate('/');
  };

  const handleSettings = () => {
    navigate('/settings');
  };
 
  const handleShowDetails = (id) => {
    const encryptedId = encryptString(id.toString());
    navigate(`/product/${encryptedId}`);
  };
  
  const handleCancelOrder = async () => {
    try {
      await cancelOrder(token, orderId);
      alert('Order cancelled');
      handleReset();
      navigate('/main');
    } catch (err) {
      setError(err.message);
    }
  };
  
  const handleMakePayment = async () => {
    try {
      await payOrder(token, orderId);
      alert('Payment successful');
      handleReset();
      navigate('/main');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleReset = () => {
    setError('');
    setId(0);
  };
  
  return (
    <div>
      {error && <div className='error'>{error}</div>}
      <div>
        <OrderComponent 
          order={order}
          products={products}
          name={name}
          totalPrice={totalPrice} 
          handleSettings={handleSettings} 
          handleLogout={handleLogout} 
          handleShowDetails={handleShowDetails}
          handleMakePayment={handleMakePayment}
          handleCancelOrder={handleCancelOrder}
        />
      </div>
    </div>
  );
}

export default OrderPage;