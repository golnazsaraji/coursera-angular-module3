(function () {
'use strict';

angular.module('NarrowItDownApp', [])
.controller('NarrowItDownController', NarrowItDownController)
.factory('NarrowItDownFactory', NarrowItDownFactory)
.directive('foundItems', foundItemsDirective)
.constant('ApiBasePath', "https://davids-restaurant.herokuapp.com");


function foundItemsDirective() {
  var ddo = {
    templateUrl: 'foundItems.html',
    scope: {
      items: '<',
      myTitle: '@title',
      badRemove: '=',
      onRemove: '&'
    },
    controller: foundItemsDirectiveController,
    controllerAs: 'list',
    bindToController: true
  };

  return ddo;
}


function foundItemsDirectiveController() {
  var list = this;

  // list.cookiesInList = function () {
  //   for (var i = 0; i < list.items.length; i++) {
  //     var name = list.items[i].name;
  //     if (name.toLowerCase().indexOf("cookie") !== -1) {
  //       return true;
  //     }
  //   }
  //
  //   return false;
  // };
}


NarrowItDownController.$inject = ['NarrowItDownFactory'];
function NarrowItDownController(NarrowItDownFactory) {
  var list = this;

  // Use factory to create new shopping list service
  var narrowItDownFactoryList = NarrowItDownFactory();

  list.items = narrowItDownFactoryList.getItems();
  var origTitle = "Narrow It Down List #1";
  //list.title = origTitle + " (" + list.items.length + " items )";

  list.searchTerm = "";


  list.getMatchedMenuItems = function () {
    narrowItDownFactoryList.getMatchedMenuItems(list.searchTerm);
    list.title = origTitle + " (" + list.items.length + " items )";
  };

  list.removeItem = function (itemIndex) {
    console.log("'this' is: ", this);
    this.lastRemoved = "Last item removed was " + this.items[itemIndex].name;
    shoppingList.removeItem(itemIndex);
    this.title = origTitle + " (" + list.items.length + " items )";
  };
}


NarrowItDownService.$inject = ['$http', 'ApiBasePath'];
function NarrowItDownService($http, ApiBasePath) {
  var service = this;

  // List of shopping items
  var foundItems = [];

  service.getMatchedMenuItems = function (searchTerm) {

    var response = $http({
      method: "GET",
      url: (ApiBasePath + "/menu_items.json")

    }).then(function (result) {

        alert(result);
      // process result and only keep items that match

      // Loop
      for (var i = 0; i < result.length; i++) {

        if(result[i].description.includes(searchTerm))
          foundItems.push(result[i]);
      }

      // return processed items
      return foundItems;
    });
  };

  service.removeItem = function (itemIndex) {
    foundItems.splice(itemIndex, 1);
  };

  service.getItems = function () {
    return foundItems;
  };
}



NarrowItDownFactory.$inject = ['$http', 'ApiBasePath'];
function NarrowItDownFactory($http, ApiBasePath) {
  var factory = function ($http, ApiBasePath) {
    return new NarrowItDownService($http, ApiBasePath);
  };

  return factory;
}

})();
