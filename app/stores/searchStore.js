//==============================================================================
//                       SEARCH STORE SETUP
//==============================================================================

var AppDispatcher          = require('../dispatchers/AppDispatcher.js');
var SearchConstants        = require('../constants/SearchConstants.js');
var EventEmitter           = require('events').EventEmitter;
var assign                 = require('object-assign');
var CHANGE_EVENT           = 'change';
var isNode                 = (typeof process != 'undefined' && typeof process.versions != 'undefined' && typeof process.versions.node != 'undefined');
var _searchData            = {};
_searchData.results        = [];
_searchData.page           = 0;
_searchData.spinner        = false;
_searchData.doLoad         = false;
//==============================================================================
//                          UTILITY METHODS
//==============================================================================

function _doSearch(threads) {
  _searchData.results = threads;
  _searchData.page = 0;
  _searchData.doLoad = true;
}

function _appendMore(threads) {
  threads.forEach(function(i) {
    _searchData.results.push(i);
  });
  _searchData.page++;
}

function _setSpinner(spinner) {
  _searchData.spinner = spinner;
}

function _syncData(results) {
  data = { doLoad: true };
  _searchData.doLoad = true;
  _searchData = results;
}

//==============================================================================
//                   ASSIGN EVENTLISTENER TO STORE CHANGES
//==============================================================================
var searchStore = assign({}, EventEmitter.prototype, {

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
    return _searchData;
  },

  resetStore: function() {
    _searchData                = {};
    _searchData.results        = [];
    _searchData.page           = 0;
    _searchData.spinner        = false;
    _searchData.doLoad         = false;
    data                       = { doLoad: true};
  }

});

//==============================================================================
//          REGISTER EVENTS WITH DISPATCHER WHEN THEY ARE CALLED
//==============================================================================

searchStore.dispatchToken = AppDispatcher.register(function(payload) {
  var action = payload.action;
  switch(action.actionType) {

    case SearchConstants.DO_SEARCH:
      _doSearch(action.threads);
      break;

    case SearchConstants.APPEND_MORE:
      _appendMore(action.threads);
      break;

    case SearchConstants.SET_SPINNER:
      _setSpinner(action.spinner);
      break;

    case SearchConstants.SYNC_SEARCH:
      _syncData(action.data);
      break;

    default:
      return true;
  }

  searchStore.emitChange();

});

module.exports = searchStore;
