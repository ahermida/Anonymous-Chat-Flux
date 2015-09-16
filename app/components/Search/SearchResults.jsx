//==============================================================================
//                         SEARCH RESULTS DISPLAY
//==============================================================================
var React           = require('react');
var ThreadTimestamp = require('../Shared/ThreadTimestamp.jsx');
var ThreadSample    = require('./ThreadSample.jsx');
var Link            = ReactRouter.Link;

function resultsNotEmpty(threads) {
  var thread;
  for(var i = 0; i < threads.length; i++) {
    thread = threads[i];
    if (thread.messages.length > 0) {
      return true;
    }
  }
  return false;
}
module.exports = React.createClass({

  renderThreads: function() {
      return this.props.threads.map(function(thread, i) {
        if (thread.messages.length > 0 && thread.room.length <= 12) {
          return (
            <div className="thread" key={i}>
              <Link to="chat" params={{thread: thread.room}}>thread.room</Link>
              <ThreadTimestamp timestamp={thread.createdAt}/>
              <ThreadSample messages={thread.messages}/>
            </div>
          );
        }
      });
  },
  threadsNotFound: function() {
    return (
      <div id="no_found">
        <span id="no_found_note">
          No results could be found
        </span>
      </div>
    );
  },
  render: function() {
    return (
      <div className="threads">
        {
          (this.renderThreads().length > 0) ? this.renderThreads() :
                                              this.threadsNotFound()
        }
      </div>
    );
  }

});
