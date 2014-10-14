###
  Тестовое приложение. Конфигурация шаблона

  @author Vitaliy Kanev <1xamelion1@gmail.com>
  @see https://github.com/xamelion/example/tree/master/README.md>
  @license MIT https://github.com/xamelion/example/tree/master/LICENSE

###

_tM = "#{config.siteLink}/templates/#{config.template}"                                 # Шаблон

window.library =                                                                        # Подключаем библиотеки
  paths:
    'main'     : "#{_tM}/module/main.js?0.0.1"
  #Модули
    'index'        : "#{_tM}/module/index.js?0.0.1"
    'index.main'   : "#{_tM}/module/index.main.js?0.0.1"
    'index.view'   : "#{_tM}/module/index.view.js?0.0.1"
  shim:
    'analytics'    : exports: "analytics",deps:['jquery']

window.PhenomModule = ['main','index','index.main','index.view']                                     # Включаем библиотеки


window.MergeModule = ['ngSanitize'];                                                    # Регистрируем дополнительные ангулар модули

window.routing =                                                                        # Маршруты
  'index'         :
    abstract: true
    views:
      mainView:
        templateUrl: config.siteLink+'templates/'+config.template+'/index.html'
        controller: 'App.Controller.Index.mainView'
  'index.Main':
    url: "/"
    views:
      centerView :
        templateUrl: config.siteLink+'templates/'+config.template+'/html/main.html'
        controller: 'App.Controller.IndexMain.centerView'
  'index.View':
    url: "/view"
    views:
      centerView :
        templateUrl: config.siteLink+'templates/'+config.template+'/html/view.html'
        controller: 'App.Controller.IndexView.centerView'
