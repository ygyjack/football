var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var request = require('request');

module.exports = {
    myGit : function (cb) {
        var options = {
            method: 'GET',
            url: 'https://api.github.com/search/repositories?q=topic:football',
            headers: {
                'User-Agent': 'request'
            }
        };	
        request(options, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                var data = JSON.parse(body);
                var resData = [];
                if(data.items.length === 0){
                    cb({err:null, data:resData});
                }
                for (var i=0; i<data.items.length; i++){
                    var git = data.items[i];
                    resData.push({
                        "name":git.name,
                        "owner":git.owner.login,
                        "avatar":git.owner.avatar_url,
                        "url":git.owner.html_url,
                        "description":git.description,
                        "language":git.language,
                        "tweets":[]
                    });
                    if (i==99 || i==(data.items.length-1)){
                        cb({err:null, data:resData});
                    }
                }
            } else if(!error && response.statusCode != 200){
                cb({err:response.statusCode, data:null});
            } else {
                cb({err:-1000, data:null});
            }
        });
    }
};