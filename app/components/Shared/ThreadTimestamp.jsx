//==============================================================================
//                          MESSAGE SAMPLE DISPLAY
//==============================================================================
var React = require('react');

module.exports = React.createClass({

  formatTimestamp: function(timestamp) {
    //create & format timestampstring
    var ampm = '';
    var time = new Date(timestamp); // timestamp in minutes
    var hours = time.getHours();
    var minutes = time.getMinutes();
    var minutesString = (minutes < 10) ? '0' + minutes : '' + minutes;
    var hour = ((hours % 12) == 0) ? 12 : hours % 12;
    (hours <= 12) ? ampm = 'AM' : ampm = 'PM';

    return hour + ':' + minutesString + ampm;
  },

  render: function() {
    return (
      <span className="timestamp">
        { this.formatTimestamp(this.props.timestamp) }
      </span>
    );
  }
});
