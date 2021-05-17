(function () {
'use strict';

angular.module("NarrowItDownApp", [])
.controller("NarrowItDownController", NarrowItDownController)
.service("MenuSearchService", MenuSearchService)
.directive("foundItems", FoundItemsDirective)
.constant("ApiBasePath", "https://davids-restaurant.herokuapp.com");

NarrowItDownController.$inject = ['MenuSearchService'];
function NarrowItDownController(MenuSearchService) {
  var list = this;
  list.searchTerm = "";
  list.found =[];

  list.getMatchedMenuItems = function () {

    if( list.searchTerm && list.searchTerm.length > 0 ) {

        var promise = MenuSearchService.getMatchedMenuItems(list.searchTerm);

        promise.then(function (response) {
          list.found  =  response;
          if( list.found.length == 0 )
          {
            list.title = "Nothing Found!";
          }
        })
        .catch(function (error) {
          console.log(error);
        })
    }
    else
    {
      list.title = "Nothing Found!";
    }
  };

  list.onRemove = function (index) {
    list.found.splice(index, 1);
  };
}


MenuSearchService.$inject = ['$http', 'ApiBasePath'];
function MenuSearchService($http, ApiBasePath) {
  var service = this;

  // List of shopping items
  var foundItems = [];

  service.getMatchedMenuItems = function (searchTerm) {

    return $http({
      method: "GET",
      url: (ApiBasePath + "/menu_items.json")

    }).then(function (result) {

      // Loop
      for (var i = 0; i < result.data.menu_items.length; i++) {
        if(result.data.menu_items[i].description.toUpperCase().indexOf(searchTerm.toUpperCase()) > 0)
        {
          foundItems.push(result.data.menu_items[i]);
        }
      }
      // return processed items
      return foundItems;
    });
  };

  // service.removeItem = function (itemIndex) {
  //   foundItems.splice(itemIndex, 1);
  // };
}

function FoundItemsDirective() {
  var ddo = {
    templateUrl: "loader/foundItems.html",
    scope: {
      items: '<',
      title: '@title',
      onRemove: '&'
    },
  };
  return ddo;
}


})();
