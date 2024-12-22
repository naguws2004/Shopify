import React, { useState, useEffect } from 'react';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../services/productService';

const Products = () => {
  const blankProduct = {
    name: '',
    description: '',
    company: '',
    category: '',
    major_conditions: '',
    minor_conditions: '',
    price: 0,
    inventory: 0
  };
  const [error, setError] = useState('');
  const [products, setProducts] = useState([]);
  const [product, setProduct] = useState(blankProduct);
  const [id, setId] = useState('');
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

  const validData = () => {
    if (!product.name.trim()) {
      setError('Product name cannot be blank');
      return false;
    }
    if (!product.company.trim()) {
      setError('Product company cannot be blank');
      return false;
    }
    if (!product.category.trim()) {
      setError('Product category cannot be blank');
      return false;
    }
    if (product.price <= 0) {
      setError('Product price cannot be negative or zero');
      return false;
    }
    if (product.inventory < 0) {
      setError('Product inventory cannot be negative');
      return false;
    }
    setError('');
    return true;
  };

  const handleBack = () => {
    handleReset();
    window.history.back();
  };

  const handleCreateProduct = async () => {
    if (!validData()) {
      return;
    }
    try {
      await createProduct(product);
      alert('Product created successfully');
      fetchProducts();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUpdateProduct = async () => {
    if (!validData()) {
      return;
    }
    try {
      await updateProduct(id, product);
      alert('Product updated successfully');
      fetchProducts();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteProduct = async () => {
    try {
      await deleteProduct(id);
      alert('Product deleted successfully');
      fetchProducts();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleReset = () => {
    setProduct(blankProduct);
    setError('');
    setId('');
    setIsUpdateMode(false); // Disable update mode
  };
  
  const handleProductClick = (id) => {
    const selectedProduct = products.find(product => product.id === id);
    setId(selectedProduct.id);
    setProduct(selectedProduct);
    setIsUpdateMode(true); // Enable update mode
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleFilterTextChange = (e) => {
    setFilterText(e.target.value);
  };

  return (
    <div>
      {error && <div className='error'>{error}</div>}
      <div className="product">
        <div className="product-list">
          <h2>Products</h2>
          <div>
            <label>Filter:</label>
            <input type='text' placeholder="Product Name" value={filterText} 
            onChange={handleFilterTextChange} />
          </div>
          <br />
          {Array.isArray(products) && products.length > 0 ? (
            products.map((element, index) => (
              <div style={{ cursor: 'pointer', textDecoration: 'underline' }} key={element.id} onClick={() => handleProductClick(element.id)}>
                {element.name} - {element.company} - {element.category} - {element.price} - {element.inventory}
              </div>
            ))
          ) : (
            <p>No products available</p>
          )}
        </div>
        <div className='product-form'>
          <div className='product-form-header'>
            <span>Hello Admin!</span>&nbsp;
            <button type="back" onClick={handleBack}>Back to Main</button>
          </div>
          <br />
          <div className='product-form-body'>
            <table className='product-form-table'>
              <tr>
                <td>
                    <label>Name:</label>
                <td>
                </td>
                    <input name="name" value={product.name} onChange={handleChange} placeholder="Name" required />
                </td>
              </tr>
              <tr>
                <td>
                  <label>Description:</label>
                  <td>
                </td>
                  <input name="description" value={product.description} onChange={handleChange} placeholder="Description" />
                </td>
              </tr>
              <tr>
                <td>
                  <label>Company:</label>
                  <td>
                </td>
                  <input name="company" value={product.company} onChange={handleChange} placeholder="Company" required />
                </td>
              </tr>
              <tr>
                <td>
                  <label>Category:</label>
                  <td>
                </td>
                  <input name="category" value={product.category} onChange={handleChange} placeholder="Category" required />
                </td>
              </tr>
              <tr>
                <td>
                  <label>Major Conditions:</label>
                  <td>
                </td>
                  <input name="major_conditions" value={product.major_conditions} onChange={handleChange} placeholder="Major Conditions" />
                </td>
              </tr>
              <tr>
                <td>
                  <label>Minor Conditions:</label>
                  <td>
                </td>
                  <input name="minor_conditions" value={product.minor_conditions} onChange={handleChange} placeholder="Minor Conditions" />
                </td>
              </tr>
              <tr>
                <td>
                  <label>Price:</label>
                  <td>
                </td>
                  <input name="price" type="number" value={product.price} onChange={handleChange} placeholder="Price" required />
                </td>
              </tr>
              <tr>
                <td>
                  <label>Inventory:</label>
                  <td>
                </td>
                  <input name="inventory" type="number" value={product.inventory} onChange={handleChange} placeholder="Inventory" required />
                </td>
              </tr>
              <tr>
                <td colSpan="2">
                  <br />
                  <button onClick={handleReset}>Reset</button>&nbsp;
                  <button onClick={handleCreateProduct} disabled={isUpdateMode}>Create</button>&nbsp;
                  <button onClick={handleUpdateProduct} disabled={!isUpdateMode}>Update</button>&nbsp;
                  <button onClick={handleDeleteProduct} disabled={!isUpdateMode}>Delete</button>
                </td>
              </tr>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;