const express = require('express');
const cors = require('cors');
const orderRouter = require('./order.service'); 
const swaggerSetup = require('./swagger');

const app = express();
const port = 5005; // Replace with your desired port

// Enable CORS for all origins
app.use(cors());

app.use(express.json()); // Parse incoming JSON requests
app.use('/api/orders', orderRouter);

// Setup Swagger
swaggerSetup(app);

app.listen(port, () => {
  console.log(`Order Service listening on port ${port}`);
});