const express = require('express')
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port = process.env.PORT || 5000;
require('dotenv').config()

// Middle Wore
app.use(cors());
app.use(express.json())

const uri = `mongodb+srv://${process.env.USER_NAMEDB}:${process.env.USER_PASSDB}@cluster0.xevudqv.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        const database = client.db('coffee-storesDB').collection('coffee-stores')

        app.get('/coffee', async(req, res) => {
            const cursor = database.find();
            const result = await cursor.toArray();
            res.send(result)
        })

        app.get('/coffee/:id', async(req, res) => {
            const id = req.params.id;
            const query = {_id: new ObjectId(id)};
            const result = await database.findOne(query);
            res.send(result)
        })

        app.post('/coffee', async(req, res) => {
            const coffee = req.body;
            const result = await database.insertOne(coffee);
            res.send(result)
        })

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.listen(port)