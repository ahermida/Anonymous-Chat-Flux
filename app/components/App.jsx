//==============================================================================
//                        LANDING PAGE APP
//==============================================================================

var React       = require('react');
var ReactRouter = require('react-router');
var History     = ReactRouter.History;
var Link        = ReactRouter.Link;
var HomeTitle   = require('./Shared/HomeTitle.jsx');
var isNode      = (typeof process != 'undefined' && typeof process.versions != 'undefined' && typeof process.versions.node != 'undefined');

module.exports = React.createClass({

  mixins: [History],
  getInitialState: function() {
    return {
      roomLink: ''
    };
  },

  buildQuery: function (queryStringer) {
    //set up for tokenization with mongodb query
    var reggy = /\s/gi;
    return ('keywords=' + queryStringer.trim().replace(reggy, '+'));
  },

  updateForm: function(value) {
    this.setState({ roomLink: value });
  },

  onClick: function() {
    if (!isNode) {
      location.reload();
    }
  },

  onKeyUp: function(event) {
    if (event.keyCode === 13 && event.target.value) {
      rv = '/c/' + event.target.value;
      this.history.pushState(null, `/c/${event.target.value}`);
    } else {
      if (event.keyCode === 13) {
        this.history.pushState(null, `/c/general`);
      }
    }
  },

  render: function() {

    var valueLink = {
      value: this.state.roomLink,
      requestChange: this.updateForm
    };
    var newLink = this.state.roomLink;
    var searchQuery = this.buildQuery(this.state.roomLink);
    if (!this.state.roomLink || this.state.roomLink == '')
      newLink = 'general';

    return (
      <div className="landing_page">
        <span onClick={this.onClick}>
          <HomeTitle area="title_name" />
        </span>
        <div className="room_input">
          <div>
            <input type="text"
               id="landing_input"
               name="message"
               placeholder="Find or create a chat room..."
               valueLink={valueLink}
               onKeyUp={this.onKeyUp} />
          </div>
          <div id="landing_button_block">
            <Link to={`/c/${newLink}`} className="landing_button">New Room</Link>
            <Link to={`/s/${searchQuery}`} className="landing_button">Find Topic</Link>
          </div>
         </div>
      </div>
    );
  }

});
