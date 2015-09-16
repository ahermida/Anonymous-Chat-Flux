//==============================================================================
//                    BASIC SETUP FOR API ROUTES
//==============================================================================

var Thread           = require('../models/thread.js'); // to fill out user model

//==============================================================================
//                      ADD EVERYTHING TO EXPORTS
//==============================================================================

module.exports = function(app, express) {

//==============================================================================
//                       FIND OR CREATE THREAD
//==============================================================================
  var apiRouter = express.Router();
  apiRouter.get('/c/:thread', function(req, res) {

    // find the thread
    Thread.findOne({
      room: req.params.thread
    }).select('room messages').exec(function(err, thread) {

      if (err) throw err;

      // no thread with that username was found
      if (!thread) {
        var newThread = new Thread();
        newThread.room = req.params.thread;
        newThread.topics = req.params.thread.toLowerCase().split(' ');
        newThread.save(function(err) {
          if (err) {
          res.send(err);
          }
        });
        res.json({
          messages: []
        });
      } else if (thread) {
        res.json({
          messages: thread.messages
          });
      }

    });
  });

//==============================================================================
//                             SEARCH CHATS
//==============================================================================

  apiRouter.post('/s', function(req, res) {
    var queryParam = { topics: { $in: req.body.topics}};
    if (req.body.topics == "" || req.body.topics == undefined)
      queryParam = {};
    Thread.find(queryParam).
      limit(15)
      .skip(req.body.page * 15)
      .select('messages room createdAt')
      .exec(function(err, results) {
        if (err) throw err;
        // no thread with that username was found
        if (!results) {
          res.json({
            results: []
          });
        } else if (results) {
          res.json({
            results: results
            });
        }
      });
  });

  return apiRouter;
};
