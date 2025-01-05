const express = require('express');
const kafkaSetup = require('./inventory.eventConsumer');

const app = express();
const port = 5003; // Replace with your desired port

app.use(express.json()); // Parse incoming JSON requests

// Start Kafka consumer
kafkaSetup();

app.listen(port, () => {
  console.log(`Inventory Service listening on port ${port}`);
});