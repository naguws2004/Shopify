import React, { useState } from 'react';

function Setting({ name, setName, password, setPassword, password1, setPassword1, handleSubmit, handleCancel }) {
  const [changePassword, setChangePassword] = useState(false);
  return (
    <div className="main-form-body">
      <h2>Settings</h2>
      <form onSubmit={handleSubmit}>
        <table>
          <tr>
            <td>
              <label>Name:</label>
            </td>
            <td>
              <input
                type="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </td>
          </tr>
          <tr>
            <td colSpan="2">
              <input
                type="checkbox"
                checked={changePassword}
                onChange={(e) => setChangePassword(e.target.checked)}
              />
              <label>
                Change Password
              </label>
            </td>
          </tr>
          <tr>
            <td>
              <label>Password:</label>
            </td>
            <td>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={!changePassword}
                required={changePassword}
              />
            </td>
          </tr>
          <tr>
            <td>
              <label>Reenter Password:</label>
            </td>
            <td>
              <input
                type="password"
                value={password1}
                onChange={(e) => setPassword1(e.target.value)}
                disabled={!changePassword}
                required={changePassword}
              />
            </td>
          </tr>
          <tr>
            <td colSpan="2">
              <br />
              <button type="submit">Update</button>&nbsp;
              <button type="cancel" onClick={handleCancel}>Cancel</button>
            </td>
          </tr>
        </table>
      </form>
    </div>
  );
}

export default Setting;