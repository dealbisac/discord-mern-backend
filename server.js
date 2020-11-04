import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoData from './mongoData.js';
import Pusher from 'pusher';

dotenv.config();

//App Config
const app = express();
const port = process.env.PORT || 8002;

const pusher = new Pusher({
    appId: "1102277",
    key: "22990ff652e22adfad89",
    secret: "712ffc132ee6403fd7d7",
    cluster: "ap2",
    useTLS: true
});

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

mongoose.connection.once('open', () => {
    console.log('DB Connected')

    const changeStream = mongoose.connection.collection('conversations').watch()

    changeStream.on('change', (change) => {
        if (change.operationType === 'insert') {
            pusher.trigger('channels', 'newChannel', {
                'change': change
            });
        } else if (change.operationType === 'update') {
            pusher.trigger('conversation', 'newMessage', {
                'change': change
            });
        } else {
            console.log('Error Trigerring Pusher')
        }
    })
})


//Api Routes
app.get('/', (req, res) => res.status(200).send('Hello World'));

// API to create new Channel
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

//API to show the channel List
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

// API to push new message to specified channel
app.post('/new/message', (req, res) => {
    const newMessage = req.body

    mongoData.update(
        { _id: req.query.id },
        { $push: { conversation: req.body } },
        (err, data) => {
            if (err) {
                console.log('Error saving message...')
                console.log(err)

                res.status(500).send(err)
            } else {
                res.status(201).send(data)
            }
        }
    )
})

// API to show data 
app.get('/showData', (req, res) => {
    mongoData.find((err, data) => {
        if (err) {
            res.status(500).send(err)
        } else {
            res.status(201).send(data)
        }

    })
})

// API to show conversation 
app.get('/showConversation', (req, res) => {
    const id = req.query.id;

    mongoData.find({ _id: id }, (err, data) => {
        if (err) {
            res.status(500).send(err)
        } else {
            res.status(201).send(data)
        }

    })
})



//Listener
app.listen(port, () => console.log(`Listening on localhost at port: ${port}`));