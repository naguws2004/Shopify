import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import MainComponent from '../components/Main';
import { saveCart } from '../services/cartService';
import { getProducts } from '../services/productService';

function MainPage() {
  const [error, setError] = useState('');
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]);
  const [id, setId] = useState(0);
  const [name, setName] = useState('');
  const [token, setToken] = useState('');
  const [totalPages, setTotalPages] = useState(1);
  const [filterText, setFilterText] = useState('');
  const [page, setPage] = useState(1);
  const navigate = useNavigate();
  const timeoutRef = useRef(null);

  const fetchProducts = async () => {
    if (name) { 
      try {
        const fetchedProducts = await getProducts(token, page, filterText.trim());
        setProducts(fetchedProducts.products);
        setTotalPages(fetchedProducts.pages);
      } catch (err) {
        setError(err.message);
      }
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page]);

  useEffect(() => {
    fetchProducts();
  }, [filterText]);

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
    fetchProducts();
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

  const handleFilterTextChange = (e) => {
    setFilterText(e.target.value);
  };
  
  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

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
    navigate('/cart');
  };
  
  const handlePreviousOrders = () => {
    alert('Previous orders');
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
          filterText={filterText}
          products={products}
          cart={cart}
          name={name}
          page={page}
          totalPages={totalPages}
          handleFilterTextChange={handleFilterTextChange}
          handlePageChange={handlePageChange}
          handleSettings={handleSettings} 
          handleLogout={handleLogout} 
          handleAddToCart={handleAddToCart}
          handleShowDetails={handleShowDetails}
          handleSaveProceed={handleSaveProceed}
          handleResetCart={handleResetCart}
          handlePreviousOrders={handlePreviousOrders}
        />
      </div>
    </div>
  );
}

export default MainPage;