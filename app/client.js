//==============================================================================
//                  Top-Level Client App (controls routing)
//==============================================================================
var React       = require('react');
var Router      = require('react-router');
var routes      = require('../routes.jsx');
//run router
Router.run(routes, Router.HistoryLocation, function(Handler, state) {
  React.render(<Handler/>, document.body);
});
