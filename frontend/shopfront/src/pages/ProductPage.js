import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getCookie } from '../common/cookieManager';
import { decryptString } from '../common/encryptionManager';
import ProductComponent from '../components/Product';
import { getProduct } from '../services/productService';

function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState({});
  const [userName, setUserName] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [company, setCompany] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [major_conditions, setMajor_conditions] = useState('');
  const [minor_conditions, setMinor_conditions] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fetchProduct = async (token) => {
    try {
      const decryptedId = decryptString(id);
      const fetchedProduct = await getProduct(token, decryptedId);
      setProduct(fetchedProduct);
    } catch (error) {
      setError('Failed to fetch product');
    }
  };

  useEffect(() => {
    const userInfo = getCookie('userInfo');
    if (!userInfo) {
      alert('User is logging out');
      navigate('/');
      return;
    }
    setUserName(userInfo.name);
    fetchProduct(userInfo.token);
  }, [id]);

  useEffect(() => {
    if (product) {
      setName(product.name);
      setDescription(product.description);
      setCompany(product.company);
      setCategory(product.category);
      setPrice(product.price);
      setMajor_conditions(product.major_conditions);
      setMinor_conditions(product.minor_conditions);
    }
  }, [product]);

  const handleLogout = () => {
    alert('User is logging out');
    navigate('/');
  };

  const handleSettings = () => {
    navigate('/settings');
  };

  const handleBack = async (e) => {
    window.history.back();
  };

  return (
    <div>
      {error && <div className='error'>{error}</div>}
      <div>
        <ProductComponent 
          userName={userName}
          name={name} 
          description={description} 
          company={company} 
          category={category} 
          major_conditions={major_conditions}
          minor_conditions={minor_conditions}
          price={price}
          handleBack={handleBack} 
          handleSettings={handleSettings}
          handleLogout={handleLogout}
        />
      </div>
    </div>
  );
}

export default ProductPage;