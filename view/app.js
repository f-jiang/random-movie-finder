(function() {
    var app = angular.module('randomMovieFinder', ['ngRoute']);

    app.value('params', {});

    app.config(['$routeProvider', function($routeProvider) {
        $routeProvider
        .when('/', {
            templateUrl: 'partials/movieForm.html',
            controller: 'FormController',
            resolve: {
                years: function() {
                    var ar = [];
                    var curYear = new Date().getFullYear();

                    for (var i = curYear; i > 1899; i--) {
                        ar.push(i);
                    }

                    return ar;
                },
                genres: function($http) {
                    return $http.get('/genres').then(function(response) {
                        return response.data;
                    });
                },
                languages: function($http) {
                    return $http.get('/lang').then(function(response) {
                        return response.data;
                    });
                }
            }
        })
        .when('/result', {
            templateUrl: 'partials/movieResult.html',
            controller: 'MovieController',
            resolve: {
                movie: function($http, params) {
                    return $http.get(
                        '/random-movie',
                        {params: params}
                    ).then(function(response) {
                        return response.data;
                    });
                }
            }
        })
        .otherwise({redirectTo: '/'});
    }]);

    app.controller('FormController',
        function($scope, $location, years, genres, languages, params) {
            $scope.years = years;
            $scope.genres = genres;
            $scope.languages = languages;
            $scope.params = params;

            $scope.getMovie = function() {
                for (var p in $scope.params) {
                    if ($scope.params[p] == null) {
                        delete $scope.params[p];
                    }
                }

                $location.path('/result');
            };
        }
    );

    app.controller('MovieController',
        function($scope, $location, movie, params) {
            $scope.movie = movie;
            $scope.reset = function() {
                for (var p in params) {
                    params[p] = null;
                }

                $location.path('/');
            };
        }
    );
})();
