var express = require('express');
var app = express();
var bodyParseer = require("body-parser");
const path = require('path');
const bodyParser = require('body-parser');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({encoded: false}));

var tasks =["create to do list", "add items"]

app.get('/', function(req, res) {
   // res.send('New Node App');
   res.render('index', {tasks: tasks || []});
})

app.post('/add', function(req, res) {
    console.log(req)
    tasks.push(req.body.newTask)
    res.redirect('/');
 })
 
app.listen(3000, function() {
    console.log('Our app is running on port 3000');
})

//CRUD -> To do = fetch post put delete