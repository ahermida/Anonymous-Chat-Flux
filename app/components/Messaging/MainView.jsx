//==============================================================================
//                        CLIENT THREAD COMPONENT
//==============================================================================

var React = require('react');
var Router = require('react-router');
var HomeTitle = require('../Shared/HomeTitle.jsx');
var ChatSearch = require('./ChatSearch.jsx');
var Messages = require('./Messages.jsx');
var Writer = require('./Writer.jsx');
var AddHandle = require('./AddHandle.jsx');
var AppStore = require('../../stores/appStore.js');
var socket = require('../../interfaces/socket.js');
var ChatActions = require('../../actions/ChatActions.js');
var isNode = (typeof process != 'undefined' && typeof process.versions != 'undefined' && typeof process.versions.node != 'undefined');
//==============================================================================
//                            UTILITIES
//==============================================================================

socket.on('newMessage', ChatActions.newMessage);
socket.on('newUser', ChatActions.newUser);
socket.on('userDisconnected', ChatActions.userDisconnected);
//trigger a reload if room is undefined, therefore creating a new room / loading it
function getThreadState() {
  if (!isNode){
    if (data.doLoad){
    return {
      _data: AppStore.getData()
      }
    } else {
    return {
      _data: data
    }
    }
  }
  else return {
    _data: AppStore.getData()
  }
}

//==============================================================================
//                           COMPONENT
//==============================================================================

module.exports = React.createClass({

  mixins: [ Router.State ],

  getInitialState: function() {
    return getThreadState();
  },
  //Load Initial Messages Via Ajax
  componentWillMount: function() {
    if (!isNode) {
      socket.emit('join room', this.getParams().thread);
      if (data.doLoad)
        ChatActions.loadMessages(this.getParams().thread);
      else {
        ChatActions.syncData(data);
      }
    }
  },
  componentDidMount: function() {
    AppStore.addChangeListener(this._onChange);
  },

  // Remove change listers from stores
  componentWillUnmount: function() {
    AppStore.resetStore();
    AppStore.removeChangeListener(this._onChange);
  },

  componentDidUpdate: function() {
    var height = Math.max( document.body.scrollHeight, document.body.offsetHeight,
                     document.documentElement.clientHeight, document.documentElement.scrollHeight,
                     document.documentElement.offsetHeight );
    if ((!React.findDOMNode(this.refs.add_handle).matches(":focus")) &&
      161 > (height - window.innerHeight - window.scrollY)) {
      window.scrollTo(0, document.body.scrollHeight);
    }
  },

  render: function() {
    return (
      <div className="main_view">
        <div className="header">
          <HomeTitle area="title_name_operational" />
          <span className="thread_name" title="Room Name" >{this.getParams().thread}</span>
          <AddHandle ref="add_handle" username={this.state._data.username} />
          <ChatSearch />
        </div>
        <Messages msg={this.state._data.messages}
                  users={this.state._data.users}/>
        <Writer userID={this.state._data.userID }
                readAll={this.state._data.readAll}
                username={this.state._data.username}
                thread={this.getParams().thread}
                users={this.state._data.users}
                enterMode={this.state._data.enterMode}
                ref="writer"
                />
      </div>
    );
  },

  _onChange: function() {
  this.setState(getThreadState());
  }

});
