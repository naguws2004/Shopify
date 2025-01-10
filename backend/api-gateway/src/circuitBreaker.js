const httpProxy = require('http-proxy');
const CircuitBreaker = require('opossum');

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

const apiProxy = httpProxy.createProxyServer();

// const services = {
//     users: 'http://localhost:5001/api/users/ping/',
//     products: 'http://localhost:5002/api/products/ping/',
//     cart: 'http://localhost:5004/api/cart/ping/',
//     orders: 'http://localhost:5005/api/orders/ping/'
// };

const services = {
    users: 'http://localhost:5001',
    products: 'http://localhost:5002',
    cart: 'http://localhost:5004',
    orders: 'http://localhost:5005'
};

const circuitBreakerOptions = {
    timeout: 5000, // If our function takes longer than 5 seconds, trigger a failure
    errorThresholdPercentage: 50, // When 50% of requests fail, trip the circuit
    resetTimeout: 30000 // After 30 seconds, try again.
};

const breakers = {};

Object.keys(services).forEach(service => {
    breakers[service] = new CircuitBreaker((req, res) => {
        const target = services[service];
        if (!target) {
            res.status(500).send('Service target URL is undefined');
            return;
        }
        console.log(`Proxying request to ${target}`);
        apiProxy.web(req, res, { 
            target: target,
            headers: {
                ...req.headers, // Preserve original headers
                host: new URL(target).host // Set the host header to the target
            }
        });
    }, circuitBreakerOptions);

    breakers[service].on('open', () => {
        console.log(`Circuit for ${service} is open`);
        circuitStatus[service] = status.OPEN;
    });

    breakers[service].on('close', () => {
        console.log(`Circuit for ${service} is closed`);
        circuitStatus[service] = status.CLOSED;
    });

    breakers[service].on('halfOpen', () => {
        console.log(`Circuit for ${service} is half open`);
        circuitStatus[service] = status.HALF_OPEN;
    });
});

module.exports = (req, res) => {
    const { service } = req.params;
    const target = services[service];
    apiProxy.web(req, res, { 
        target: target,
        headers: {
            ...req.headers, // Preserve original headers
            host: new URL(target).host // Set the host header to the target
        }
    });
    // const breaker = breakers[service];
    // if (breaker) {
    //     breaker.fire(req, res).catch(err => {
    //         res.status(500).send('Internal Server Error');
    //     });
    // } else {
    //     res.status(404).send('Service not found');
    // }
}

