const express = require('express'); //Express server up and running
const connectDB = require('./config/db');

const app = express(); //initialize app variable with express

//Connect Database
connectDB();

//Init Middleware to get data in request.body from routes
app.use(express.json({extended: false}))

app.get('/', (req, res) => res.send('API Running')); //take app variable and listen on a port

//Define Routes   
app.use('/api/users', require('./routes/api/users')); //Creating endpoints to point to file
app.use('/api/auth', require('./routes/api/auth')); //Creating endpoints to point to file
app.use('/api/profile', require('./routes/api/profile')); //Creating endpoints to point to file
app.use('/api/posts', require('./routes/api/posts')); //Creating endpoints to point to file

const PORT = process.env.PORT || 5000; // //take app variable and listen on a port, if no ENV set then default to port 5000. 

app.listen(PORT, () => console.log(`Server Started on Port ${PORT}`)); //Call back 

