//==============================================================================
//                       SEARCH ACTIONS (and API plug)
//==============================================================================
//filters actions for one way data flow
var AppDispatcher = require('../dispatchers/AppDispatcher.js');
//defined user actions
var ActionTypes   = require('../constants/SearchConstants.js');
//Superagent request
var request       = require('superagent');

module.exports = {

  doSearch: function(query) {
    request.post('http://localhost:8080/api/s/')
    .set('Content-Type', 'application/json')
    .send(query)
    .end(function(err, res) {
        if(err)
          console.log(err);
        AppDispatcher.handleViewAction({
          actionType: ActionTypes.DO_SEARCH,
          threads: res.body.results
        });
    });
  },

  appendMore: function(query) {
    AppDispatcher.handleSetterAction({
      actionType: ActionTypes.SET_SPINNER,
      spinner: true
    });
    request.post('https://localhost:8080/api/s/')
    .set('Content-Type', 'application/json')
    .send(query)
    .end(function(err, res) {
        if(err)
          console.log(err);
        AppDispatcher.handleViewAction({
          actionType: ActionTypes.APPEND_MORE,
          threads: res.body.results
        });
        AppDispatcher.handleSetterAction({
          actionType: ActionTypes.SET_SPINNER,
          spinner: false
        });
    });
  },

  syncData: function(data) {
    AppDispatcher.handleSetterAction({
      actionType: ActionTypes.SYNC_SEARCH,
      data: data
    });
  }

};
