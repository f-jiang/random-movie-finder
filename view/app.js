(function() {
    var app = angular.module('whatMovie', []);

    // TODO refactor the controller
    app.controller('RandomMovieController', ['$http', function($http) {
        var ctrl = this;

        ctrl.result = {};
        ctrl.params = {};

        ctrl.years = [];
        var curYear = new Date().getFullYear();
        for (var i = curYear; i > 1899; i--) {
            ctrl.years.push(i);
        }

        ctrl.genres = [];
        $http({
            method: 'GET',
            url: '/genres'
        }).then(function(response) {
            ctrl.genres = response.data;
        });

        ctrl.languages = [];
        $http({
            method: 'GET',
            url: '/lang'
        }).then(function(response) {
            ctrl.languages = response.data;
        });

        ctrl.fetchMovie = function() {
            for (var p in ctrl.params) {
                if (ctrl.params[p] == null) {
                    delete ctrl.params[p];
                }
            }

            $http({
                method: 'GET',
                url: '/random-movie',
                params: ctrl.params
            }).then(function (response) {
                ctrl.result = response.data;
            });
        };

        ctrl.reset = function() {
            ctrl.result = {};
            ctrl.params = {};
        }
    }]);
})();
