//==============================================================================
//                           SEARCH FROM CHAT COMPONENT
//==============================================================================

var React       = require('react');
var ReactRouter = require('react-router');
var History     = ReactRouter.History;
var Link        = ReactRouter.Link;


module.exports = React.createClass({

  mixins: [History],
  getInitialState: function() {
    return {
      searchLink: ''
    };
  },

  buildQuery: function (queryStringer) {
    //set up for tokenization with mongodb query
    var reggy = /\s/gi;
    return ('keywords=' + queryStringer.trim().replace(reggy, '+'));
  },

  updateForm: function(value) {
    this.setState({ searchLink: value });
  },

  onKeyUp: function(event) {
    if (event.keyCode === 13) {
      var searchQuery = this.buildQuery(this.state.searchLink);
      this.history.pushState(null, `/s/${searchQuery}`);
    }
  },

  render: function() {

    var valueLink = {
      value: this.state.searchLink,
      requestChange: this.updateForm
    };
    var searchQuery = this.buildQuery(this.state.searchLink);

    return (
      <span id="chat_search">
        <Link  to={`/s/${searchQuery}`}
               id="chat_search_button"
               title="Search">
          <span id="iconSearch" className="fa fa-search"></span>
          <span id="iconTop" className="fa fa-bars"></span>
        </Link>
        <span id="chat_search_input_area">
        <input type="text"
               id="chat_search_input"
               name="message"
               placeholder="Search Chat"
               valueLink={valueLink}
               onKeyUp={this.onKeyUp} />
        </span>
      </span>
    );
  }

});
