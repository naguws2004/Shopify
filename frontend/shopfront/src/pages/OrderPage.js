import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Cookies from 'js-cookie';
import OrderComponent from '../components/Order';
import { getOrderByOrderId, getOrderDetailsByOrderId, cancelOrder, payOrder } from '../services/orderService';
import { increaseProductInventory } from '../services/inventoryService';

function OrderPage() {
  const { order_id } = useParams();
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
      const fetchOrder = await getOrderByOrderId(token, order_id);
      if (fetchOrder.length > 0) {
        setOrder(fetchOrder[0]);
        const fetchProducts = await getOrderDetailsByOrderId(token, order_id);
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
      if (id > 0) await fetchOrder();
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

  const handleLogout = () => {
    handleReset();
    Cookies.remove('userInfo'); // Remove the cookie when the component mounts
    window.history.back();
  };

  const handleSettings = () => {
    navigate('/settings');
  };
 
  const handleShowDetails = (id) => {
    navigate(`/product/${id}`);
  };
  
  const handleCancelOrder = async () => {
    try {
      await cancelOrder(token, order_id);
      await increaseProductInventory(token, products.filter(product => product.id));
      alert('Order cancelled');
      handleReset();
      navigate('/main');
    } catch (err) {
      setError(err.message);
    }
  };
  
  const handleMakePayment = async () => {
    try {
      await payOrder(token, order_id);
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