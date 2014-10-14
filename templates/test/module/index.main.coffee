###
  Общая часть у дизайна index
  @author Vitaliy Kanev (1xamelion1@gmail.com)
  @version 0.0.0.1
###

App.Controller.IndexMain = centerView: ($scope,$state, testService, testValue,api) ->

  $scope.photos_public      =   [];                                                 # Массив изображений

  testService.title("Картинки котэ");

  $scope.view = ( index ) ->
    testValue.photos_id = index
    $state.go('index.View')

  $scope.remove =  ( index ) ->
    $scope.photos_public.splice(index,1)
    testValue.photos_public.splice(index,1)


  api.get "http://api.flickr.com/services/feeds/photos_public.gne",
    {'tags':'cat','tagmode':'any', 'format':'json',"jsoncallback":"JSON_CALLBACK"},
    ( data,status ) ->

      testValue.photos_public = data.data.items
      $scope.photos_public    = testValue.photos_public
      console.log data.data.items


