const express = require('express');
const cors = require('cors');
const swaggerSetup = require('./swagger');
const circuitBreakerProxy = require('./circuitBreaker');
const proxyService = require('./proxyService');

const app = express();

// Enable CORS for all origins
app.use(cors());

const port = 5000; // Replace with your desired port

// Setup Swagger
swaggerSetup(app);

// setup circuit breaker
circuitBreakerProxy();

app.all('/api/:service/*', (req, res) => {
    proxyService(req, res);
});

app.listen(port, () => {
    console.log(`API Gateway on port ${port}`);
});