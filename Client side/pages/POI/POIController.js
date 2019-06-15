
angular.module("myApp").service('POIServices',[ '$http', function ($http) {

    this.getAllPoints
        = function () {
        var req = {
            method: 'GET',
            url: 'http://localhost:3000/POI/getAllPoints',
            headers: {
                'Access-Control-Allow-Origin' : '*',
                'Access-Control-Allow-Methods' :"GET, POST, PUT, DELETE, OPTIONS",
                'Access-Control-Allow-Headers' : '*',
                'Access-Control-Max-Age' : '*',
                'Content-Type': 'application/json'
            }
        };
        return $http(req);

    }


    this.getAllCategories
        = function () {
        var req = {
            method: 'GET',
            url: 'http://localhost:3000/POI/getAllCategories',
            headers: {
                'Access-Control-Allow-Origin' : '*',
                'Access-Control-Allow-Methods' :"GET, POST, PUT, DELETE, OPTIONS",
                'Access-Control-Allow-Headers' : '*',
                'Access-Control-Max-Age' : '*',
                'Content-Type': 'application/json'
            }
        };
        return $http(req);

    }


    this.filterByCategory
        = function (categoryToPass) {
        var req = {
            method: 'GET',
            url: 'http://localhost:3000/POI/Category',
            headers: {
                'Access-Control-Allow-Origin' : '*',
                'Access-Control-Allow-Methods' :"GET, POST, PUT, DELETE, OPTIONS",
                'Access-Control-Allow-Headers' : '*',
                'Access-Control-Max-Age' : '*',
                'Content-Type': 'application/json'
            },
            params:categoryToPass
        };
        return $http(req);

    }
}])

    .controller('POIController', function ($scope,$http,POIServices){
        var self = this;
        $scope.allcategories=[];
        $scope.poisToShow=[];
        $scope.poisToShowAfterOrder=[];

        function initPoints() {
            POIServices.getAllPoints().then(function (response) {
                $scope.allPois = response.data.poi;
                $scope.poisToShow = $scope.allPois;
                $scope.poisToCategory();
            }, function (response) {
                //TODO:Chnage all the alert in this controller
                alert("Get all POIS failed");
            });
        }

        POIServices.getAllCategories().then(function (response) {
            $scope.allcategories = response.data;
            $scope.allcategories.poi.push({"CATEGORY":"Sort by Rank"});
            $scope.allcategories.poi.push({"CATEGORY":"Show all"});
            initPoints();
        }, function (response) {
            alert("Get all categories failed");
        });



        $scope.filterByCategory = function (){
            var catToPass=self.categoryToFilter;
            document.getElementById('wordToSearch').value = "";

            if (catToPass == "" || catToPass == "Show all") {
                $scope.poisToShow=$scope.allPois;
                $scope.poisToCategory();
                return;
            }
            if (catToPass == "Sort by Rank") {
                $scope.poisToShow=$scope.allPois;
                $scope.poisToRank();
                return;
            }
            var categoryToPass = {CATEGORY:catToPass};
            POIServices.filterByCategory(categoryToPass).then(function (response) {
                $scope.poisToShow=response.data;
                $scope.poisToCategory();
            }, function (response) {
                alert( "failed to filter by category");
            });
        };

        $scope.poisToCategory=function(){
            var i;
            $scope.poisToShowAfterOrder = [];
            var temp = [];

            for (i = 0; i < $scope.poisToShow.length; i++)
            {
                var catOfPOI = $scope.poisToShow[i].CATEGORY.split(' ').join('');
                if(!angular.isDefined(temp[catOfPOI])) {
                    temp[catOfPOI] = [];
                }
                temp[catOfPOI].push($scope.poisToShow[i]);
            }

            for (i = 0; i < $scope.allcategories.poi.length; i++) {
                var key = $scope.allcategories.poi[i].CATEGORY.split(' ').join('');
                if(angular.isDefined(temp[key])) {
                    $scope.poisToShowAfterOrder.push(
                        {
                            name : $scope.allcategories.poi[i].CATEGORY,
                            elements : temp[key]
                        }
                    );
                }
            }
        };


        $scope.poisToRank=function(){
            var i;
            $scope.poisToShowAfterOrder = [];
            var temp = [];
            var rankArray=[];

            for (i = 0; i < $scope.poisToShow.length; i++)
            {
                var rankOfPOI = $scope.poisToShow[i].RANK;
                if(!angular.isDefined(temp[rankOfPOI])) {
                    temp[rankOfPOI] = [];
                }
                temp[rankOfPOI].push($scope.poisToShow[i]);
                if(!rankArray.includes(rankOfPOI))
                    rankArray.push(rankOfPOI);
            }

            for (i = 0; i < rankArray.length; i++) {
                var key = rankArray[i];
                if(angular.isDefined(temp[key])) {
                    $scope.poisToShowAfterOrder.push(
                        {
                            name : key,
                            elements : temp[key]
                        }
                    );
                }
            }
        };

        this.Search = function() {
            //TODO:change the option to be empty or show all
           var tmp =$scope.allPois;
            $scope.poisToShow=[];
           var i ;
           for (i=0;i<tmp.length;i=i+1)
           {
               if((tmp[i].NAME).includes(self.wordToSearch))
                   $scope.poisToShow.push(tmp[i]);
           }
            document.getElementById('categoryToFilter').value = "";

            $scope.poisToCategory();
        };

        $scope.myFunction=function (x) {
            x.classList.toggle("icon-heart-empty");
        }

    });

