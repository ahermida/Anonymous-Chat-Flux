//==============================================================================
//                          MESSAGE SAMPLE DISPLAY
//==============================================================================
var React = require('react');

module.exports = React.createClass({

  lastSlice: function(array) {
    if (array.length < 6) {
      return array;
    } else {
      return array.slice(-5);
    }
  },

  renderMessages: function() {
    return this.lastSlice(this.props.messages).map(function(message, i) {
      return (
        <div className="search_message" key={i}>
          <span className="search_message_username">{message.username}</span>
          <span className="search_message_body">: {message.body}</span>
        </div>
      );
    });
  },

  render: function() {
    return (
      <div className="sample">
        {
            this.renderMessages()
        }
      </div>
    );
  }
});
