# Use the official Node.js 18 image
FROM node:22.12 

WORKDIR /

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Replace with the port your app listens on
EXPOSE 5099

# Command to start your Node.js app
CMD ["npm", "start"] 

# docker build -t naguws2004/repositoryservice:latest . 
# docker run -p 5099:5099 naguws2004/repositoryservice:latest