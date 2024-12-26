import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ProductComponent from '../components/Product';
import { getProduct } from '../services/productService';

function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState({});
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [company, setCompany] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [major_conditions, setMajor_conditions] = useState('');
  const [minor_conditions, setMinor_conditions] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const fetchedProduct = await getProduct(id);
        setProduct(fetchedProduct);
      } catch (error) {
        setError('Failed to fetch product');
      }
    };
    fetchProduct();
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

  const handleBack = async (e) => {
    window.history.back();
  };

  return (
    <div>
      {error && <div className='error'>{error}</div>}
      <div>
        <ProductComponent 
          name={name} 
          description={description} 
          company={company} 
          category={category} 
          major_conditions={major_conditions}
          minor_conditions={minor_conditions}
          price={price}
          handleBack={handleBack} 
        />
      </div>
    </div>
  );
}

export default ProductPage;