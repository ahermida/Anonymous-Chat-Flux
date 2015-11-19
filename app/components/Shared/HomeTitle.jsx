//==============================================================================
//                          HomeTitle Component
//==============================================================================
var React       = require('react');
var ReactRouter = require('react-router');
var History     = ReactRouter.History;

module.exports = React.createClass({
  mixins: [History],

  handleClick: function() {
    this.history.pushState(null, '/');
  },

  render: function() {
    return (
      <h1 className={this.props.area} id={this.props.area} onClick={this.handleClick}>{"[chat]"}</h1>
    );
  }
});
