//==============================================================================
//                          MESSAGES DISPLAY
//==============================================================================
var React = require('react');
var Message = require('./Message.jsx');
var ReactCSSTransitionGroup = require('react-addons-css-transition-group');

module.exports = React.createClass({

  renderMessages: function() {
    var userList = this.props.users || [];
    return this.props.msg.map(function(message, i) {
      return (
          <Message userID={message.userID}
                   username={message.username}
                   body={message.body}
                   stylo={userList.indexOf(message.userID) % 20}
                   timestamp={message.timestamp}
                   key={i}
                   />
      );
    });
  },
  render: function() {
    return (
      <div className="messages">
        <ReactCSSTransitionGroup  transitionEnterTimeout={500} transitionLeaveTimeout={300} transitionName="message_group">
        {
            this.renderMessages()
        }
        </ReactCSSTransitionGroup>
      </div>
    );
  }
});
