import { useNavigate } from 'react-router-dom';
import '../styles/App.css';

const Main = () => {
  const navigate = useNavigate();

  const handleUsers = () => {
    navigate('/users');
  };

  const handleProducts = () => {
    navigate('/products');
  };

  const handleInventory = () => {
    navigate('/inventory');
  };

  const handleOrdersCancel = () => {
    navigate('/orders/cancel');
  };

  const handleOrdersPay = () => {
    navigate('/orders/pay');
  };

  const handleOrdersDispatch = () => {
    navigate('/orders/dispatch');
  };

  const handleOrdersReturn = () => {
    navigate('/orders/return');
  };

  const handleOrdersCancelled = () => {
    navigate('/orders/cancelled');
  };

  const handleOrdersReturned = () => {
    navigate('/orders/returned');
  };

  return (
    <div className="App-main">
      <div className='App-header-main'>
        <h2>Admin Menu</h2>
        <div>
          <button className='button-main' onClick={handleUsers}>Users</button>
        </div>
        <div>
          <button className='button-main' onClick={handleProducts}>Products</button>
        </div>
        <div>
          <button className='button-main' onClick={handleInventory}>Inventory</button>
        </div>
        <div className='App-header-sub'>
          <h3>Orders</h3>
          <div>
            <button className='button-main' onClick={handleOrdersCancel}>Cancel</button>
          </div>
          <div>
            <button className='button-main' onClick={handleOrdersPay}>Pay</button>
          </div>
          <div>
            <button className='button-main' onClick={handleOrdersDispatch}>Dispatch</button>
          </div>
          <div>
            <button className='button-main' onClick={handleOrdersReturn}>Return</button>
          </div>
          <div>
            <button className='button-main' onClick={handleOrdersCancelled}>Cancelled</button>
          </div>
          <div>
            <button className='button-main' onClick={handleOrdersReturned}>Returned</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Main;
