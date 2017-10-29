    
var myApp = angular.module('myApp',[]);

myApp.controller('myController', ['$scope', '$http', function($scope, $http) {
    $scope.search = {byStr : ''};
    $scope.arrData = null;
    $http({
        method: 'GET',
        url: 'https://athena-7.herokuapp.com/ancients.json'
    }).then(function successCallback(response) {
        console.log(JSON.stringify(response));
        $scope.arrData = response.data;
    }, function errorCallback(response) {
        alert("Error:"+JSON.stringify(response));
    });
    $scope.handleError = function() {
        $http({
            method: 'GET',
            url: 'https://athena-7.herokuapp.com/ancients.json',
            params: {error: true}
        }).then(function successCallback(response) {
            console.log(JSON.stringify(response));
        }, function errorCallback(response) {
            alert("handleError:"+response.data.error);
        });
    };
    $scope.searchAPI = function() {
        $http({
            method: 'GET',
            url: 'https://athena-7.herokuapp.com/ancients.json',
            params: {search: $scope.search.byStr}
        }).then(function successCallback(response) {
            alert("Response Data From API:"+JSON.stringify(response.data));
            response.data
        }, function errorCallback(response) {
            alert("searchAPI Error:"+JSON.stringify(response));
        });
    };
    $scope.$watch('search', function() {
        var check = false;
        if ($scope.search.byStr !== '') {
            var arr = $scope.arrData;
            for (var i=0; i<arr.length; i++) {
                for (var k in arr[i]) {
                    if (arr[i][k].indexOf($scope.search.byStr) > -1) {
                        check = true;
                        break;
                    }
                }
                if (check) break;
            }
            if (!check) $scope.handleError();
        }
    }, true);
}]);

myApp.filter('capitalize', function() {
    return function(input, all) {
        var reg = (all) ? /([^\W_]+[^\s-]*) */g : /([^\W_]+[^\s-]*)/;
        return (!!input) ? input.replace(reg, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();}) : '';
    }
});