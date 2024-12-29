import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import CartComponent from '../components/Cart';
import { getCartByUserId, deleteCartByUserId } from '../services/cartService';

function CartPage() {
  const [error, setError] = useState('');
  const [cart, setCart] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [id, setId] = useState(0);
  const [name, setName] = useState('');
  const [token, setToken] = useState('');
  const navigate = useNavigate();
  const timeoutRef = useRef(null);
  
  const fetchCart = async () => {
    try {
      const fetchedCart = await getCartByUserId(token, id);
      setCart(fetchedCart);
      const sum = fetchedCart.reduce((acc, item) => acc + parseFloat(item.price), 0);
      setTotalPrice(sum.toFixed(2));
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
      if (id > 0) await fetchCart();
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
  
  const handleCancelCart = async () => {
    try {
      await deleteCartByUserId(token, id);
    } catch (err) {
      setError(err.message);
    }
    alert('Cart cancelled');
    navigate('/main');
  };
  
  const handleSaveProceed = () => {
    try {
      cart.forEach(async (item) => {
        //await saveCart(token, id, item);
    });
    } catch (err) {
      setError(err.message);
    }
    navigate('/shipping');
  };

  const handleReset = () => {
    setError('');
    setId(0);
  };
  
  return (
    <div>
      {error && <div className='error'>{error}</div>}
      <div>
        <CartComponent 
          cart={cart}
          name={name}
          totalPrice={totalPrice} 
          handleSettings={handleSettings} 
          handleLogout={handleLogout} 
          handleShowDetails={handleShowDetails}
          handleSaveProceed={handleSaveProceed}
          handleCancelCart={handleCancelCart}
        />
      </div>
    </div>
  );
}

export default CartPage;