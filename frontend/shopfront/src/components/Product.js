import React from 'react';

function Product({ name, description, company, category, major_conditions, minor_conditions, price, handleBack }) {
  return (
    <div className="main-form-body">
      <h2>Product</h2>
        <table>
          <tr>
            <td>
              <label>Name:</label>
            </td>
            <td>
              <input
                type="name"
                value={name}
                readOnly
              />
            </td>
          </tr>
          <tr>
            <td>
              <label>Description:</label>
            </td>
            <td>
              <input
                type="description"
                value={description}
                readOnly
              />
            </td>
          </tr>
          <tr>
            <td>
              <label>Company:</label>
            </td>
            <td>
              <input
                type="company"
                value={company}
                readOnly
              />
            </td>
          </tr>
          <tr>
            <td>
              <label>Category:</label>
            </td>
            <td>
              <input
                type="category"
                value={category}
                readOnly
              />
            </td>
          </tr>
          <tr>
            <td>
              <label>Major Conditions:</label>
            </td>
            <td>
              <input
                type="major_conditions"
                value={major_conditions}
                readOnly
              />
            </td>
          </tr>
          <tr>
            <td>
              <label>Minor Conditions:</label>
            </td>
            <td>
              <input
                type="minor_conditions"
                value={minor_conditions}
                readOnly
              />
            </td>
          </tr>
          <tr>
            <td>
              <label>Price:</label>
            </td>
            <td>
              <input
                type="price"
                value={price}
                readOnly
              />
            </td>
          </tr>
          <tr>
            <td colSpan="2">
              <br />
              <button type="back" onClick={handleBack}>Back</button>
            </td>
          </tr>
        </table>
    </div>
  );
}

export default Product;