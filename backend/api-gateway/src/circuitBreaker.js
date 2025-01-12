const CircuitBreaker = require('opossum');
const axios = require('axios');
const http = require('http');
const net = require('net');
const { status, circuitStatus, proxyServices } = require('./constants');

const circuitBreakerOptions = {
    timeout: 5000, // If our function takes longer than 5 seconds, trigger a failure
    errorThresholdPercentage: 50, // When 50% of requests fail, trip the circuit
    resetTimeout: 30000 // After 30 seconds, try again.
};

const breakers = {};

const executeService = () => {
    Object.keys(proxyServices).forEach(service => {
        const target = proxyServices[service];
        const breaker = breakers[service];
        if (breaker) {
            const req = new http.IncomingMessage(new net.Socket());
            req.headers = {};
            req.method = 'GET';
            req.params = { service };
            req.url = target;
            req.body = {};

            const res = new http.ServerResponse(req);
            res.status = (code) => ({ send: (message) => console.log(`Service ${service} responded with status ${code}: ${message}`) });

            breaker.fire(req, res).then(() => {
                console.log(`Service ${service} successfully connected`);
            }).catch(err => {
                if (req.socket && req.socket.destroyed && err.code === 'ECONNRESET') {
                    console.log(`Service ${service} connection reset: ${err.message}`);
                } else {
                    console.log(`Service ${service} failed: ${err.message}`);
                }
            });

            console.log(`Circuit. Circuit for ${service} is ${circuitStatus[service]}`);
        }
    });
};

// Timer-based execution every 10 seconds
setInterval(() => {
    console.log('Executing timer-based task');
    executeService();
}, 10000); // 10 seconds in milliseconds

module.exports = () => {
    Object.keys(proxyServices).forEach(service => {
        breakers[service] = new CircuitBreaker((req, res) => {
            return new Promise((resolve, reject) => {
                const target = proxyServices[service];
                if (!target) {
                    res.status(500).send('Service target URL is undefined');
                    return reject(new Error('Service target URL is undefined'));
                }
                axios({
                    method: req.method,
                    url: target,
                    headers: req.headers,
                    data: req.body
                }).then(response => {
                    res.status(response.status).send(response.data);
                    resolve();
                }).catch(err => {
                    res.status(500).send(`Error connecting to service ${service}: ${err.message}`);
                    reject(err);
                });
            });
        }, circuitBreakerOptions);
    
        breakers[service].on('open', () => {
            circuitStatus[service] = status.OPEN;
        });
    
        breakers[service].on('close', () => {
            circuitStatus[service] = status.CLOSED;
        });
    
        breakers[service].on('halfOpen', () => {
            circuitStatus[service] = status.HALF_OPEN;
        });
    });

    executeService();
}

