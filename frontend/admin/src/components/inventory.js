import React, { useState, useEffect } from 'react';
import { getProducts } from '../services/productService';
import { updateProductInventory } from '../services/inventoryService';

const Inventory = () => {
  const [error, setError] = useState('');
  const [products, setProducts] = useState([]);
  const [updatedProducts, setUpdatedProducts] = useState(products.map(product => ({ ...product, isUpdated: false })));
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const [filterText, setFilterText] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchProducts = async () => {
    try {
      const fetchedProducts = await getProducts(page, filterText.trim());
      setProducts(fetchedProducts.products);
      setTotalPages(fetchedProducts.pages);
      handleReset();
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page]);

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
      await updateProductInventory(updatedProducts.filter(product => product.isUpdated));
      alert('Products Inventory updated successfully');
      await fetchProducts();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleReset = () => {
    const inventoryInputs = document.querySelectorAll('.inventory-text');
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
          return { ...product, inventory: inventory, isUpdated: true };
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
  
  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  return (
    <div>
      {error && <div className='error'>{error}</div>}
      <div className="inventory">
        <div className="inventory-list">
        <div className='inventory-form-header'>
            <span>Hello Admin!</span>&nbsp;
            <button type="back" onClick={handleBack}>Back to Main</button>
        </div>
        <div className='inventory-form-body'>
          <h2>Inventory</h2>
            <div>
              <label>Filter:</label>
              <input type='text' placeholder="Product Name" value={filterText} 
              onChange={handleFilterTextChange} />
            </div><br />
            {Array.isArray(products) && products.length > 0 ? (
              products.map((element, index) => (
                <div key={element.id}>
                  {index + ((page-1)*10) + 1}.&nbsp;
                  <input type='text' value={element.name} readOnly />
                  <input type='text' value={element.company} readOnly />
                  <input type='text' value={element.category} readOnly />
                  <input type='text' value={element.description} readOnly />
                  <input type='text' value={element.price} readOnly />
                  <input type='text' value={element.inventory} readOnly />
                  <input className='inventory-text' type='text' onChange={(e) => handleChange(e, element.id)} />
                </div>
              ))
            ) : (
              <p>No products available</p>
            )}
            <br />
            <div>
              <button onClick={() => handlePageChange(page - 1)} disabled={page === 1}>Previous</button>&nbsp;
              <span>Page {page} of {totalPages}</span>&nbsp;
              <button onClick={() => handlePageChange(page + 1)} disabled={page === totalPages}>Next</button>
            </div>
            <br />
          </div>
          <div className='inventory-form-footer'>
            <button onClick={handleReset}>Reset</button>&nbsp;
            <button onClick={handleUpdateProductInventory} disabled={!isUpdateMode}>Update</button>&nbsp;
          </div>
        </div>
      </div>
    </div>
  );
};

export default Inventory;