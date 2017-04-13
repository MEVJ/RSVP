var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;


var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
var router = express.Router();

app.get('/', function (req, res) {
	res.sendFile(path.join(__dirname + '/index.html'));
});

router.route('/rsvp').post(function(req,res){
		console.log("inside the post",req.body);

		db.collection('rsvp').save(req.body, function(err, result)  {
		    if (err) {
					return res.json({"error":"404"});
				}
				console.log("request saved in db");
		    res.json({message:"recieved the RSVP request"});
		  });


});

router.route('/rsvp').get(function(req,res){

		db.collection('rsvp').ensureIndex({'email' : 1}, {unique : true, dropDups : true});
		db.collection('rsvp').find().toArray(function(err, results) {
			if (err) {
				return res.json({"error":"404"});
			}
			console.log(results);
  		res.json(results);

		});




});

MongoClient.connect('mongodb://localhost:27017/RSVP', function(err, database){
  if (err){
    throw err;
  }

  console.log('Connected to the database.');
  db = database;
  var server = app.listen(3000, function () {
  	console.log('api listening on', server.address().port);

  });

});

app.use('/api', router);
