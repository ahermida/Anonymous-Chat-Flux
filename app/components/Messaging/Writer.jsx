//==============================================================================
//                    MESSAGE INPUT FORM AND ACTIONS
//==============================================================================

var React = require('react');
var ReactDOM = require('react-dom');
var ChatActions = require('../../actions/ChatActions.js');
var Username = require('./Username.jsx');

module.exports = React.createClass({
  getInitialState: function() {
    return {
      message: ''
    }
  },

  scrollToBottom: function() {
      var height = Math.max( document.body.scrollHeight, document.body.offsetHeight,
                       document.documentElement.clientHeight, document.documentElement.scrollHeight,
                       document.documentElement.offsetHeight );
      function scrolly() {
        if (window.scrollY + window.innerHeight >= height) {
          return;
        }
        setTimeout(function() {
          var difference = document.body.offsetHeight - window.innerHeight - window.pageYOffset;
          var Break = document.body.offsetHeight / 10;
          window.scrollBy(0, Break);
          scrolly();
        }, 10);
      };
      scrolly();
  },

  onFocus: function(){
      this.placeholder=""
      this.scrollToBottom();
      ChatActions.readAll();
  },

  updateForm: function(value) {
    this.setState({ message: value });
  },
  onClick: function() {
    if (this.state.message && (this.state.message.trim() !== '')) {
      var date = new Date().getTime();
      var rv = {
        username: this.props.username,
        userID: this.props.userID,
        body: this.state.message,
        timestamp: date
      };
      ChatActions.sendMessage(rv);
      ChatActions.readAll();
      this.setState({ message: '' });
    }
  },
  onKeyUp: function(event) {
    event.preventDefault();
    if (event.keyCode === 13 && event.target.value &&
        ReactDOM.findDOMNode(this.refs.writer_button).offsetParent === null) {
      var date = new Date().getTime();
      var rv = {
        username: this.props.username,
        userID: this.props.userID,
        body: event.target.value,
        timestamp: date
      };
      ChatActions.sendMessage(rv);
      ChatActions.readAll();
      this.setState({ message: '' });
    }
  },

  getInputStyle: function() {
    if (this.props.readAll)
      return ({ backgroundColor: "white" });
    else
      return ({ backgroundColor: "#ffffba" });
  },
  getButtonStyle: function() {
    if (this.props.enterMode) {
      return ({display: 'none'});
    } else {
      return ({display: 'initial'});
    }
  },

  componentDidMount: function() {
    ReactDOM.findDOMNode(this.refs.writer_input).focus();
  },

  renderInput: function() {
    var valueLink = {
      value: this.state.message,
      requestChange: this.updateForm
    };
    if (this.props.enterMode) {
      return (
        <input type="text"
                className="writer_input"
                name="message"
                placeholder="Write a message..."
                id="writer_input"
                ref="writer_input"
                style={this.getInputStyle()}
                valueLink={valueLink}
                onFocus={this.onFocus}
                onKeyUp={this.onKeyUp}
                />
            );
    }
    else {
      return (
        <textarea type="text"
                className="writer_input"
                placeholder="Write a message..."
                name="message"
                id="writer_textarea"
                ref="writer_input"
                style={this.getInputStyle()}
                valueLink={valueLink}
                onFocus={this.onFocus}
                onKeyUp={this.onKeyUp}
                />
            );
    }
  },

  render: function() {
    return (
      <div className="writer">
        <Username stylo={this.props.users.indexOf(this.props.userID)}
                  username={this.props.username}
                  title="Enter to send"
                  isWriter={true}
                  />

      {         this.renderInput()        }

        <button   type="submit"
                  ref="writer_button"
                  style={this.getButtonStyle()}
                  className="writer_button"
                  onClick={this.onClick}>
                  send
        </button>

      </div>
    );
  }
});
