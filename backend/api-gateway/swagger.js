const express = require('express');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const router = express.Router();

module.exports = async (app) => {
    router.use('/', swaggerUi.serve, swaggerUi.setup(
        swaggerJSDoc({
            swaggerDefinition: { },
            apis: ['./product.service.js']
        }),
        {
            explorer: true,
            swaggerOptions: {
                displayRequestDuration: true,
                docExpansion: "none", 
                filter: false,
                showExtensions: true,
                showCommonExtensions: true,
                displayOperationId: true,
                urls: [
                    {
                        url: 'http://localhost:5001/api-docs.json', 
                        name: 'Products API'
                    }
                ]
            }
        }
    ));
    app.use('/api-docs', router); 
}