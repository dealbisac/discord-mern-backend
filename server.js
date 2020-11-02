import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

const dotenv = require('dotenv');
dotenv.config();

//App Config
const app = express();
const port = process.env.PORT || 8002;

//Middlewares
app.use(express.json());
app.user(cors());

//DB Config
const mongoURI = process.env.MONGO_URI || 'test';

mongoose.connect(mongoURI, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
})

//Api Routes
app.get('/', (req, res) => res.status(200).send('Hello World'));

//Listener
app.listen(port, () => console.log(`Listening on localhost at port: ${port}`));