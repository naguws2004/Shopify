import { useNavigate } from 'react-router-dom';
import '../styles/App.css';

const Main = () => {
  const navigate = useNavigate();

  const handleProducts = () => {
    navigate('/products');
  };

  const handleInventory = () => {
    navigate('/inventory');
  };

  const handleUsers = () => {
    navigate('/users');
  };

  return (
    <div className="App-main">
      <header className="App-header-main">
        <br />
        <div>Admin Menu</div>
        <div>
          <button className='button-main' onClick={handleProducts}>Products</button>
        </div>
        <div>
          <button className='button-main' onClick={handleInventory}>Inventory</button>
        </div>
        <div>
          <button className='button-main' onClick={handleUsers}>Users</button>
        </div>
      </header>
    </div>
  );
}

export default Main;
