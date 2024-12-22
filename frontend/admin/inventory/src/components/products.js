import React, { useState, useEffect } from 'react';
import { getProducts, updateProductInventory } from '../services/inventoryService';

const Products = () => {
  const [error, setError] = useState('');
  const [products, setProducts] = useState([]);
  const [updatedProducts, setUpdatedProducts] = useState([]);
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const [filterText, setFilterText] = useState('');

  const fetchProducts = async () => {
    try {
      const fetchedProducts = await getProducts();
      if (!filterText) {
        setProducts(fetchedProducts);
        handleReset();
        return;
      }
      const filteredProducts = fetchedProducts.filter(product => product.name.toLowerCase().includes(filterText.trim().toLowerCase()));
      setProducts(filteredProducts);
      handleReset();
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [filterText]);

  useEffect(() => {
    handleReset();
  }, [products]);

  const handleBack = () => {
    handleReset();
    window.history.back();
  };

  const handleUpdateProductInventory = async () => {
    try {
      await updateProductInventory(updatedProducts);
      alert('Products Inventory updated successfully');
      await fetchProducts();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleReset = () => {
    const inventoryInputs = document.querySelectorAll('.inventory');
    inventoryInputs.forEach(input => {
      input.value = 0;
    });
    setError('');
    setIsUpdateMode(false); // Disable update mode
    setUpdatedProducts(products);
  };
  
  const handleChange = (e, id) => {
    const inventory = e.target.value;
    if (!inventory.trim()) {
      setError('Product inventory cannot be blank');
      return false;
    }
    if (inventory < 0) {
      setError('Product inventory cannot be negative');
      return false;
    }
    setUpdatedProducts((prevProducts) => {
      return prevProducts.map((product) => {
        if (product.id === id) {
          return { ...product, inventory: inventory };
        }
        return product;
      });
    });
    setError('');
    setIsUpdateMode(true); // Enable update mode
  };

  const handleFilterTextChange = (e) => {
    setFilterText(e.target.value);
  };

  return (
    <div>
      {error && <div className='error'>{error}</div>}
      <div className="product">
        <div className="product-list">
        <div className='product-form-header'>
            <span>Hello Admin!</span>&nbsp;
            <button type="back" onClick={handleBack}>Back to Main</button>
        </div>
        <div className='product-form-body'>
          <h2>Inventory</h2>
            <div>
              <label>Filter:</label>
              <input type='text' placeholder="Product Name" value={filterText} 
              onChange={handleFilterTextChange} />
            </div><br />
            {Array.isArray(products) && products.length > 0 ? (
              products.map((element, index) => (
                <div key={element.id}>
                  {index + 1}.&nbsp;
                  <input type='text' value={element.name} readOnly />
                  <input type='text' value={element.company} readOnly />
                  <input type='text' value={element.category} readOnly />
                  <input type='text' value={element.description} readOnly />
                  <input type='text' value={element.price} readOnly />
                  <input type='text' value={element.inventory} readOnly />
                  <input className='inventory' type='text' onChange={(e) => handleChange(e, element.id)} />
                </div>
              ))
            ) : (
              <p>No products available</p>
            )}
            <br />
          </div>
          <div className='product-form-footer'>
            <button onClick={handleReset}>Reset</button>&nbsp;
            <button onClick={handleUpdateProductInventory} disabled={!isUpdateMode}>Update</button>&nbsp;
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;