//==============================================================================
//                          BASIC SETUP
//==============================================================================
var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

//==============================================================================
//                       CREATE MESSAGE MODEL
//==============================================================================

var MessageSchema = new Schema({
      username: String,
          body: String,
     timestamp: Date,
        userID: String
});

//==============================================================================
//                       CREATE THREAD MODEL
//==============================================================================

var RoomSchema = new Schema({
          room: String,
      messages: [MessageSchema],
     createdAt: { type: Date, default: Date.now, expires: '1h' },
        topics: [String]
});

module.exports = mongoose.model('Thread', RoomSchema);
