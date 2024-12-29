import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import ShippingComponent from '../components/Shipping';
import { getAddressById, addAddressById, deleteAddressById } from '../services/authService';
import { createOrder, createOrderDetail, addOrderAddressById } from '../services/orderService';
import { getCartByUserId, deleteCartByUserId } from '../services/cartService';
import { reduceProductInventory } from '../services/inventoryService';

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
      await deleteAddressById(token, id);
      await addAddressById(token, id, address, city, state, pincode, contactno);
      const fetchedCart = await getCartByUserId(token, id);
      const result = await createOrder(token, id);
      for (const element of fetchedCart) {
        await createOrderDetail(token, result.order_id, element.product_id);
      }
      await reduceProductInventory(token, fetchedCart.filter((element) => element.product_id)); 
      await addOrderAddressById(token, result.order_id, address, city, state, pincode, contactno);
      alert('Order created successfully');
      await deleteCartByUserId(token, id);
      setError('');
      navigate(`/order/${result.order_id}`);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleLogout = () => {
    Cookies.remove('userInfo'); // Remove the cookie when the component mounts
    window.history.back();
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