// Generated by CoffeeScript 1.8.0

/*
  Общая часть у дизайна index
  @author Vitaliy Kanev (1xamelion1@gmail.com)
  @version 0.0.0.1
 */

(function() {
  App.Controller.IndexMain = {
    centerView: function($scope, $state, testService, testValue, api) {
      $scope.photos_public = [];
      testService.title("Картинки котэ");
      $scope.view = function(index) {
        testValue.photos_id = index;
        return $state.go('index.View');
      };
      $scope.remove = function(index) {
        $scope.photos_public.splice(index, 1);
        return testValue.photos_public.splice(index, 1);
      };
      return api.get("http://api.flickr.com/services/feeds/photos_public.gne", {
        'tags': 'cat',
        'tagmode': 'any',
        'format': 'json',
        "jsoncallback": "JSON_CALLBACK"
      }, function(data, status) {
        testValue.photos_public = data.data.items;
        $scope.photos_public = testValue.photos_public;
        return console.log(data.data.items);
      });
    }
  };

}).call(this);

//# sourceMappingURL=index.main.js.map
