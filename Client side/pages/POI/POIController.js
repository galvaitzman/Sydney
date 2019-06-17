
angular.module("myApp").service('POIServices',[ '$http','$rootScope', function ($http,$rootScope) {

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


    this.getAllSavedPoints = function () {
        var req = {
            method: 'GET',
            url: 'http://localhost:3000/POI/getAllSavedPoints',
            headers: {
                'Access-Control-Allow-Origin' : '*',
                'Access-Control-Allow-Methods' :"GET, POST, PUT, DELETE, OPTIONS",
                'Access-Control-Allow-Headers' : '*',
                'Access-Control-Max-Age' : '*',
                'Content-Type': 'application/json'
            },
            params: {token:$rootScope.currentToken}
        };
        return $http(req);
    }


    this.removeFavoritePoint = function (poiID) {
        var req = {
            method: 'DELETE',
            url: 'http://localhost:3000/POI/removeFavoritePoint',
            headers: {
                'Access-Control-Allow-Origin' : '*',
                'Access-Control-Allow-Methods' :"GET, POST, PUT, DELETE, OPTIONS",
                'Access-Control-Allow-Headers' : '*',
                'Access-Control-Max-Age' : '*',
                'Content-Type': 'application/json'
            },
            params: {token:$rootScope.currentToken},
            data: {POI_ID:poiID}
        };
        return $http(req);
    }
// token
    //POI_ID
}])

    .controller('POIController', function ($scope,$http,POIServices,$rootScope){
        var self = this;
        $scope.allcategories=[];
        $scope.poisToShow=[];
        $scope.poisToShowAfterOrder=[];
        $scope.allSavedPoints=[];


        // todo : to change it to boolean is guest
        if($rootScope.currentUser!="Guest") {
            POIServices.getAllSavedPoints().then(function (response) {
                $scope.allSavedPoints = response.data;

            }, function (response) {
                //TODO: change the alert to informative message
                alert("Get All Saved Points Failed");
            });
        }


        $scope.myFunction = function(i) {
            var favoriteClass = document.getElementById(i.POI_ID);
            //if full star -> empty
            if(favoriteClass.src == "http://icons.iconarchive.com/icons/custom-icon-design/flatastic-2/256/star-full-icon.png") {
                POIServices.removeFavoritePoint(i.POI_ID).then(function (response) {
                    favoriteClass.setAttribute("src", "https://png.pngtree.com/svg/20170330/6a1d534b9d.svg");
                }, function (response) {
                    //todo:remove alert more informative
                    alert( "failed to delete favorite");
                });
                return;
            }
            //if green star -> empty
            else if(favoriteClass.src == "https://png.pngtree.com/svg/20161202/e7f5a90a9e.svg")
            {
                deleteFromLocalStorage(i);
                favoriteClass.setAttribute("src", "https://png.pngtree.com/svg/20170330/6a1d534b9d.svg");
                return;
            }
            // if empty star -> green
            else {
                addToLocalStorage(i);
                $rootScope.favCounter=$rootScope.favCounter+1;
                favoriteClass.setAttribute("src", "https://png.pngtree.com/svg/20161202/e7f5a90a9e.svg");
            }
            };

        function deleteFromLocalStorage (i){

            var existingFavList = JSON.parse(localStorage.getItem("favoriteList"));
            if(existingFavList == null) existingFavList = [];
            var j=0;
            var tmpArray=[];
            for(j=0;j<existingFavList.length;j=j+1)
            {
                if(i.POI_ID!=existingFavList[j].POI_ID) {
                   tmpArray.push(existingFavList[j]);
                }

            }
            $rootScope.favCounter=$rootScope.favCounter-1;
            localStorage.setItem("favoriteList", JSON.stringify(tmpArray));
            console.log(localStorage.getItem("favoriteList"));

        }

        function addToLocalStorage (i){
            var existingFavList = JSON.parse(localStorage.getItem("favoriteList"));
            if(existingFavList == null) existingFavList = [];
            //localStorage.setItem("entry", JSON.stringify(i));
            // Save favoriteList back to local storage
            existingFavList.push(i);
            localStorage.setItem("favoriteList", JSON.stringify(existingFavList));
            console.log(localStorage.getItem("favoriteList"));
        }

        $scope.initFuncToFillStarButton = function (i){
            var j;
            for(j=0;j<$scope.allSavedPoints.length; j = j +1)
            {
                // is favorite from db
                if(i.POI_ID == $scope.allSavedPoints[j].POI_ID)
                    //https://png.pngtree.com/svg/20161202/e7f5a90a9e.svg
                    return "http://icons.iconarchive.com/icons/custom-icon-design/flatastic-2/256/star-full-icon.png";
            }
            var existingFavList = JSON.parse(localStorage.getItem("favoriteList"));
            if(existingFavList == null)
                return "https://png.pngtree.com/svg/20170330/6a1d534b9d.svg";
            var x=0;
            for(x=0;x<existingFavList.length;x=x+1)
            {
                // in the wish list
                if(i.POI_ID==existingFavList[x].POI_ID) {
                    //TODO: make sure that the imacge of favorite not visible to guest - to do it in the html with ng-show
                    return "https://png.pngtree.com/svg/20161202/e7f5a90a9e.svg";
                }

            }
            return "https://png.pngtree.com/svg/20170330/6a1d534b9d.svg";
        }

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
/*
        var favoriteClass = document.getElementById(43);
        if(favoriteClass.src == "http://icons.iconarchive.com/icons/custom-icon-design/flatastic-2/256/star-full-icon.png")
            favoriteClass.setAttribute("src","https://png.pngtree.com/svg/20170330/6a1d534b9d.svg");
        else favoriteClass.setAttribute("src","http://icons.iconarchive.com/icons/custom-icon-design/flatastic-2/256/star-full-icon.png");
    }
*/

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

    });

