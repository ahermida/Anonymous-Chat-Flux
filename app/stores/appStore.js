//==============================================================================
//                           CHAT STORE SETUP
//==============================================================================

var AppDispatcher    = require('../dispatchers/AppDispatcher.js');
var ChatConstants    = require('../constants/ChatConstants.js');
var EventEmitter     = require('events').EventEmitter;
var assign           = require('object-assign');
var CHANGE_EVENT     = 'change';
var isNode           = (typeof process != 'undefined' && typeof process.versions != 'undefined' && typeof process.versions.node != 'undefined');
var _data            = {};
_data.messages       = [];
_data.username       = 'Anonymous';
_data.userID         = '';
_data.doLoad         = false;
_data.users          = [];
_data.readAll        = true;
_data.unread         = 0;
_data.enterMode      = true;


//==============================================================================
//                          UTILITY METHODS
//==============================================================================

function newUserMessage() {
  var date = new Date().getTime();
  var message = {
    username: "CONSOLE",
    body: "A New User Has Joined The Room.",
    timestamp: date,
    userID: "CONSOLE"
  };
  return message;
}

function userDisconnectedMessage() {
  var date = new Date().getTime();
  var message = {
    username: "CONSOLE",
    body: "A User Has Disconnected.",
    timestamp: date,
    userID: "CONSOLE"
  };
  return message;
}

function _populateUserlist() {
  _data.messages.forEach(function(message) {
    if (_data.users.indexOf(message.userID) == -1){
      _data.users.push(message.userID);
    }
  });
}

//switch messages array for our messages from ajax
function _loadMessages(messages) {
    _data.messages = messages;
    _populateUserlist()
}

function _addMessage(message) {
  if (_data.users.indexOf(message.userID)== -1) {
    _data.users.push(message.userID);
  }
  _data.messages.push(message);
  if (!((window.innerHeight + window.scrollY) >= document.body.offsetHeight) && (message.userID !== _data.userID)) {
    _data.readAll = false;
  }
  if (document[hidden] && !isNode) {
    _data.unread++;
    document.title = '(' + _data.unread + ')' + ' Anonymous';
    document.addEventListener(visibilityChange, function(){
      document.title = 'Anonymous';
      _data.unread = 0;
      document.removeEventListener(visibilityChange);
    }, false);
  }

}

function _addHandle(handle) {
  _data.username = '' + handle;
}

function _syncData(data) {
  _data = data;
  //Change the embedded global object & local switch
  data = { doLoad: true}
  _data.doLoad = true;
  _populateUserlist();
}

function _generateID() {
  var s = "";
  var v;
  while(s.length < 7 && 7 > 0) {
    v = Math.random() < 0.5 ? 32 : 0;
    s += String.fromCharCode(Math.round(Math.random()*((122-v)-(97-v))+(97-v)));
  }
  return s;
}

function _setUserID() {
  if (!isNode) {
  var anonID = localStorage.getItem('anonID');
  if (anonID) {
    _data.userID = anonID;
  } else {
    var newID = _generateID();
    _data.userID = newID;
    localStorage.setItem('anonID', newID);
  }
  }
}

function _readAll(){
  _data.readAll = true;
}

function _changeEnterMode() {
  _data.enterMode = !_data.enterMode;
}
//==============================================================================
//                             HIDDEN API
//             (to access hidden API from different browsers)
//==============================================================================
if (!isNode) {
  var hidden, visibilityChange;
  if (typeof document.hidden !== "undefined") { // Opera 12.10 and Firefox 18 and later support
    hidden = "hidden";
    visibilityChange = "visibilitychange";
  } else if (typeof document.mozHidden !== "undefined") {
    hidden = "mozHidden";
    visibilityChange = "mozvisibilitychange";
  } else if (typeof document.msHidden !== "undefined") {
    hidden = "msHidden";
    visibilityChange = "msvisibilitychange";
  } else if (typeof document.webkitHidden !== "undefined") {
    hidden = "webkitHidden";
    visibilityChange = "webkitvisibilitychange";
  }
}

//==============================================================================
//                   ASSIGN EVENTLISTENER TO STORE CHANGES
//==============================================================================
var appStore = assign({}, EventEmitter.prototype, {

  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },

  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },

  getData: function() {
    return _data;
  },

  resetStore: function() {
    _data                = {};
    _data.messages       = [];
    _data.username       = 'Anonymous';
    _data.userID         = '';
    _data.doLoad         = false;
    _data.users          = [];
    _data.readAll        = true;
    _data.unread         = 0;
    _data.enterMode      = true;
  }
});

//==============================================================================
//          REGISTER EVENTS WITH DISPATCHER WHEN THEY ARE CALLED
//==============================================================================

appStore.dispatchToken = AppDispatcher.register(function(payload) {
  var action = payload.action;
  switch(action.actionType) {

    case ChatConstants.ADD_HANDLE:
      _addHandle(action.handle);
      break;

    case ChatConstants.CREATE_MESSAGE:
      _addMessage(action.message);
      break;

    case ChatConstants.NEW_MESSAGE:
      _addMessage(action.message);
      break;

    case ChatConstants.NEW_USER:
      _addMessage(newUserMessage());
      break;

    case ChatConstants.USER_DISCONNECTED:
      _addMessage(userDisconnectedMessage());
      break;

    case ChatConstants.LOAD_MESSAGES:
      _loadMessages(action.messages);
      _setUserID();
      break;

    case ChatConstants.SYNC_DATA:
      _syncData(action.data);
      _setUserID();
      break;

    case ChatConstants.READ_ALL:
      _readAll();
      break;

    case ChatConstants.CHANGE_ENTER_MODE:
      _changeEnterMode();
      break;

    default:
      return true;
  }

  appStore.emitChange();

});

module.exports = appStore;
