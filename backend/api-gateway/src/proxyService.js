const httpProxy = require('http-proxy');
const { status, circuitStatus, services } = require('./constants');

module.exports = (req, res) => {
    try {
        const apiProxy = httpProxy.createProxyServer();
        const { service } = req.params;
        console.log(`Proxy. Circuit status for ${service} is ${circuitStatus[service]}`);
        if (circuitStatus[service] === status.CLOSED) {
            const target = services[service];
            apiProxy.web(req, res, { target: target }, (err) => {
                if (err) {
                    console.log(`Error connecting to service ${service}: ${err.message}`);
                    res.status(500).send(`Error connecting to service ${service}: ${err.message}`);
                }
            });
        }
        else {
            console.log(`Service ${service} unavailable`);
            res.status(503).send('Service unavailable');
        }
    } catch (e) {
        console.error(e);
        res.status(500).send('Internal server error');
    }
}

