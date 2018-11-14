let express = require('express');
let bodyParser = require('body-parser');
let mongoose = require('mongoose');
<<<<<<< HEAD
let tripApi = require("./Apis/tripApi")
=======
let tripApi = require("./Apis/tripApi");
let mapApi = require('./Apis/mapApi');
>>>>>>> 05900b07582817d9cebfc7edd569b8561d7b312c
let app = express()

mongoose.connect('mongodb://localhost/trip', function () {
    console.log("DB connection established!!!");
})

app.use(express.static('public'));
app.use(express.static('node_modules'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With')
  
    next()
  })
  
app.use(mapApi)
app.use('/', tripApi)

app.listen(1000, () => {
    console.log('server started on port 1000')
});