var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 8080;

  server.listen(port, function () {
    console.log('Updated : Server listening at port %d', port);
  });

  app.use('/js',  express.static(__dirname + '/public/js'));
  app.use('/css', express.static(__dirname + '/public/css'));
  app.use(express.static(__dirname + '/public'));

  var usernames = {};
  var numUsers = 0;

  io.on('connection', function (socket) {
    var addedUser = false;
    var clientAddress = socket.request.connection.remoteAddress+":"+socket.request.connection.remotePort;
    //console.log("Address is - ",clientAddress);
    if(usernames.hasOwnProperty(clientAddress)) {
      usernames[clientAddress] ++;
    } else {
      usernames[clientAddress] = 1;
      numUsers++;
    }
    addedUser = true;
    socket.emit('displayMyIP', clientAddress);
    if(usernames[clientAddress] == 1)
      socket.broadcast.emit('user joined', {username: clientAddress,numUsers: numUsers});
    socket.emit('login', {clientAddress:clientAddress,userList:usernames,numUsers: numUsers});
    socket.on('add user', function (username) {
      
    });

    socket.on('disconnect', function () {

      var clientAddress = socket.request.connection.remoteAddress+":"+socket.request.connection.remotePort;
      if (addedUser) {
        usernames[clientAddress] --;
        if(usernames[clientAddress] <= 0) {
          delete usernames[clientAddress];
          --numUsers;
          socket.broadcast.emit('user left', {
          username: clientAddress,
          numUsers: numUsers
          });
        }
      }
    });
  });