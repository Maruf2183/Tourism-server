const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

const app = express();
const env = require('dotenv').config();

const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rtxhj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });






async function run() {
    try {
        await client.connect();
        const database = client.db('havenHolidays');
        const userCollection = database.collection('service-data')
        const userRegister = database.collection('Register-Data');



        app.get('/services', async (req, res) => {
            const cursor = userCollection.find({});
            const data = await cursor.toArray();
            res.json(data)
            
        });
        app.post('/services', async (req, res) => {
            const data = req.body;
            const result=await userCollection.insertOne(data)
        })
        app.get('/services/:id',async(req, res) => {
            const id =req.params.id
            console.log('get service by id',id);
            const quary = {_id:ObjectId(id)};
            const result = await userCollection.findOne(quary);
            res.json(result)


        });

        app.post('/booking', async (req, res) => {
            console.log(`server hitted`);
            const data = req.body;
            const result = await userRegister.insertOne(data);
            res.json(result);
           
        });
        app.get('/booking', async (req, res) => {
            const bookings = await userRegister.find({}).toArray();
            res.json(bookings);
        });
        app.get('/booking', async (req, res) => {
            console.log('email server hitted', req.query);
            const reqdata = req.query.email;
            const quary = { email: { $in: [reqdata] } };
            const bookings = await userRegister.find(quary).toArray();
            res.json(bookings);


        });
        app.delete('/booking/:id', async (req, res) => {
            console.log(req.params.id);
        })
        

        

     }
    finally {
        
    }
 }
run().catch(error => console.log(error));

app.get('/', (req, res) => {
    res.send('servier work successfully')
});











app.listen(port, () => {
    console.log('listening to port', port);
    
})



