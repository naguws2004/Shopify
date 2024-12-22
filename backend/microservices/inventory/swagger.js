const express = require('express');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const router = express.Router();

module.exports = async (app) => {
    const definition = swaggerJSDoc({
        swaggerDefinition: { ...require('./swagger.json') },
        apis: ['./inventory.service.js']
    });
    router.use('/', swaggerUi.serve, swaggerUi.setup(
        definition
    ));
    app.use('/api-docs', router); 
    app.get('/api-docs.json', (req, res) => {
        res.header("Content-Type", "application/json");
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");      
        res.send(definition);
    });
}