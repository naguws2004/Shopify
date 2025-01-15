import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCookie } from '../common/cookieManager';
import { encryptString } from '../common/encryptionManager';
import ProductsComponent from '../components/Products';
import { saveCart } from '../services/cartService';
import { getProducts } from '../services/productService';
import { getQueryById } from '../services/userService';

function ProductsPage() {
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
    if (id > 0) { 
      try {
        const fetchedQuery = await getQueryById(token, id);
        if (fetchedQuery.length > 0) {
          const fetchedProducts = await getProducts(token, page, filterText.trim(), fetchedQuery[0].company, fetchedQuery[0].category, fetchedQuery[0].major_conditions, fetchedQuery[0].minor_conditions); 
          setProducts(fetchedProducts.products);
          setTotalPages(fetchedProducts.pages);
        }
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
    const userInfo = getCookie('userInfo');
    if (!userInfo) {
      alert('User is logging out');
      navigate('/');
      return;
    }
    setId(userInfo.id);
    setName(userInfo.name);
    setToken(userInfo.token);
    fetchProducts();
  }, [name]);

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

  const handleFilterTextChange = (e) => {
    setFilterText(e.target.value);
  };
  
  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleLogout = () => {
    alert('User is logging out');
    navigate('/');
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
    const encryptedId = encryptString(id.toString());
    navigate(`/product/${encryptedId}`);
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
    navigate('/orders');
  };
  
  const handleBack = () => {
    handleReset();
    window.history.back();
  };

  const handleReset = () => {
    setError('');
    setId(0);
  };
  
  return (
    <div>
      {error && <div className='error'>{error}</div>}
      <div>
        <ProductsComponent 
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
          handleBack={handleBack}
        />
      </div>
    </div>
  );
}

export default ProductsPage;