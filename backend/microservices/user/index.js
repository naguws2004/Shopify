const express = require('express');
const cors = require('cors');
const userRouter = require('./user.service'); 
const swaggerSetup = require('./swagger');

const app = express();
const port = 5001; // Replace with your desired port

// Enable CORS for all origins
app.use(cors());

app.use(express.json()); // Parse incoming JSON requests
app.use('/api/users', userRouter); 

// Setup Swagger
swaggerSetup(app);

app.listen(port, () => {
  console.log(`User Service listening on port ${port}`);
});