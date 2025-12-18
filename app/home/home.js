/***********************************************************
* Developer: Minhas Kamal (minhaskamal024@gmail.com)       *
* Website: https://github.com/MinhasKamal/DownGit          *
* License: MIT License                                     *
***********************************************************/

var homeModule = angular.module('homeModule', [
    'ngRoute',
    'downGitModule',
]);

homeModule.config([
    '$routeProvider',

    function ($routeProvider) {
        $routeProvider
            .when('/home', {
                templateUrl: 'app/home/home.html',
                controller: [
                '$scope',
                '$routeParams',
                '$location',
                'toastr',
                'downGitService',

                function($scope, $routeParams, $location, toastr, downGitService) {
                    $scope.downUrl = "";
                    $scope.url = "";
                    $scope.isProcessing = {val: false};
                    $scope.downloadedFiles = {val: 0};
                    $scope.totalFiles = {val: 0};

                    var templateUrl = "https?://github.com/.+/.+";
                    var downloadUrlInfix = "#/home?url=";
                    var currentDomain = window.location.protocol + "//" + window.location.host + window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/'));
                    var downloadUrlPrefix = currentDomain + "/" + downloadUrlInfix;

                    if ($routeParams.url) {
                        $scope.url = $routeParams.url;
                    }

                    if ($scope.url.match(templateUrl)) {
                        var parameter = {
                            url: $routeParams.url,
                            fileName: $routeParams.fileName,
                            rootDirectory: $routeParams.rootDirectory
                        };
                        var progress = {
                            isProcessing: $scope.isProcessing,
                            downloadedFiles: $scope.downloadedFiles,
                            totalFiles: $scope.totalFiles
                        };
                        downGitService.downloadZippedFiles(parameter, progress, toastr);

                    } else if ($scope.url != "") {
                        toastr.warning("Invalid URL!", {iconClass: 'toast-down'});
                    }

                    $scope.catchEnter = function(keyEvent) {
                        if (keyEvent.which == 13) {
                            $scope.download();
                        }
                    };

                    $scope.createDownLink = function() {
                        $scope.downUrl="";

                        if (!$scope.url) {
                            return;
                        }

                        if ($scope.url.match(templateUrl)) {
                            $scope.downUrl = downloadUrlPrefix + $scope.url;
                        } else {
                            toastr.warning("Invalid URL!", {iconClass: 'toast-down'});
                        }
                    };

                    $scope.download = function() {
                        window.location = downloadUrlInfix+$scope.url;
                    };

                    $scope.openCurrentDomain = function() {
                        window.location.href = window.location.protocol + "//" + window.location.host + window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/') + 1);
                    };

                }],
            });
    }
]);
