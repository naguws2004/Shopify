const express = require('express');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const router = express.Router();

module.exports = async (app) => {
    const definition = swaggerJSDoc({
        swaggerDefinition: { ...require('./swagger.json') },
        apis: ['./admin.service.js']
    });
    router.use('/', swaggerUi.serve, swaggerUi.setup(
        definition
    ));
    app.use('/api-docs', router); 
}