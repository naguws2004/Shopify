import React from 'react';

function Login({ email, setEmail, password, setPassword, handleSubmit }) {
  return (
    <div className="main-form-body">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <table>
          <tr>
            <td>
              <label>Email:</label>
            </td>
            <td>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
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
                required
              />
            </td>
          </tr>
          <tr>
            <td colSpan="2">
              <br />
              <button type="submit">Login</button>
            </td>
          </tr>
        </table>
      </form>
    </div>
  );
}

export default Login;