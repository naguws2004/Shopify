import './App.css';

const handleProducts = () => {
  window.location.href = 'http://localhost:3002/'; 
};

const handleInventory = () => {
  window.location.href = 'http://localhost:3003/'; 
};

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <br />
        <div>Admin Menu</div>
        <div>
          <button onClick={handleProducts}>Products</button>
        </div>
        <div>
          <button onClick={handleInventory}>Inventory</button>
        </div>
      </header>
    </div>
  );
}

export default App;
