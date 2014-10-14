
App.Factory.api = ($http, $q, $rootScope, cfpLoadingBar) ->
  http = (method, params, type, callback, blockLoading, contentType) ->

    # Переменные
    data      = if type isnt "GET" then params else {}
    params    = if type isnt "GET" then {} else params
    parse     = method.split("/")
    deferred  = $q.defer()

    #Формируем ссылку на запрос
    link      = (if parse[0] is "http:" then method else config.Api + method)

    ### Скрипт отображение загрузчика ###
    cfpLoadingBar.start()
    cfpLoadingBar.inc()
    cfpLoadingBar.set 0.3
    cfpLoadingBar.status()

    ###  Запрос http ангулар ###
    $http(
      method: "jsonp"
      url: link
      params: params
      data: data
      headers:
        "Content-Type": contentType
    )

    .success((data, status) ->
      cfpLoadingBar.complete()

      callback
        data: data
        status: status
      return
    )

    .error (data, status) ->
      cfpLoadingBar.complete()
      $rootScope.blockLoading = false  if blockLoading is true

      ### Отображаем ошибку ###
      $rootScope.$broadcast "error",
        title: "Ошибка " #+status,
        message: data.message
      deferred.reject status
      callback
        data: data
        status: status

      return

    deferred.promise

  get: (method, params, callback, blockLoading, contentType) ->
    http method, params, "GET", callback, (if typeof (blockLoading) is "undefined" then false else blockLoading), (if typeof (contentType) is "undefined" then "application/json" else contentType)

  post: (method, params, callback, blockLoading, contentType) ->
    http method, params, "POST", callback, (if typeof (blockLoading) is "undefined" then false else blockLoading), (if typeof (contentType) is "undefined" then "application/json" else contentType)

  put: (method, params, callback, blockLoading, contentType) ->
    http method, params, "PUT", callback, (if typeof (blockLoading) is "undefined" then false else blockLoading), (if typeof (contentType) is "undefined" then "application/json" else contentType)

  delete: (method, params, callback, blockLoading, contentType) ->
    http method, params, "DELETE", callback, (if typeof (blockLoading) is "undefined" then false else blockLoading), (if typeof (contentType) is "undefined" then "application/json" else contentType)



###
Основной контроллер приложения
@author Vitaliy Kanev (1xamelion1@gmail.com)
@since 0.0.0.1
###

App.Controller.MainApp.Main = (  $rootScope,$scope,$window,testService,testValue ) ->

  ### Скрипты выполняемые при смене страницы ###
  $scope.$on "$viewAllContentLoaded", ->
    return

###
Общие переменные приложения
@author Vitaliy Kanev (1xamelion1@gmail.com)
@since 0.0.0.1
###

App.Value.testValue =
  title: ""                                                                             # Заголовок страницы
  photos_id: no                                                                         # Идентификатор просматриваемой фотографии
  photos_public: []                                                                     # Массив фотографий

###
Общие сервисы приложения
@author Vitaliy Kanev (1xamelion1@gmail.com)
@since 0.0.0.1
###

App.Service.testService = ($rootScope, testValue) ->
  @title = (title) ->
    testValue.title     =   title
    $("title").text title
    return
  return