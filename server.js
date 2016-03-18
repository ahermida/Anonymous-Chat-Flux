//==============================================================================
//                          BASIC SETUP
//==============================================================================

//other react-related stuff
require("babel-core/register")({
  // This will override `node_modules` ignoring - you can alternatively pass
  // an array of strings to be explicitly matched or a regex / glob
});

//==============================================================================
//                         CALL PACKAGES
//==============================================================================
var express          = require('express');		// call express
var app              = express();     				// define our app using express
var bodyParser       = require('body-parser');// get body-parser
var morgan           = require('morgan'); 		// used to see requests
var mongoose         = require('mongoose');
var config 	         = require('./config');
var server           = require('http').createServer(app);
var io               = require('socket.io').listen(server);
var React            = require('react');
var renderToString   = require('react-dom/server').renderToString;
var Router           = require('react-router');
var routes           = require('./routes.jsx');
var fs               = require('fs');
var dataStore        = require('./app/stores/appStore.js');
var searchStore      = require('./app/stores/searchStore.js');
var Thread           = require('./nodeResources/models/thread.js'); // to fill out user model
var match            = Router.match;
var RoutingContext   = Router.RoutingContext;

//==============================================================================
//                       APP CONFIGURATIONS
//==============================================================================

// use body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// configure our app to handle CORS requests
app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

// log all requests to the console
app.use(morgan('dev'));

// connect to database
mongoose.connect(config.database);

//connect server side rendering data with main data
function getMessages(threadName, callback){
  // find the user
  Thread.findOne({
    room: threadName
  }).select('room messages').exec(function(err, thread) {
    if (err) throw err;
    // no thread with that username was found
    if (!thread) {
      var newThread = new Thread();
      newThread.room = threadName;
      newThread.topics = threadName.toLowerCase().split(' ');
      newThread.save(function(err) {
        if (err) {
        console.log(err);
        }
      });
      callback([]);
    } else if (thread) {
      callback(thread.messages);
    }

  });
}

//connect server side rendering data with main
function getSearched(query, callback) {
  var queryParam = { topics: { $in: query }};
  if (query == "" || query == undefined) {
    queryParam = {};
  }
  Thread.find(queryParam)
    .limit(15)
    .select('messages room createdAt')
    .exec(function(err, results) {
      if (err) throw err;
      // no thread with that username was found
      if (!results) {
        callback([]);
      } else if (results) {
        callback(results);
      }
    });
}

function evaluateKeywords(query) {
    return query.substr(9).split('+');
}


//==============================================================================
//                        BRING IN API ROUTES
//==============================================================================

var apiRoutes = require('./nodeResources/routes/api')(app, express);
app.use('/api', apiRoutes);

//==============================================================================
//              SET STUFF TO STATIC & SET ENTRY ROUTES
//==============================================================================

//set to static
app.use(express.static(__dirname + '/public'));

//Escape Content in JSON -- check https://gist.github.com/CatTail/4174511
var encodeHTML = function(str) {
  var buf = [];
  for (var i=str.length-1;i>=0;i--) {
    buf.unshift(['&#', str[i].charCodeAt(), ';'].join(''));
  }
  return buf.join('');
};

//REACT ROUTER
function render(content, data, done) {
  fs.readFile('./views/index.html', 'utf8', function (err, layout) {
    if (err) done(err);
    done(null, layout
        .replace('{{{body}}}', content)
        .replace('{{{data}}}', encodeHTML(JSON.stringify(data))));
  });
};

app.get('/', function(req, res, next)  {
  // Note that req.url here should be the full URL path from
  // the original request, including the query string.
  match({ routes, location: req.url }, function(err, redirectLocation, renderProps) {
    if (err) {
      res.send(err.message);
    } else if (renderProps) {
      var html = renderToString(React.createElement(RoutingContext, renderProps));
      var data = { doLoad: true };
      render(html, data, function(err, file){
        if (err) throw err;
        res.send(file);
      });
    }
  });
});

app.get('/c/:thread', function(req, res, next)  {
  getMessages(req.params.thread, function(messages) {
    match({ routes, location: req.url }, function(err, redirectLocation, renderProps) {
      if (err) {
        res.send(err.message);
      } else if (renderProps) {
        var html = renderToString(React.createElement(RoutingContext, renderProps));
        var _data = dataStore.getData();
        _data.messages = messages;
        render(html, _data, function(err, file){
          if (err) throw err;
          res.send(file);
        });
      }
    });
  });
});


app.get('/s/:query', function(req, res, next)  {
  getSearched(evaluateKeywords(req.params.query), function(searched) {
    match({ routes, location: req.url }, function(err, redirectLocation, renderProps) {
      if (err) {
        res.send(err.message);
      } else if (renderProps) {
        var html     = renderToString(React.createElement(RoutingContext, renderProps));
        var data     = searchStore.getData();
        data.results = searched;
        render(html, data, function(err, file){
          if (err) throw err;
          res.send(file);
        });
      }
    });
  });
});

//catchall route
app.get('*', function(req, res) {
  res.redirect('/');
});


//==============================================================================
//                              SOCKETS
//==============================================================================
io.on('connection', function(socket) {

  socket.on('join room', function (room) {
    socket.leave(socket.room);
    socket.room = room;
    socket.join(socket.room);
    socket.broadcast.to(socket.room).emit('newUser');
  });

  // May want to break up these two actions
  socket.on('sendMessage', function(message) {
    if (typeof socket.room == 'undefined') {
      return;
    } else {
    socket.broadcast.to(socket.room).emit('newMessage', message);
    Thread.findOne({
      room: socket.room
    }).select('room messages').exec(function(err, thread) {
      if (err) throw err;
      if (!thread) {
        var newThread = new Thread();
        newThread.room = socket.room;
        newThread.topics = socket.room.toLowerCase().split(' ');
        newThread.messages.push(message);
        newThread.save(function(err) {
            if (err)
              console.log(err);
        });
      } else if (thread) {
        thread.messages.push(message);
        thread.save(function(err) {
            if (err) {
            console.log(err);
          }
        });
    }
  });
  }
  });

  socket.on('disconnect', function() {
    socket.broadcast.to(socket.room).emit('userDisconnected');
    socket.leave(socket.room);
  });

});

//==============================================================================
//                                RUN
//==============================================================================

server.listen(config.port);
console.log('App running on http://localhost:' + config.port);
