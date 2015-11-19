//==============================================================================
//                         ADD HANDLE INPUT
//==============================================================================
var React    = require('react');
var ReactDOM = require('react-dom');
var ChatActions = require('../../actions/ChatActions.js');

module.exports = React.createClass({

  getInitialState: function() {
    return {
      username: 'Anonymous'
    };
  },

  keyPress: function(event) {
    var value = event.target.value.trim();
    this.setState({
      username: value
    });
    if (value.length > 1 && value.length < 30) {
     ChatActions.addHandle(value);
    }
    if (event.keyCode === 13) {
      ReactDOM.findDOMNode(this).blur();
    }
  },

  render: function() {
    return (
      <input type="text"
             title="Add a name"
             ref="add_handle"
             name="username"
             className="add_handle"
             placeholder="Anonymous"
             onKeyUp={this.keyPress} />
  );
  }

});
