const express = require('express');
const cors = require('cors');
const userRepositoryRouter = require('./userRepository.service'); 
const swaggerSetup = require('./swagger');

const app = express();
const port = 5099; // Replace with your desired port

// Enable CORS for all origins
app.use(cors());

app.use(express.json()); // Parse incoming JSON requests
app.use('/api/userRepository', userRepositoryRouter); 

// Setup Swagger
swaggerSetup(app);

app.listen(port, () => {
  console.log(`Repository Service listening on port ${port}`);
});