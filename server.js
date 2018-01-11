var http = require('http');
var gh = require('./modules/github.js');
var tw = require('./modules/twitter.js');

/*
 * SETUP HTTP BIND TO PORT 8080
 **/
http.createServer(function (req, resCS) {
	if (req.url !== '/favicon.ico') {
        resCS.writeHead(200, {'Content-Type': 'text/html'});
		/*
		 * GET GITHUB PROJECTS
		 **/
        var git = gh.myGit(function(res){
            if (res.err) {
                resCS.write("Error Code: " + res.err);
            } else {
				/*
				 * GET TWEETS MANTION GITHUB PROJECTS
				 **/
                var tweets = tw.myTweet(res.data, function(result){
					/*
					 * PRINT OUT RESULTS
					 **/
                    resCS.write("<table>");
                    for (var i=0; i<result.length; i++) {
                        resCS.write("<tr><td colspan=2><h1>GitHub Project "+(i+1)+"</h1></td><tr>");
                        resCS.write("<tr>");
                        resCS.write("<td><img src='"+result[i].avatar+"' height='100'></td>");
                        resCS.write("<td><b>Project Name:</b> "+result[i].name+"<br>");
                        resCS.write("<b>Auther:</b> "+result[i].owner+"<br>");
                        resCS.write("<b>Language:</b> "+result[i].language+"<br>");
                        resCS.write("<b>Description:</b> "+result[i].description+"<br>");
                        resCS.write("<b>Website:</b> <a href='"+result[i].url+"' target='_blank'>"+result[i].url+"</a></td>");
                        resCS.write("</tr>");
                        for (var i2=0; i2<result[i].tweets.length; i2++) {
                            resCS.write("<tr><td colspan=2><h3>Tweet "+(i2+1)+"</h3></td></tr>");
                            resCS.write("<tr>");
                            resCS.write("<td colspan=2>");
                            resCS.write("<b>Tweet Name:</b> "+result[i].tweets[i2].name+"<br>");
                            resCS.write("<b>Display Name:</b> "+result[i].tweets[i2].screen_name+"<br>");
                            resCS.write("<b>ID:</b> "+result[i].tweets[i2].id+"<br>");
                            resCS.write("<b>Text:</b> "+result[i].tweets[i2].text+"<br>");
                            if (result[i].tweets[i2].url != "") {
                                resCS.write("<b>Website:</b> <a href='"+result[i].tweets[i2].url+"' target='_blank'>"+result[i].tweets[i2].url+"</a><br>");
                            }
                            resCS.write("</td>");
                            resCS.write("</tr>");
                        }
                    }
                    resCS.write("</table>");
                    resCS.end();
                });
            }
        });
    }

}).listen(8080);

