//==============================================================================
//                        CLIENT SEARCH COMPONENT
//==============================================================================

var React         = require('react');
var Router        = require('react-router');
var SearchInput   = require('./SearchInput.jsx');
var HomeTitle     = require('../Shared/HomeTitle.jsx');
var SearchResults = require('./SearchResults.jsx');
var searchStore   = require('../../stores/searchStore.js');
var AppDispatcher = require('../../dispatchers/AppDispatcher.js');
var SearchActions = require('../../actions/SearchActions.js');
var LoadMore      = require('./LoadMore.jsx');
var isNode        = (typeof process != 'undefined' && typeof process.versions != 'undefined' && typeof process.versions.node != 'undefined');
//==============================================================================
//                            UTILITIES
//==============================================================================

function getThreadState() {
  if (!isNode){
    if (data.doLoad){
    return {
      searchData : searchStore.getData()
      }
    } else {
    return {
      searchData: data
    }
    }
  }
  else return {
    searchData : searchStore.getData()
    }
}

//==============================================================================
//                           COMPONENT
//==============================================================================

module.exports = React.createClass({

  mixins: [ Router.State ],

  getInitialState: function() {
    return getThreadState();
  },

  //Load Initial Messages Via Ajax
  componentWillMount: function() {
    var queryParams = this.getParams().query.substr(9).toLowerCase().split('+');
    if (!isNode) {
      if(data.doLoad)
        SearchActions.doSearch({ topics: queryParams, page: this.state.searchData.page});
      else {
        SearchActions.syncData(data);
      }
    }
  },

  // Add change listeners to stores
  componentDidMount: function() {
    searchStore.addChangeListener(this._onChange);
  },

  // Remove change listers from stores
  componentWillUnmount: function() {
    searchStore.resetStore();
    searchStore.removeChangeListener(this._onChange);
  },

  decodedQuery: function() {
    return this.getParams().query.substr(9).split('+');
  },

  naturalQuery: function() {
    var reggy = /\+/gi;
    return this.getParams().query.substr(9).replace(reggy, ' ');
  },

  showLoadButton: function() {
    var queryParams = this.getParams().query.substr(9).toLowerCase().split('+');
    if (this.state.searchData.results.length >= (this.state.searchData.page + 1) * 15) {
      return (
        <LoadMore query={{ topics: queryParams, page: this.state.searchData.page + 1}}
                  spinner={this.state.searchData.spinner} />
      );
    }
  },

  render: function() {
    var queryParams = this.naturalQuery();
    return (
      <div className="search_view">
        <div className="header">
          <HomeTitle area="title_name_operational" />
          <span id="search_title">Search</span>
          <SearchInput searched={queryParams} />
        </div>
        <SearchResults threads={this.state.searchData.results} />
        { this.showLoadButton() }
      </div>
    );
  },

  _onChange: function() {
  this.setState(getThreadState());
  }

});
