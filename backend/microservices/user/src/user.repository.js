// user.repository.js
const db = require('./db');

const dbLoginUser = async (email) => {
  try {
    const query = 'SELECT * FROM users WHERE email = ?';
    const params = [email];
    const [rows] = await db.query(query, params);
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

const dbRegisterUser = async (name, email, hashedPassword) => {
  try {
    const query = 'INSERT INTO users (name, email, hashed_password) VALUES (?, ?, ?)';
    const params = [name, email, hashedPassword];
    await db.query(query, params);
  } catch (error) {
    console.error('Error in database call:', error);
    throw error;
  }
}

const dbGetUser = async (id) => {
  try {
    const query = 'SELECT id, name, email FROM users WHERE id = ?';
    const params = [id];
    const [rows] = await db.query(query, params);
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

const dbUpdateUser = async (id, name) => {
  try {
    const query = 'UPDATE users SET name = ? WHERE id = ?';
    const params = [name, id];
    const [result] = await db.query(query, params);
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

const dbUpdateUserWithPassword = async (id, name, hashedPassword) => {
  try {
    const query = 'UPDATE users SET name = ?, hashed_password = ? WHERE id = ?';
    const params = [name, hashedPassword, id];
    const [result] = await db.query(query, params);
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

const dbGetUserAddress = async (user_id) => {
  try {
    const query = 'SELECT * FROM shipping_address WHERE user_id = ?';
    const params = [user_id];
    const [rows] = await db.query(query, params);
    if (rows.length === 0) {
      return [];
    } else {
      return rows;
    }
  } catch (error) {
    console.error('Error in database call:', error);
    throw error;
  }
}

const dbGetUserQuery = async (user_id) => {
  try {
    const query = 'SELECT * FROM user_query WHERE user_id = ?';
    const params = [user_id];
    const [rows] = await db.query(query, params);
    if (rows.length === 0) {
      return [];
    } else {
      return rows;
    }
  } catch (error) {
    console.error('Error in database call:', error);
    throw error;
  }
}

const dbAddUserAddress = async (user_id, address, city, state, pincode, contactno) => {
  try {
    let query = 'DELETE FROM shipping_address WHERE user_id = ?';
    let params = [user_id];
    await db.query(query, params);
    query = 'INSERT INTO shipping_address(user_id, address, city, state, pincode, contactno) VALUES (?, ?, ?, ?, ?, ?)';
    params = [user_id, address, city, state, pincode, contactno];
    [result] = await db.query(query, params);
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

const dbAddUserQuery = async (user_id, company, category, major_conditions, minor_conditions) => {
  try {
    let query = 'DELETE FROM user_query WHERE user_id = ?';
    let params = [user_id];
    let [result] = await db.query(query, params);
    query = 'INSERT INTO user_query (user_id, company, category, major_conditions, minor_conditions) VALUES (?, ?, ?, ?, ?)';
    params = [user_id, company, category, major_conditions, minor_conditions];
    [result] = await db.query(query, params);
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
  dbLoginUser,
  dbRegisterUser,
  dbGetUser,
  dbUpdateUser,
  dbUpdateUserWithPassword,
  dbGetUserAddress,
  dbGetUserQuery,
  dbAddUserAddress,
  dbAddUserQuery
};
