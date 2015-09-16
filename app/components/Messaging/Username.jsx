//==============================================================================
//                           USERNAME DISPLAY
//==============================================================================
var React = require('react');
var ChatActions = require('../../actions/ChatActions.js');

module.exports = React.createClass({
  getTag: function() {
    if (this.props.isWriter)
        return 'writer_tag';
    else
        return 'message_tag';
  },
  handleClick: function() {
    if (this.props.isWriter)
        ChatActions.changeEnterMode();
  },
  render: function() {
    return (
    <span className={"message_username background_" + this.props.stylo + " " + this.getTag()}
          onClick={this.handleClick}
          title={this.props.username}>
        {
          this.props.username.substr(0, 4)
        }
    </span>
  );
  }
});
