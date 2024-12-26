const express = require('express');
const cors = require('cors');
const httpProxy = require('http-proxy');
const swaggerSetup = require('./swagger');

const app = express();

// Enable CORS for all origins
app.use(cors());

const port = 5000; // Replace with your desired port
const apiProxy = httpProxy.createProxyServer();

const services = {
    users: 'http://localhost:5001',
    adminUsers: 'http://localhost:5001',
    products: 'http://localhost:5002',
    inventory: 'http://localhost:5003',
    cart: 'http://localhost:5004',
    quiz: 'http://localhost:5005',
    recommendations: 'http://localhost:5006',
    orders: 'http://localhost:5007',
    payments: 'http://localhost:5008',
    shipping: 'http://localhost:5009'
};

app.all('/api/:service/*', (req, res) => {
    const { service } = req.params;
    const target = services[service];
    if (target) {
        apiProxy.web(req, res, { target: `${target}` }); 
    } else {
        res.status(404).send('Service not found');
    }
});

// Setup Swagger
swaggerSetup(app);

app.listen(port, () => {
    console.log(`API Gateway on port ${port}`);
});