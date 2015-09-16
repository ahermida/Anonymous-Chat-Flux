//==============================================================================
//                        SINGLE MESSAGE DISPLAY
//==============================================================================
var React = require('react');
var ThreadTimestamp = require('../Shared/ThreadTimestamp.jsx');
var Username = require('./Username.jsx');

module.exports = React.createClass({
  renderMessage: function() {
    return this.props.body.split('\n').map(function(line, i){
      if (line != '') {
        return (
          <span key={i}>
            {line}
            <br/>
          </span>
        );
      }
    });
  },
  render: function() {
    return (
      <span className="message">
        <Username stylo={this.props.stylo} isWriter={false} username={this.props.username} />
        <span className="message_content">
          <ThreadTimestamp timestamp={this.props.timestamp} />
          <span className="message_userID">ID: {this.props.userID}</span>
          <div className="message_body">{this.renderMessage()}</div>
        </span>
      </span>
    );
  }
});
