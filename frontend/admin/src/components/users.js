import React, { useState, useEffect } from 'react';
import { getUsers, updateUser, updateUserPassword } from '../services/userService';

const Users = () => {
  const [error, setError] = useState('');
  const [users, setUsers] = useState([]);
  const [updatedUsers, setUpdatedUsers] = useState(users.map(user => ({ ...user, isUpdated: false })));
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const [filterText, setFilterText] = useState('');

  const fetchUsers = async () => {
    try {
      const fetchedUsers = await getUsers();
      if (!filterText) {
        setUsers(fetchedUsers);
        handleReset();
        return;
      }
      const filteredUsers = fetchedUsers.filter(user => user.email.toLowerCase().includes(filterText.trim().toLowerCase()));
      setUsers(filteredUsers);
      handleReset();
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [filterText]);

  useEffect(() => {
    handleReset();
  }, [users]);

  const handleBack = () => {
    handleReset();
    window.history.back();
  };

  const handleUpdate = async () => {
    try {
      await Promise.all(updatedUsers.map(async(updatedUser) => {
        if (!updatedUser.name.trim()) {
          setError('User name cannot be blank');
          return false;
        }
        if (updatedUser.isUpdated) {
          if (updatedUser.password && updatedUser.password.trim()) {
            await updateUserPassword(updatedUser.id, updatedUser);
          }
          else
          {
            await updateUser(updatedUser.id, updatedUser);
          }
        }
      }));
      alert('Users updated successfully');
      handleReset();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleReset = () => {
    const inventoryInputs = document.querySelectorAll('.user-text');
    inventoryInputs.forEach(input => {
      input.value = '';
    });
    setError('');
    setIsUpdateMode(false); // Disable update mode
    setUpdatedUsers(users);
  };
  
  const handleChange = (e, id) => {
    const { name, value } = e.target;
    setUpdatedUsers((prevUsers) => {
      return prevUsers.map((user) => {
        if (user.id === id) {
          return { ...user, [name]: value, isUpdated: true };
        }
        return user;
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
      <div className="user">
        <div className="user-list">
        <div className='user-form-header'>
            <span>Hello Admin!</span>&nbsp;
            <button type="back" onClick={handleBack}>Back to Main</button>
        </div>
        <div className='user-form-body'>
          <h2>Users</h2>
            <div>
              <label>Filter:</label>
              <input type='text' placeholder="Email" value={filterText} 
              onChange={handleFilterTextChange} />
            </div><br />
            {Array.isArray(updatedUsers) && updatedUsers.length > 0 ? (
              users.map((element, index) => (
                <div key={element.id}>
                  {index + 1}.&nbsp;
                  <input type='text' value={element.email} readOnly />
                  <input type='text' value={element.name} readOnly />
                  <input className='user-text' name="name" type='text' placeholder='Change Name here' onChange={(e) => handleChange(e, element.id)} required />
                  <input className='user-text' name="password" type='text' placeholder='Change Password here' onChange={(e) => handleChange(e, element.id)} />
                </div>
              ))
            ) : (
              <p>No users available</p>
            )}
            <br />
          </div>
          <div className='user-form-footer'>
            <button onClick={handleReset}>Reset</button>&nbsp;
            <button onClick={handleUpdate} disabled={!isUpdateMode}>Update</button>&nbsp;
          </div>
        </div>
      </div>
    </div>
  );
};

export default Users;