var express = require('express');
var app = express();
// var bodyParser = require("body-parser");
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const uri = "mongodb+srv://bellamymaria:NTLZQT87YRyumf2d@cluster0.wccklaz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const todoModel = require('./models/todo.model');

// mongoose.connect(uri);
  
//   const db = mongoose.connection;
  
//   db.on('connected', () => {
//     console.log('Successfully connected to MongoDB!');
//   });
  
//   db.on('error', (err) => {
//     console.error('MongoDB connection error:', err);
//   });
  
// const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };

// async function run() {
//   try {
//     // Create a Mongoose client with a MongoClientOptions object to set the Stable API version
//     await mongoose.connect(uri, clientOptions);
//     await mongoose.connection.db.admin().command({ ping: 1 });
//     console.log("Pinged your deployment. You successfully connected to MongoDB!");
//   } finally {
//     // Ensures that the client will close when you finish/error
//     //await mongoose.disconnect();
//   }
// }
// run().catch(console.dir);


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static('public'));




app.get('/', async function(req, res) {
   const tasks = await todoModel.find({done:false})
   res.render('index', {tasks: tasks });
});

app.post('/add', function(req, res) {
    const todo = new todoModel({
        taskName: req.body.newTask,
        done: false
    })
    
    todo.save()
  .then((savedDoc) => {
    console.log('Saved to DB:', savedDoc); // shows the _id
    res.redirect('/');
  })
  .catch((err) => {
    console.error('Error saving to DB:', err);
    res.status(500).send("Failed to save task");
  });

 });

 app.post('/update', function(req, res) {
   console.log(req.body);
   // res.send('Update received');
});
 
 app.post('/done', function(req, res) {
    console.log(req.body.task)
//     if(typeof req.body.task === 'string'){
//         tasks = tasks.filter(item => item !== req.body.task)

//     } else if (Array.isArray(req.body.task)){
//         tasks = tasks.filter(item => req.body.task.indexOf(item) === -1)
// } else {
//     console.warn ('Data type not correct. Please check inputs.', req.body.task)
// }
    res.redirect('/')
})


mongoose.connect(uri)
  .then(() => {
    console.log('Successfully connected to MongoDB!');
    
    app.listen(3000, () => {
      console.log('App is running on port 3000');
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });

// mongoose.connect(
//     uri,
//     {
//           serverApi: {
//             version: ServerApiVersion.v1,
//             strict: true,
//             deprecationErrors: true}
//     }

// ).then((result) =>{
//     console.log('connected to Mongo DB');
//     app.listen(3000, function() {
//         console.log('Our app is running on port 3000');
//     })
// }).catch((err) => {
//     console.log(err)
// })



//CRUD -> To do = fetch post put delete
//if (tasks.indexOf(req.body.task) > -1){
    //    tasks.splice(tasks.indexOf(req.body.task))
    //}
    // == are they the same 
    // === are they the same and of the same type


    
// const { MongoClient, ServerApiVersion } = require('mongodb');
// const uri = "mongodb+srv://bellamymaria:zZRiFMIYYEwoefYh@cluster0.wccklaz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// // Create a MongoClient with a MongoClientOptions object to set the Stable API version
// const client = new MongoClient(uri, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   }
// });

// async function run() {
//   try {
//     // Connect the client to the server	(optional starting in v4.7)
//     await client.connect();
//     // Send a ping to confirm a successful connection
//     await client.db("admin").command({ ping: 1 });
//     console.log("Pinged your deployment. You successfully connected to MongoDB!");
//   } finally {
//     // Ensures that the client will close when you finish/error
//     await client.close();
//   }
// }
// run().catch(console.dir);
