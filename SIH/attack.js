const axios = require('axios');

const url = 'http://192.168.1.4:5173/'; // Your test server URL

const simulateRequest = async () => {
  try {
    await axios.get(url);
    console.log('Request sent');
  } catch (error) {
    console.error('Error:', error.message);
  }
};

const startSimulation = () => {
  for (let i = 0; i < 1500; i++) {
    simulateRequest();                                                                                  
  }
};

startSimulation();