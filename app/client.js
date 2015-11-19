//==============================================================================
//                  Top-Level Client App (controls routing)
//==============================================================================
var React       = require('react');
var ReactRouter = require('react-router');
var Router      = ReactRouter.Router;
var routes      = require('../routes.jsx');
var ReactDOM    = require('react-dom');
var history     = require('history/lib/createBrowserHistory');

//run
ReactDOM.render(<Router history={history()}>
                  {routes}
                </Router>, document.getElementById('react'));
