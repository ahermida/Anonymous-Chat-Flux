//==============================================================================
//                          APPEND MORE BUTTON (needs work)
//==============================================================================
var React = require('react');
var SearchActions = require('../../actions/SearchActions.js');

module.exports = React.createClass({

  handleClick: function() {
    SearchActions.appendMore(this.props.query);
  },

  renderUnclicked: function() {
    return (
        <button type="button" id="load_button" onClick={this.handleClick}></button>
    );
  },
  renderClicked: function() {
    return (
//placeholder for animation and spinner
        <span className="spinner" >LOADING</span>
    );
  },
  render: function() {
    return (
    <div id="append_more">
    {
      this.props.spinner ?
      this.renderClicked() :
      this.renderUnclicked()
    }
  </div>
  );
  }
});
