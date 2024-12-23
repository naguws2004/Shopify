import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Main from './components/main';
import Products from './components/products';
import Inventory from './components/inventory';
import './styles/App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <Routes>
            <Route path="/" element={<Main />} />
            <Route path="/products" element={<Products />} />
            <Route path="/inventory" element={<Inventory />} />
          </Routes>
        </header>
      </div>
    </Router>
  );
}

export default App;
