var Dispatcher = require('flux').Dispatcher;

var AppDispatcher = new Dispatcher();

AppDispatcher.handleViewAction = function(action) {
  this.dispatch({
    source: 'VIEW_ACTION',
    action: action
  });
}

AppDispatcher.handleSetterAction = function(action) {
  this.dispatch({
    source: 'SETTER_ACTION',
    action: action
  });
}

module.exports = AppDispatcher;
