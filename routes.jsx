//==============================================================================
//             ROUTEY ROUTEY ROUTES (FOR CLIENT, NOT ENDPOINTS)
//==============================================================================

var React         = require('react');
var Router        = require('react-router');
var Route         = Router.Route;
var Search        = require('./app/components/Search/Search.jsx');
var App           = require('./app/components/App.jsx');
var MainView      = require('./app/components/Messaging/MainView.jsx');
module.exports    = [
  <Route name="app">
    <Route name="main" path="/" handler={App}/>
    <Route name="chat" path="/c/:thread" handler={MainView}/>
    <Route name="search" path="/s/:query" handler={Search} />
    <Route name="catch" path="/*" handler={App}/>
  </Route>
];
