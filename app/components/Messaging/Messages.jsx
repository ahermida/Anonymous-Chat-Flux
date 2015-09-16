//==============================================================================
//                          MESSAGES DISPLAY
//==============================================================================
var React = require('react/addons');
var Message = require('./Message.jsx');
var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

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
        <ReactCSSTransitionGroup transitionLeave={false} transitionName="message_group">
        {
            this.renderMessages()
        }
        </ReactCSSTransitionGroup>
      </div>
    );
  }
});
