import express from 'express';
import mongoose from 'mongoose';

//App Config
const app = express();
const port = process.env.PORT || 8002;

//Middlewares

//DB Config

//Api Routes
app.get('/', (req, res) => res.status(200).send('Hello World'));

//Listener
app.listen(port, () => console.log(`Listening on localhost at port: ${port}`));