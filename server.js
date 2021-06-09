const express = require('express'); //Express server up and running

const app = express(); //initialize app variable with express

app.get('/',(req, res) => res.send('API Running')); //take app variable and listen on a port

const PORT = process.env.PORT || 5000; // //take app variable and listen on a port, if no ENV set then default to port 5000. 

app.listen(PORT, () => console.log(`Server Started on Port ${PORT}`)); //Call back 

