const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.db_USER}:${process.env.db_PASS}@cluster0.mypgnvz.mongodb.net/?retryWrites=true&w=majority`;

console.log(process.env.db_USER);


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
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
    const popularservicecollection = client.db('Career_Maker').collection('popular_services');
    const purchaseCollection = client.db('Career_Maker').collection('purchase_services');
    const addserviceCollection = client.db('Career_Maker').collection('add_services');


    // popular services related api
    app.get('/popularServices', async (req, res) => {
      const query = {};
      const sort = { length: -1 };
      const limit = 4;
      const cursor = popularservicecollection.find(query).sort(sort).limit(limit);
      const result = await cursor.toArray();
      res.send(result);

    })
    // for all services
    app.get('/allservices', async (req, res) => {

      const cursor = popularservicecollection.find();
      const result = await cursor.toArray();
      res.send(result);

    })
    // get data for view details
    app.get('/popularServices/:id', async (req, res) => {
      const id = req.params.id;
      const options = {
        projection: {}
      };
      const query = { _id: new ObjectId(id) };
      const result = await popularservicecollection.findOne(query);
      res.send(result);
    })
    // purchase booking
    app.post('/mypurchase', async (req, res) => {
      const newPurchase = req.body;
      console.log(newPurchase);
      const result = await purchaseCollection.insertOne(newPurchase);
      res.send(result);
    })
    app.get('/mypurchase', async (req, res) => {

      const email = req.query?.email;
      const query = { email };
      console.log(query);

      const cursor = purchaseCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });
    // addservice api
    app.post('/addservice', async (req, res) => {
      const newservice = req.body;
      console.log(newservice);
      const result = await addserviceCollection.insertOne(newservice);
      res.send(result);
    })
    app.get('/addservice', async (req, res) => {
      const cursor = addserviceCollection.find();
      const result = await cursor.toArray();
      res.send(result);

    })
    // delete service
    app.delete('/addservice/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await addserviceCollection.deleteOne(query);
      res.send(result);
    })
    // Update service
    app.patch('/addservice/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const updatedBooking = req.body;
      console.log(updatedBooking);
      const updateDoc = {
        $set: {
          status: updatedBooking.status
        },
      };
      const result = await addserviceCollection.updateOne(filter, updateDoc);
      res.send(result);
    })


    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


// GET method route
app.get('/', (req, res) => {
  res.send('career is running');
})
app.listen(port, () => {
  console.log(`Career Maker Server is running on port ${port}`);
})