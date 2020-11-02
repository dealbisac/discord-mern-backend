import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoData from './mongoData.js';

dotenv.config();

//App Config
const app = express();
const port = process.env.PORT || 8002;

//Middlewares
app.use(express.json());
app.use(cors());

//DB Config
const mongoURI = process.env.MONGO_URI || 'test';

mongoose.connect(mongoURI, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
})

//Api Routes
app.get('/', (req, res) => res.status(200).send('Hello World'));

app.post('/new/channel', (req, res) => {
    const dbData = req.body

    mongoData.create(dbData, (err, data) => {
        if (err) {
            res.status(500).send(err)
        } else {
            res.status(201).send(data)
        }

    })
})

app.get('/channelList', (req, res) => {
    mongoData.find((err, data) => {
        if (err) {
            res.status(500).send(err)
        } else {
            let channels = [];

            data.map((channelData) => {
                const channelInfo = {
                    id: channelData._id,
                    name: channelData.channelName
                }
                channels.push(channelInfo)
            })

            res.status(201).send(channels)
        }
    })

})

//Listener
app.listen(port, () => console.log(`Listening on localhost at port: ${port}`));