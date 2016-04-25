/* 
  Connects to mongo and delete data
*/

var MongoClient = require('mongodb').MongoClient;
var waterfall   = require('async').waterfall;

module.exports = function(ctx, cb) {

    var MONGO_URL = ctx.data.MONGO_URL;
    if (!MONGO_URL) return cb(new Error('MONGO_URL secret is missing'))
    
    waterfall([
        function connect_to_db(done) {
            MongoClient.connect(MONGO_URL, function(err, db) {
                if(err) return done(err);

                done(null, db);
            });
      },
      function do_delete(db, done) {
          delete ctx.data.MONGO_URL;
          db
              .collection('users')
              .deleteMany(ctx.data, function (err, results) {
                  if(err) return done(err);

                  done(null, 'succesful');
              });
      }
    ], cb);
    
};