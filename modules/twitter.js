var Twitter = require('twitter');
 
var client = new Twitter({
  consumer_key: '04aMRyOeTCcyOryBVfSCMrx8Q',
  consumer_secret: 'YyeGoNXMeNZimFqM5tXTgEVrRXr97a6pQpJ7eHJG4VVY1ngdmC',
  access_token_key: '949819732550701056-FNIMPIFSvMk6P6XVPNIgdP2s8Nt9Fpj',
  access_token_secret: '5A3IKkmDJhAHwBWJAnH10DsfzKjpw3e9zp6Otgv8LM3Q9'
});

var checkTw = function (params, cb){
    client.get('search/tweets', params, function(err, tweets, response) {
		if (!err) {
            var res = [];
            for(var i=0; i<tweets.statuses.length; i++){
                (function(i){
                    var tw = tweets.statuses[i];
                    var url = (tw.entities.urls.length > 1) ? tw.entities.urls[0].url : "";
                    if (typeof(tw.retweeted_status) !== 'undefined'){
                        tw.retweeted_status.entities.urls.length > 1
                        url = (tw.retweeted_status.entities.urls.length) ? tw.retweeted_status.entities.urls[0].url : url;
                    }
                    res.push({
                        id:tw.id,
                        name:tw.user.name,
                        screen_name:tw.user.screen_name,
                        url:url,
                        text:tw.text
                    });
                })(i);
            }
            cb(res);
		} else {
			cb([]);
        }
	});
};

module.exports = {
    myTweet : function (git, cb) {
		var res = [];
		if(git.length === 0) {
			cb(git);
		}
        var i2 = 0;
		for (var i=0; i<git.length; i++){
            (function(i){
                var github = git[i];
                var params = {q: github.name};
                checkTw(params, function(tweets){
                    github.tweets = tweets;
                    res.push(github);
                    i2++;
                    if (i2==git.length){
                        cb(res);
                    }
                });
            })(i);
		}
    }
};