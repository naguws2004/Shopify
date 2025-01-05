import React from 'react';

function Login({ email, setEmail, password, setPassword, showCookieWarning, handleAcceptCookies, handleSubmit }) {
  return (
    <div className="main-form-body">
      {showCookieWarning && (
        <div className="cookie-warning">
          <p>
            We use cookies to improve your experience. By using our site, you accept our use of cookies.&nbsp;
            <button onClick={handleAcceptCookies}>Accept</button>
          </p>
        </div>
      )}
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
              <button type="submit" disabled={showCookieWarning}>Login</button>
            </td>
          </tr>
        </table>
      </form>
    </div>
  );
}

export default Login;