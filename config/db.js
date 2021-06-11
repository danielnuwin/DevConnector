/**MONGODB CONNECTION */

const mongoose = require('mongoose'); //Require(), config.get()??
const config = require('config');
const db = config.get('mongoURI');

//Async Await always wrap in try catch block
const connectDB = async () => {
    try {
        await mongoose.connect(db, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        }); //since connect returns a promise put await before it
        console.log('MongoDB Connected...')
    } catch (err) {
        console.log(err.message);
        process.exit(1); //To fail application and exit it with failure. 
    }
}

module.exports = connectDB;