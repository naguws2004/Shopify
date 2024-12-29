import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Main from './components/main';
import Users from './components/users';
import Products from './components/products';
import Inventory from './components/inventory';
import Orders from './components/orders';
import './styles/App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <Routes>
            <Route path="/" element={<Main />} />
            <Route path="/users" element={<Users />} />
            <Route path="/products" element={<Products />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/orders" element={<Orders />} />
          </Routes>
        </header>
      </div>
    </Router>
  );
}

export default App;
