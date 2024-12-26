import React, { useState } from 'react';

function Login({ email, setEmail, password, setPassword, handleSubmit }) {
  const [showCookieWarning, setShowCookieWarning] = useState(true);

  const handleAcceptCookies = () => {
    setShowCookieWarning(false);
    // You can also set a cookie to remember the user's choice
    document.cookie = "cookiesAccepted=true; path=/; max-age=31536000"; // 1 year
  };

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