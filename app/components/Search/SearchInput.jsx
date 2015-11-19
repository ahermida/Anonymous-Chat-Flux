//==============================================================================
//                    SEARCH INPUT FORM AND ACTIONS
//==============================================================================

var React         = require('react');
var SearchActions = require('../../actions/SearchActions.js');
var ReactRouter   = require('react-router');
var Link          = ReactRouter.Link;
var History       = ReactRouter.History;

module.exports    = React.createClass({

  mixins: [History],
  getInitialState: function() {
    return {
      searched: this.props.searched
    };
  },

  buildQuery: function (queryStringer) {
    //set up for tokenization with mongodb query
    var reggy = /\s/gi;
    return ('keywords=' + queryStringer.trim().replace(reggy, '+'));
  },

  updateForm: function(value) {
    this.setState({ searched: value });
  },

  onKeyUp: function(event) {
    if (event.keyCode === 13) {
      var newSearched = this.buildQuery(event.target.value);
      var queryParams = event.target.value.trim().toLowerCase().split(' ');
      SearchActions.doSearch({ topics: queryParams, page: 0 });
      this.history.pushState(null, `/s/${newSearched}`);
    }
  },

  onClick: function(event) {
      var newSearched = this.buildQuery(this.state.searched);
      var queryParams = this.state.searched.trim().toLowerCase().split(' ');
      SearchActions.doSearch({ topics: queryParams, page: 0 });
      this.history.pushState(null, `/s/${newSearched}`);
  },

  render: function() {

    var valueLink = {
      value: this.state.searched,
      requestChange: this.updateForm
    };
    var newSearched = this.buildQuery(this.state.searched);

    return (
      <span id="search_app">
             <span type="button"
                     id="search_app_button"
                     onClick={this.onClick}>
                     <span className="fa fa-fw fa-search">
                     </span>
             </span>
             <input  type="text"
                     id="search_app_input"
                     name="searched"
                     placeholder="Search Chats..."
                     valueLink={valueLink}
                     onKeyUp={this.onKeyUp} />
       </span>
    );
  }
});
