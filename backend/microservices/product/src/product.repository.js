// product.repository.js
const db = require('./db');

const dbGetProducts = async (page, limit, company, category, majorConditions, minorConditions, filterText, includeQty, offset) => {
  try {
    let rows;
    let countResult;
    if (includeQty) {
      [rows] = await db.query('SELECT * FROM products WHERE inventory > 0 AND LOWER(name) LIKE ? AND LOWER(company) LIKE ? AND LOWER(category) LIKE ? AND LOWER(major_conditions) LIKE ? AND LOWER(minor_conditions) LIKE ? ORDER BY name LIMIT ? OFFSET ?', [filterText, company, category, majorConditions, minorConditions, limit, offset]);
      [countResult] = await db.query('SELECT COUNT(*) as count FROM products WHERE inventory > 0 AND LOWER(name) LIKE ? AND LOWER(company) LIKE ? AND LOWER(category) LIKE ? AND LOWER(major_conditions) LIKE ? AND LOWER(minor_conditions) LIKE ?', [filterText, company, category, majorConditions, minorConditions]);
    } else {
      [rows] = await db.query('SELECT * FROM products WHERE LOWER(name) LIKE ? AND LOWER(company) LIKE ? AND LOWER(category) LIKE ? AND LOWER(major_conditions) LIKE ? AND LOWER(minor_conditions) LIKE ? ORDER BY name LIMIT ? OFFSET ?', [filterText, company, category, majorConditions, minorConditions, limit, offset]);
      [countResult] = await db.query('SELECT COUNT(*) as count FROM products WHERE LOWER(name) LIKE ? AND LOWER(company) LIKE ? AND LOWER(category) LIKE ? AND LOWER(major_conditions) LIKE ? AND LOWER(minor_conditions) LIKE ?', [filterText, company, category, majorConditions, minorConditions]);
    }
    const totalItems = countResult[0].count;
    const totalPages = Math.ceil(totalItems / limit);

    return {
      products: rows,
      total: totalItems,
      page: page,
      pages: totalPages
    };
  } catch (error) {
    console.error('Error in database call:', error);
    throw error;
  }
}

const dbGetProduct = async (id) => {
  try {
    const [rows] = await db.query('SELECT * FROM products WHERE id = ?', [id]);
    if (rows.length > 0) {
      return rows[0];
    } else {
      return undefined;
    }
  } catch (error) {
    console.error('Error in database call:', error);
    throw error;
  }
}

const dbAddProduct = async (newProduct) => {
  try {
    await db.query('INSERT INTO products SET ?', newProduct);
    return true;
  } catch (error) {
    console.error('Error in database call:', error);
    throw error;
  }
}

const dbUpdateProduct = async (id, data) => {
  try {
    const [result] = await db.query('UPDATE products SET ? WHERE id = ?', [data, id]);
    if (result.affectedRows > 0) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error('Error in database call:', error);
    throw error;
  }
}

const dbDeleteProduct = async (id) => {
  try {
    const [result] = await db.query('DELETE FROM products WHERE id = ?', [id]);
    if (result.affectedRows > 0) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error('Error in database call:', error);
    throw error;
  }
}

module.exports = {
  dbGetProducts,
  dbGetProduct,
  dbAddProduct,
  dbUpdateProduct,
  dbDeleteProduct
};
