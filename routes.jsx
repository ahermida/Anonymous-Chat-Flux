//==============================================================================
//             ROUTEY ROUTEY ROUTES (FOR CLIENT, NOT ENDPOINTS)
//==============================================================================

var React         = require('react');
var ReactRouter   = require('react-router');
var Router        = ReactRouter.Router;
var Route         = ReactRouter.Route;
var Search        = require('./app/components/Search/Search.jsx');
var App           = require('./app/components/App.jsx');
var MainView      = require('./app/components/Messaging/MainView.jsx');

module.exports    = [
  <div key={1}>
    <Route key={2} path="/" component={App}/>
    <Route key={3} path="/c/:thread" component={MainView}/>
    <Route key={4} path="/s/:query" component={Search} />
    <Route key={5} path="*" component={App}/>
  </div>
];
