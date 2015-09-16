//==============================================================================
//                          HomeTitle Component
//==============================================================================
var React = require('react');
var ReactRouter = require('react-router');
var Navigation  = ReactRouter.Navigation;

module.exports = React.createClass({
  mixins: [Navigation],

  handleClick: function() {
    this.transitionTo('main');
  },

  render: function() {
    return (
      <h1 className={this.props.area} id={this.props.area} onClick={this.handleClick}>{"[a.name]"}</h1>
    );
  }
});
