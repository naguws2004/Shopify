// user.repository.js
const axios = require('axios');
const url = 'http://localhost:5099/api/userRepository/';

const dbLoginUser = async (email) => {
  try {
    const response = await axios.get(url + 'login', {
      params: {
        email: email
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error in external API:', error);
    throw error;
  }
}

const dbRegisterUser = async (name, email, hashedPassword) => {
  try {
    await axios.post(url + 'register', {
      name: name,
      email: email,
      hashedPassword: hashedPassword
    });
  } catch (error) {
    console.error('Error in external API:', error);
    throw error;
  }
}

const dbGetUser = async (id) => {
  try {
    const response = await axios.get(url + `${id}`);
    return response.data;
  } catch (error) {
    console.error('Error in external API:', error);
    throw error;
  }
}

const dbUpdateUser = async (id, name) => {
  try {
    const response = await axios.put(url + `${id}`, {
      name: name
    });
    return response.data;
  } catch (error) {
    console.error('Error in external API:', error);
    throw error;
  }
}

const dbUpdateUserWithPassword = async (id, name, hashedPassword) => {
  try {
    console.log('id:', id);
    console.log('name:', name);
    console.log('hashedPassword:', hashedPassword);
    const response = await axios.put(url + 'password/' + `${id}`, {
      name: name,
      hashedPassword: hashedPassword
    });
    return response.data;
  } catch (error) {
    console.error('Error in external API:', error);
    throw error;
  }
}

const dbGetUserAddress = async (id) => {
  try {
    const response = await axios.get(url + 'address/' + `${id}`);
    return response.data;
  } catch (error) {
    console.error('Error in external API:', error);
    throw error;
  }
}

const dbGetUserQuery = async (id) => {
  try {
    const response = await axios.get(url + 'query/' + `${id}`);
    return response.data;
  } catch (error) {
    console.error('Error in external API:', error);
    throw error;
  }
}

const dbAddUserQuery = async (user_id, company, category, major_conditions, minor_conditions) => {
  try {
    await axios.post(url + 'query', {
      user_id: user_id,
      company: company,
      category: category,
      major_conditions: major_conditions,
      minor_conditions: minor_conditions
    });
  } catch (error) {
    console.error('Error in external API:', error);
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
  dbAddUserQuery
};