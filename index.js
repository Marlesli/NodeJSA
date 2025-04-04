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
});

app.post('/add', function(req, res) {
    tasks.push(req.body.newTask)
    res.redirect('/');
 });

 app.post('/update', function(req, res) {
   console.log(req.body);
   // res.send('Update received');
});
 
 app.post('/done', function(req, res) {
    if(typeof req.body.task === 'string'){
        tasks = tasks.filter(item => item !== req.body.task)

    } else if (Array.isArray(req.body.task)){
        tasks = tasks.filter(item => req.body.task.indexOf(item) === -1)
} else {
    console.warn ('Data type not correct. Please check inputs.', req.body.task)
}
    res.redirect('/')
});

app.listen(3000, function() {
    console.log('Our app is running on port 3000');
});

//CRUD -> To do = fetch post put delete
//if (tasks.indexOf(req.body.task) > -1){
    //    tasks.splice(tasks.indexOf(req.body.task))
    //}
    // == are they the same 
    // === are they the same and of the same type