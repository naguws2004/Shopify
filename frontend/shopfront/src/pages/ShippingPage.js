import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCookie } from '../common/cookieManager';
import { encryptString } from '../common/encryptionManager';
import ShippingComponent from '../components/Shipping';
import { getAddressById } from '../services/userService';
import { createOrder, createOrderDetail, addOrderAddressById } from '../services/orderService';
import { getCartByUserId } from '../services/cartService';

function ShippingPage() {
  const [error, setError] = useState('');
  const [token, setToken] = useState('');
  const [id, setId] = useState(0);
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');
  const [contactno, setContactno] = useState('');
  const navigate = useNavigate();
  
  const fetchAddress = async () => {
    try {
      const address = await getAddressById(token, id);
      if (address.length > 0) {
        setAddress(address[0].address);
        setCity(address[0].city);
        setState(address[0].state);
        setPincode(address[0].pincode);
        setContactno(address[0].contactno);
      } 
    } catch (error) {
      setError('Failed to fetch address');
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
      setAddress('');
      setCity('');
      setState('');
      setPincode('');
      setContactno('');
      if (id > 0) await fetchAddress();
    };

    checkUser();
  }, [id, navigate]);
  
  const handleBackToCart = async () => {
    window.history.back();
  };
  
  const handleCreateOrder = async () => {
    if (!address.trim()) {
      setError('Address cannot be blank');
      return;
    }
    if (!city.trim()) {
      setError('City cannot be blank');
      return;
    }
    if (!state.trim()) {
      setError('State cannot be blank');
      return;
    }
    if (!pincode.trim()) {
      setError('Pincode cannot be blank');
      return;
    }
    if (!contactno.trim()) {
      setError('Contact cannot be blank');
      return;
    }
    try {
      const result = await createOrder(token, id);
      const fetchedCart = await getCartByUserId(token, id);
      const product_ids = [];
      for(const element of fetchedCart) {
        product_ids.push(element.product_id);
      };
      await createOrderDetail(token, result.order_id, product_ids);
      await addOrderAddressById(token, result.order_id, address, city, state, pincode, contactno);
      alert('Order created successfully');
      setError('');
      const encryptedId = encryptString(result.order_id.toString());
      navigate(`/order/${encryptedId}`);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleLogout = () => {
    alert('User is logging out');
    navigate('/');
  };

  const handleSettings = () => {
    navigate('/settings');
  };

  return (
    <div>
      {error && <div className='error'>{error}</div>}
      <div>
        <ShippingComponent 
          name={name} 
          address={address} 
          setAddress={setAddress}
          city={city} 
          setCity={setCity}
          state={state} 
          setState={setState}
          pincode={pincode}
          setPincode={setPincode}
          contactno={contactno}
          setContactno={setContactno}
          handleSettings={handleSettings}
          handleLogout={handleLogout}
          handleCreateOrder={handleCreateOrder}
          handleBackToCart={handleBackToCart}
        />
      </div>
    </div>
  );
}

export default ShippingPage;