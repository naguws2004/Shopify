const express = require('express');
const cors = require('cors');
const productRouter = require('./product.service'); 
const inventoryRouter = require('./inventory.service'); 
const swaggerSetup = require('./swagger');

const app = express();
const port = 5001; // Replace with your desired port

// Enable CORS for all origins
app.use(cors());

app.use(express.json()); // Parse incoming JSON requests
app.use('/api/products', productRouter); 
app.use('/api/inventory', inventoryRouter); 

// Setup Swagger
swaggerSetup(app);

app.listen(port, () => {
  console.log(`Product Service listening on port ${port}`);
});