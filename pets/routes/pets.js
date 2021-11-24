var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var multer = require('multer');
var upload = multer();
const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017';
const dbName = 'petshopdb';
const client = new MongoClient(url);

//A local list of animals
var animalsList = [{ name:'Logan', species:'Dog', breed:'Border Collie', age:'5', colour:'Black with white, blue and tan head' }, {name:'Archie', species:'Dog', breed:'Mongrel', age:'15.5', colour:'White' }]
 
// GET at the root just to demonstrate
router.get('/', function(req, res, next) {
   res.send('got a GET request at /');
});
 
// GET list of pets to show that we're up and running
// router.get('/pet', function(req, res, next) {
//   res.send('Got a GET request at /pet');
// });
// router.get('/pet', (req, res, next) => {
//     res.render('pets',
//     {title: 'Pet Store',
//     message: 'Your Existing pets',
//     animalsList: animalsList});
// });
router.get('/pet', function(req, res, next){
    client.connect(function(err){
        const db = client.db(dbName);
        const collection = db.collection('animals');
        collection.find({}).toArray(function(err, data){
            res.render('pets', {title: 'Pet Store', animalsList: data});
        });
    });
});

// GET at the root just to demonstrate displaying dog
router.get('/pet/dog', function(req, res, next) {
    res.send('got a GET request at /pet/dog');
 });
 
//accept POST request and add a new pet to the db
// router.post('/pet', upload.array(), function (req, res) {
//    animalsList.push(req.body);
//    res.redirect('/petshop/pet');
// });
router.post('/pet', upload.array(), function (req, res){
    let nu = {name: req.body.name, species: req.body.species, breed: req.body.breed, age: req.body.age, colour: req.body.colour};

    client.connect(function(err){
        const db = client.db(dbName);
        const collection = db.collection('animals');
        collection.insertOne(nu, function(err, result){
            if(err != null){console.log(err);}
            res.redirect('/petshop/pet');
        });
    });
});
 
// accept PUT request at /pet
router.put('/pet', function (req, res) {
 res.send('Got a PUT request at /pet');
});
 
 
// accept DELETE request at /pet
router.delete('/pet', function (req, res) {
 res.send('Got a DELETE request at /pet');
});
 
module.exports = router;