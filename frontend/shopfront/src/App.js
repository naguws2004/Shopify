import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import MainPage from './pages/MainPage';
import SettingPage from './pages/SettingPage';
import ProductPage from './pages/ProductPage';
import CartPage from './pages/CartPage';
import ShippingPage from './pages/ShippingPage';
import OrderPage from './pages/OrderPage';
import OrdersPage from './pages/OrdersPage';
import './styles/App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/main" element={<MainPage />} />
            <Route path="/settings" element={<SettingPage />} />
            <Route path="/product/:id" element={<ProductPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/shipping" element={<ShippingPage />} />
            <Route path="/order/:order_id" element={<OrderPage />} />
            <Route path="/orders" element={<OrdersPage />} />
          </Routes>
        </header>
      </div>
    </Router>
  );
}

export default App;