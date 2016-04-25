/* 
  Connects to mongo and query data
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
      function do_query(db, done) {
          delete ctx.data.MONGO_URL;
          var cursor = db
                        .collection('users')
                        .find( ctx.data );

          var result = [];

          cursor.each(function(err, doc) {
              if (doc != null) {
                delete doc._id;
                result.push(doc);
              } else {
                done(null, JSON.stringify(result));
              }
          });

      }
    ], cb);
    
};