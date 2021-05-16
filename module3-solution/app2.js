(function () {
  'use strict';

angular.module('NarrowItDownApp', [])
.controller('NarrowItDownController', NarrowItDownController)
.service('MenuSearchService', MenuSearchService)
.constant('ApiBasePath', "https://davids-restaurant.herokuapp.com")
.directive('foundItems', foundItemsDirective);

function foundItemsDirective() {
  var ddo = {
    templateUrl: 'foundItems.html',
    scope: {
      items: '<',
      // myTitle: '@title',
      onRemove: '&'
    },
    controller: MenuItemsDirectiveController,
    controllerAs: 'list',
    bindToController: true
  };

  return ddo;
}

function MenuItemsDirectiveController() {
  var list = this;
}

NarrowItDownController.$inject = ['MenuSearchService'];
function NarrowItDownController(MenuSearchService) {

  var list = this;
  list.searchTerm = "";

  list.getMatchedMenuItems = function (searchTerm) {

       var promise = MenuSearchService.getMatchedMenuItems(searchTerm);

       promise.then(function (response) {
         return response.data;
       })
       .catch(function (error) {
         console.log(error);
       })
  };

  list.removeItem = function (itemIndex) {
    list.removeItem(itemIndex);
  };
}

MenuSearchService.$inject = ['$http', 'ApiBasePath'];
function MenuSearchService($http, ApiBasePath) {
  var service = this;

  service.getMatchedMenuItems = function (searchTerm) {

    var response = $http.get({
      method: "GET",
      url: (ApiBasePath + "/menu_items.json")
      // ,params: {
      //   description: description
      // }
    }).then(function (result) {

        console.log(result);
      // process result and only keep items that match
      var foundItems = [];
      // Loop
      for (var i = 0; i < result.length; i++) {

        if(result[i].description.includes(searchTerm))
          foundItems.push(result[i]);
      }

      // return processed items
      return foundItems;
    });

    return response;
  };

  service.removeItem = function (itemIndex) {
   items.splice(itemIndex, 1);
 };
}


})();
