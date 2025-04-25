var express = require('express');
var app = express();
const axios = require('axios');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// MongoDB URI connection string
const uri = "mongodb+srv://bellamymaria:NTLZQT87YRyumf2d@cluster0.wccklaz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// replace with my own key
const nasaApiKey = '2BRwd8cVzAQGPjPZ2cIaFHVdlZ8ZJ5DDABiLQW4o';
const nasaApiUrl = `https://api.nasa.gov/planetary/apod?api_key=${nasaApiKey}`;

// Mongoose schemas and models
const todoSchema = new mongoose.Schema({
  taskName: String,
  done: Boolean
});
const todoModel = mongoose.model('Todo', todoSchema);

const imageSchema = new mongoose.Schema({
  title: String,
  url: String,
  date: String,
  description: String,
});
const Image = mongoose.model('Image', imageSchema);

// MongoDB connection
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Set up Express and EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Home page: Display NASA's Image of the Day and Todo List
app.get('/', async (req, res) => {
  try {
    // Fetch NASA's image of the day
    const response = await axios.get(nasaApiUrl);
    const image = response.data;
    
    // Fetch Todo List
    const tasks = await todoModel.find({ done: false });

    // Render the home page with both NASA image and tasks
    res.render('index', { image, tasks });
  } catch (err) {
    console.error('Error fetching data from NASA API:', err);
    res.status(500).send('Error fetching image from NASA API');
  }
});

// Handle the POST request for the selected date
app.post('/fetch-past-image', async (req, res) => {
    const { date } = req.body;
    const pastNasaApiUrl = `https://api.nasa.gov/planetary/apod?api_key=${nasaApiKey}&date=${date}`;
  
    try {
      // Fetch the NASA image for the selected date
      const response = await axios.get(pastNasaApiUrl);
      const image = response.data;
  
      // Fetch Todo List (if necessary, can be used in the same page)
      const tasks = await todoModel.find({ done: false });
  
      // Render the page with the past NASA image and the todo tasks
      res.render('pastNasaImage', { image, tasks });
    } catch (err) {
      console.error('Error fetching data from NASA API:', err);
      res.status(500).send('Error fetching image from NASA API');
    }
  });
  

// Add task to the todo list
app.post('/add', function (req, res) {
  const todo = new todoModel({
    taskName: req.body.newTask,
    done: false
  });

  todo.save()
    .then((savedDoc) => {
      console.log('Saved to DB:', savedDoc);
      res.redirect('/');
    })
    .catch((err) => {
      console.error('Error saving to DB:', err);
      res.status(500).send("Failed to save task");
    });
});

// Mark task as done
app.post('/done', async function (req, res) {
  console.log("Received request to mark task as done:", req.body);
  let taskIds = [];

  if (typeof req.body.task === 'string') {
    taskIds = [req.body.task];
  } else if (Array.isArray(req.body.task)) {
    taskIds = req.body.task;
  } else {
    console.warn('Data type not correct. Please check inputs.', req.body.task);
    res.redirect('/');
  }

  const tasks = await todoModel.find({ '_id': { $in: taskIds } });
    console.log("Tasks to be marked as done:", tasks);

  try {
    // Update the tasks as done in the database
    await todoModel.updateMany(
      { '_id': { $in: taskIds } },
      { $set: { done: true } }
    );
    res.redirect('/');
  } catch (err) {
    console.error('Error updating tasks:', err);
    res.status(500).send('Error updating tasks');
  }
});

// Save NASA image to database
app.post('/save', async (req, res) => {
  const { title, date, url, description } = req.body;
  const newImage = new Image({ title, date, url, description });

  try {
    await newImage.save();
    res.redirect('/saved');
  } catch (err) {
    console.error('Error saving image:', err);
    res.status(500).send('Error saving image');
  }
});

// View saved images
app.get('/saved', async (req, res) => {
  try {
    const images = await Image.find();
    const tasks = await todoModel.find({ done: false });
    res.render('saved', { images, tasks });
  } catch (err) {
    console.error('Error fetching saved images:', err);
    res.status(500).send('Error fetching saved images');
  }
});

// Delete saved image
app.post('/delete', async (req, res) => {
  const { imageId } = req.body;
  try {
    await Image.deleteOne({ _id: imageId });
    res.redirect('/saved');
  } catch (err) {
    console.error('Error deleting image:', err);
    res.status(500).send('Error deleting image');
  }
});

// Start the server
app.listen(3000, () => {
  console.log('App is running on http://localhost:3000');
});


