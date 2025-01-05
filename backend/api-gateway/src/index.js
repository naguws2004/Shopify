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
    users: 'http://172.31.128.1:5001',
    adminUsers: 'http://172.31.128.1:5001',
    products: 'http://172.31.128.1:5002',
    inventory: 'http://172.31.128.1:5003',
    cart: 'http://172.31.128.1:5004',
    orders: 'http://172.31.128.1:5005',
    quiz: 'http://172.31.128.1:5006',
    recommendations: 'http://172.31.128.1:5007',
    payments: 'http://172.31.128.1:5008',
    shipping: 'http://172.31.128.1:5009'
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