//==============================================================================
//                       CHAT ACTIONS (and API plug)
//==============================================================================
//filters actions for one way data flow
var AppDispatcher = require('../dispatchers/AppDispatcher.js');
//defined user actions
var ActionTypes   = require('../constants/ChatConstants.js');
//emit messages to server for IM capabilities
var socket        = require('../interfaces/socket.js');
//Superagent request
var request       = require('superagent');

module.exports = {

  addHandle: function(handle) {
    AppDispatcher.handleSetterAction({
      actionType: ActionTypes.ADD_HANDLE,
      handle: handle
    });
  },

  newMessage: function(message) {
    AppDispatcher.handleSetterAction({
      actionType: ActionTypes.NEW_MESSAGE,
      message: message
    });
  },

  sendMessage: function(message) {
      AppDispatcher.handleViewAction({
        actionType: ActionTypes.CREATE_MESSAGE,
        message: message
      });
      socket.emit('sendMessage', message);
  },

  newUser: function() {
    AppDispatcher.handleViewAction({
      actionType: ActionTypes.NEW_USER
    });
  },

  userDisconnected: function() {
    AppDispatcher.handleSetterAction({
      actionType: ActionTypes.USER_DISCONNECTED
    });
  },

  loadMessages: function(thread) {
    request.get('https://localhost:8080/api/c/' + thread)
    .end(function(err, res) {
        if(err)
          console.log(err);
        AppDispatcher.handleViewAction({
          actionType: ActionTypes.LOAD_MESSAGES,
          messages: res.body.messages
        });
    });
  },

  syncData: function(data) {
    AppDispatcher.handleSetterAction({
      actionType: ActionTypes.SYNC_DATA,
      data: data
    });
  },

  readAll: function() {
    AppDispatcher.handleSetterAction({
      actionType: ActionTypes.READ_ALL
    });
  },

  changeEnterMode: function() {
    AppDispatcher.handleSetterAction({
      actionType: ActionTypes.CHANGE_ENTER_MODE
    });
  }
};
