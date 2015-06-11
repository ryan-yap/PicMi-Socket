var redis = require('redis'),
    client = redis.createClient()

var proximity = require('geo-proximity').initialize(client)
var user_db = require('mongoskin').db('mongodb://54.153.62.38:27017/User');
var ObjectID = require('mongoskin').ObjectID

var app = require('http').createServer()
var io = require('socket.io')(app);
var count = 0
var connection_made = 0
app.listen(8080);

io.on("connection", function(socket){
    connection_made++;
    socket.on("ping", function(data) {
      info = data.split(":")
      console.log("Ping")
      user_db.collection('account').find({_id:ObjectID(info[0])}).toArray(
        function(err, result) {
		if(result){
                 	proximity.addLocation(parseFloat(info[1]), parseFloat(info[2]), info[0], function(err, reply){
                        	if(err) console.error(err)
                        	else console.log("added " + reply + " location:" + info)
                        	return
                	})
		}
        })
    });

    socket.on("test", function(data) {
      if (data == "test"){
        console.log("received messaged", count)
        console.log("connection_made", connection_made)
      }
    })

    socket.on("disconnect", function() {
      return
    });
  });

