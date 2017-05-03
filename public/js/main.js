$(function() {
  var FADE_TIME = 300; // ms
  var TYPING_TIMER_LENGTH = 400; // ms
  
  var $logs = $('.logs');
  var $userList = $('.userList');
  var $heading = $('.heading');

  var $loginPage = $('.login.page'); // The login page

  var username;
  var socket = io();

  function log (message, options) {
    var $el = $('<li>').addClass('log').text(message);
    addMessageElement($el, options);
  }

  function ipToValidClass(user) {
    var result="a";
    for(var i=0;i<user.length;i++) {
      if(user[i] == ':')
        result+='_';
      else if(user[i] == '.')
        result+='-';
      else
        result+=user[i]
    }
    return result;
  }

  function populateUserList(userList) {
    for(user in userList) {
      var $el = $('<li>').addClass(ipToValidClass(user)).text(user);
      $userList.prepend($el);
    }
  }

  function addUserList(data) {
    var $el = $('<li>').addClass(ipToValidClass(data.username)).text(data.username);
    $userList.prepend($el);
  }

  function removeUserList(user) {
    var $el = $('.userList .' + ipToValidClass(user));
    $el.remove();
  }

  
  function addMessageElement (el, options) {
    var $el = $(el);

    if (!options) {
      options = {};
    }
    if (typeof options.fade === 'undefined') {
      options.fade = true;
    }
    if (typeof options.prepend === 'undefined') {
      options.prepend = false;
    }

    if (options.fade) {
      $el.hide().fadeIn(FADE_TIME);
    }
    if (options.prepend) {
      $logs.prepend($el);
    } else {
      $logs.append($el);
    }
    $logs[0].scrollTop = $logs[0].scrollHeight;
  }

  function cleanInput (input) {
    return $('<div/>').text(input).text();
  }

  function formatDate(dateObj) {
    var d = new Date(dateObj);
    var hours = d.getHours();
    var minutes = d.getMinutes().toString();

    return hours + ":" + (minutes.length === 1 ? '0'+minutes : minutes);
  }


  socket.on('login', function (data) {
    populateUserList(data.userList);
    document.getElementById("count").innerHTML = "Total Online: " + data.numUsers;
  });

  socket.on('displayMyIP', function (data) {
    var message = "Welcome to CloudBoost – Your IP is : "+data;
    document.getElementById("heading").innerHTML = "Welcome to CloudBoost";
    document.getElementById("myName").innerHTML = "Your IP is: "+ data;
  });

  socket.on('user joined', function (data) {
    log(data.username + ' joined');
    console.log("called");
    document.getElementById("count").innerHTML = "Online Users: " + data.numUsers;
    addUserList(data);
  });

  socket.on('user left', function (data) {
    log(data.username + ' left');
    document.getElementById("count").innerHTML = "Online Users: " + data.numUsers;
    removeUserList(data.username);
  });
});