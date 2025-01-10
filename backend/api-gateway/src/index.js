const express = require('express');
const cors = require('cors');
const swaggerSetup = require('./swagger');
const circuitBreakerProxy = require('./circuitBreaker');

const app = express();

// Enable CORS for all origins
app.use(cors());

const port = 5000; // Replace with your desired port

// Setup Swagger
swaggerSetup(app);

app.all('/api/:service/*', (req, res) => {
    console.log(JSON.stringify(req.headers));
    // setup circuit breaker
    circuitBreakerProxy(req, res);
    //circuitBreakerProxy.circuitStatus[req.params.service] = circuitBreakerProxy.status.CLOSED;
});

app.listen(port, () => {
    console.log(`API Gateway on port ${port}`);
});