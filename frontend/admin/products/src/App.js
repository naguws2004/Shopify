import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Products from './components/products';
import './styles/App.css';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Products />} />
      </Routes>
    </Router>
  );
};

export default App;