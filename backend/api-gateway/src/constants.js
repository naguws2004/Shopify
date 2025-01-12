const status = {
    OPEN : 'open',
    CLOSED : 'closed',
    HALF_OPEN : 'half open'
};

const circuitStatus = {
    users: status.CLOSED,
    products: status.CLOSED,
    cart: status.CLOSED,
    orders: status.CLOSED
};

const services = {
    users: 'http://localhost:5001',
    products: 'http://localhost:5002',
    cart: 'http://localhost:5004',
    orders: 'http://localhost:5005'
};

const proxyServices = {
    users: 'http://localhost:5001/api/users/ping/',
    products: 'http://localhost:5002/api/products/ping/',
    cart: 'http://localhost:5004/api/cart/ping/',
    orders: 'http://localhost:5005/api/orders/ping/'
};

module.exports = {
    status,
    circuitStatus,
    services,
    proxyServices
}

