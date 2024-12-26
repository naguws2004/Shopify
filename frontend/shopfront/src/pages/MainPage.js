import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import MainComponent from '../components/Main';
import { saveCart } from '../services/cartService';

function MainPage() {
  const [error, setError] = useState('');
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]);
  const [id, setId] = useState(0);
  const [name, setName] = useState('');
  const [token, setToken] = useState('');
  const navigate = useNavigate();
  const timeoutRef = useRef(null);
  
  useEffect(() => {
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
  }, [name]);

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
 
  const handleAddToCart = (id) => {
    setCart((prevCart) =>
      prevCart.includes(id) ? prevCart.filter((item) => item !== id) : [...prevCart, id]
    );
  };
 
  const handleShowDetails = (id) => {
    navigate(`/product/${id}`);
  };
  
  const handleResetCart = () => {
    setCart([]);
  };
  
  const handleSaveProceed = () => {
    try {
      cart.forEach(async (item) => {
        await saveCart(token, id, item);
    });
    } catch (err) {
      setError(err.message);
    }
    alert('Cart saved successfully');
  };

  const handleReset = () => {
    setError('');
    setId(0);
  };
  
  return (
    <div>
      {error && <div className='error'>{error}</div>}
      <div>
        <MainComponent 
          cart={cart}
          setCart={setCart}
          products={products}
          setProducts={setProducts}
          name={name} 
          handleSettings={handleSettings} 
          handleLogout={handleLogout} 
          handleAddToCart={handleAddToCart}
          handleShowDetails={handleShowDetails}
          handleSaveProceed={handleSaveProceed}
          handleResetCart={handleResetCart}
        />
      </div>
    </div>
  );
}

export default MainPage;