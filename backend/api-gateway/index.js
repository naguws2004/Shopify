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
    products: 'http://localhost:5001',
    inventory: 'http://localhost:5002',
    adminUsers: 'http://localhost:5003',
    users: 'http://localhost:5003',
    cart: 'http://localhost:5003',
    quiz: 'http://localhost:5004',
    recommendations: 'http://localhost:5005',
    orders: 'http://localhost:5006',
    payments: 'http://localhost:5007',
    shipping: 'http://localhost:5008'
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