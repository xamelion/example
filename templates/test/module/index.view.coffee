###
  Подробности фотографии
  @author Vitaliy Kanev (1xamelion1@gmail.com)
  @version 0.0.0.1
###

App.Controller.IndexView = centerView: ($scope,$state, testService, testValue,api) ->

  if testValue.photos_id == no
   $state.go("index.Main")
   return no

  $scope.photos_id      = testValue.photos_id
  $scope.photos_public  = testValue.photos_public

  testService.title( $scope.photos_public[ $scope.photos_id ].title )

  $scope.item = ->
    $scope.photos_public[ $scope.photos_id ]



