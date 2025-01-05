const express = require('express');
const cors = require('cors');
const cartRouter = require('./cart.service'); 
const swaggerSetup = require('./swagger');
const kafkaSetup = require('./cart.eventConsumer');

const app = express();
const port = 5004; // Replace with your desired port

// Enable CORS for all origins
app.use(cors());

app.use(express.json()); // Parse incoming JSON requests
app.use('/api/cart', cartRouter);

// Setup Swagger
swaggerSetup(app);

// Start Kafka consumer
kafkaSetup();

app.listen(port, () => {
  console.log(`Cart Service listening on port ${port}`);
});