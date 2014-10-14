/**
 * Frontend Phenom, библиотека формирования интерфейса
 * @author Kanev Vitaliy <1xamelion1@gmail.com>
 * @version 1.0.0.0
 */

// переключатель requireJS / requireNode
if (window.requireNode) // в index.html
{
    //window.require = window.requireNode;
    window.requireJS = window.require;
    window.require = function()
    {
        if (arguments.length == 1) // showDevTools ~ nw.gui
            return window.requireNode.apply (null, arguments);
        else
            return window.requireJS.apply (null, arguments);
    }
}

// если Приложение: config.siteLink -> current path
if (config.siteLink === '') // window.requireNode ?
    config.siteLink = document.location.pathname.split('/').slice(0,-1).join('/');


function json_merge_recursive(json1, json2)
{
    var out = {};
    for(var k1 in json1){
        if (json1.hasOwnProperty(k1)) out[k1] = json1[k1];
    }
    for(var k2 in json2){
        if (json2.hasOwnProperty(k2)) {
            if(!out.hasOwnProperty(k2)) out[k2] = json2[k2];
            else if(
                (typeof out[k2] === 'object') && (out[k2].constructor === Object) &&
                    (typeof json2[k2] === 'object') && (json2[k2].constructor === Object)
                ) out[k2] = json_merge_recursive(out[k2], json2[k2]);
        }
    }
    return out;
}

//Приложение
var App =   {
    Controller:
    {
        'MainApp' :
        {
            'Main' : function( $rootScope,$timeout,onlineStatus )
            {
                //добавляем функционал в данную ветку ангулара из конфигурационого файла
                if( typeof( mainController ) == 'function' )
                {
                    mainController( $rootScope );
                }
            }
        }
    },
    Service: {},
    Value: {},
    Provider: {},
    Constant: {},
    Filter: {},
    Factory:
    {
        //Получение статуса подключения
        'onlineStatus'  : function( $window, $rootScope )
        {
            var onlineStatus = {};

            onlineStatus.onLine = $window.navigator.onLine;

            onlineStatus.isOnline = function() {
                return onlineStatus.onLine;
            }

            //Если есть доступ к интернету
            $window.addEventListener("online", function ()
            {
                onlineStatus.onLine = true;
                $rootScope.$digest();
            }, true);

            $window.addEventListener("offline", function () {
                onlineStatus.onLine = false;
                $rootScope.$digest();
            }, true);

            return onlineStatus;
        }
    }
};


//Подгружаем конфигурацию шаблона
require([config.siteLink+'/templates/'+config.template+'/config.js?1'], function()
{
    var configReQ = {
        //Пути к библиотекам
        paths:
        {
            'jquery'           : config.siteLink+'/assets/vendors/jquery/dist/jquery.min.js?2.1.0',
            'angular'          : config.siteLink+'/assets/vendors/angular/angular.min.js?1.2.14',
            'angular-ui-router': config.siteLink+'/assets/vendors/angular-ui-router/release/angular-ui-router.min.js?0.2.7',
            'angular-resource': config.siteLink+'/assets/vendors/angular-resource/angular-resource.min.js?0.2.7',
            'angular-sanitize': config.siteLink+'/assets/vendors/angular-sanitize/angular-sanitize.min.js?0.2.7',
            'moment'           : config.siteLink+'/assets/vendors/moment/min/moment-with-langs.min.js?2.5.1',
            'underscore'       : config.siteLink+'/assets/vendors/underscore/underscore-min.js?1.5.2',
            'loadingBar'       : config.siteLink+'/assets/vendors/angular-loading-bar/build/loading-bar.min.js?1.0.0.0',
            'animate'          : config.siteLink+'/assets/vendors/angular-animate/angular-animate.min.js?1.0.0.0'
        },

        //Регистрируем зависимости
        //надо разобраться с shim может есть возможность сделать его короче
        shim: {
            'jquery'           : {exports: "jquery"},
            'angular'          : {exports: "angular",           deps: ['jquery']},
            'animate'          : {exports: "animate",           deps: ['angular']},
            'angular-ui-router': {exports: "angular-ui-router", deps: ['angular']},
            'angular-resource' : {exports: "angular-resource", deps: ['angular']},
            'angular-sanitize' : {exports: "angular-sanitize", deps: ['angular']},
            'loadingBar'       : {exports: "loadingBar",        deps: ['angular','animate']}
        },

        noGlobal: true
    };

    define('PhenomCore', ['angular','jquery','animate','loadingBar','moment','angular-ui-router','underscore','angular-sanitize']);

    //Добавляем дополнительные пути
    configReQ.paths         =       json_merge_recursive(configReQ.paths,library.paths);
    //Добавляем дополнительные связи
    configReQ.shim          =       json_merge_recursive(configReQ.shim,library.shim);
    //Добавляем дополнительные модули
    var defaultModule       =       ['ui.router.compat', 'chieffancypants.loadingBar'];

    //Регистрируем конфигурацию
    requirejs.config( configReQ );

    //Добавляем фабрики из конфигурации
    App.Factory             =       json_merge_recursive( App.Factory,typeof(Factory) !== 'undefined'?Factory:{} );

    //Добавляем сервисы
    App.Service             =       json_merge_recursive( App.Service,typeof(Service) !== 'undefined'?Service:{} );

    //Добавляем директивы
    App.Directive           =       json_merge_recursive( App.Directive,typeof(Directive) !== 'undefined'?Directive:{} );

    //Константы
    App.Constant            =       json_merge_recursive( App.Constant,typeof(Constant) !== 'undefined'?Constant:{} );

    //Value
    App.Value               =       json_merge_recursive( App.Value,typeof(Value) !== 'undefined'?Value:{} );

    //Provider
    App.Provider            =       json_merge_recursive( App.Provider,typeof(Provider) !== 'undefined'?Provider:{} );

    //Filter
    App.Filter            =       json_merge_recursive( App.Filter,typeof(Filter) !== 'undefined'?Filter:{} );

    //Подключаемые модули Phenom
    define('PhenomModule', PhenomModule);

    /**
     * Создаём главный модуль
     */
    define('PhenomJS', ['PhenomCore','PhenomModule'],function()
    {
        var module = angular.module("PhenomJS", defaultModule.concat(typeof(MergeModule) === 'undefined'?[]:MergeModule), function( ){});

        if ( typeof _gaq == 'object' && config.googleLog == true)
        {
            //Отслеживание ошибок
            window.onerror = function(msg, url, line) {
                var preventErrorAlert = true;
                _gaq.push(['_trackEvent', 'JS Error', msg, navigator.userAgent + ' -> ' + url + " : " + line, 0, true]);
                return preventErrorAlert;
            };

            //Отслеживание ошибок Ангулара
            module.factory('$exceptionHandler', function touchExceptionHandler()
            {
                return function (exception, cause)
                {
                    exception = exception || {};

                    exception.message += ' (caused by "' + cause + '")';
                    var msg = exception.message || '',
                        eType = typeof exception,
                        stack = exception.stack || '';
                    _gaq.push(['_trackEvent', 'JS Error: AngularJS', eType + ': ' + msg, navigator.userAgent + ' -> ' + window.location.href + ' -:- ' + stack + " --|-- " + cause, 0, true]);
                };
            });
        }

        //Подключаем загрузочный скрипт
        App.Global = {
            Main:
            {
                Initialize: function()
                {
                    /**
                     * Создаём конфигурацию nested routing
                     * @since 1.0.0.0
                     */
                    module.config(function( $stateProvider, $urlRouterProvider, $locationProvider, $httpProvider )
                    {

                        if( config.useXDomain === true )
                        {
                            $httpProvider.defaults.useXDomain = true;
                            $locationProvider.html5Mode (true); // ?
                        }

                        //Страница открываемая по умолчанию
                        $urlRouterProvider.otherwise( config.mainPage );

                        //Читаем массив маршрутизации
                        for(var key in routing)
                        {
                            $stateProvider.state(key,routing[key]);
                        }
                    });


                    /**
                     * Регистрируем Provider
                     * @since 1.0.0.0
                     */
                    for( var keyProvider in App.Provider )
                    {
                        module.provider( keyProvider,App.Provider[keyProvider] );
                    }

                    /**
                     * Регистрируем Value
                     * @since 1.0.0.0
                     */
                    for( var keyValue in App.Value )
                    {
                        module.value( keyValue,App.Value[keyValue] );
                    }

                    /**
                     * Регистрируем Constant
                     * @since 1.0.0.0
                     */
                    for( var keyConstant in App.Constant )
                    {
                        module.constant( keyConstant,App.Constant[keyConstant] );
                    }

                    /**
                     * Регистрируем Service
                     * @since 1.0.0.0
                     */
                    for( var keyService in App.Service )
                    {
                        module.service( keyService,App.Service[keyService] );
                    }

                    /**
                     * Регистрируем директивы
                     * @since 1.0.0.0
                     */
                    for( var keyDirective in App.Directive )
                    {
                        module.directive( keyDirective,App.Directive[keyDirective] );
                    }

                    /**
                     * Регистрируем контроллеры
                     * @since 1.0.0.0
                     */

                    for( var keyCTRL in App.Controller )
                    {
                        var nameCTRL = 'App.Controller.'+keyCTRL+'.';
                        for( var key in App.Controller[keyCTRL] )
                        {
                            module.controller(nameCTRL + key,App.Controller[keyCTRL][key]);
                        }
                    }

                    /**
                     * Регистрируем Фабрики
                     * @since 1.0.0.0
                     */

                    for( var keyFactory in App.Factory )
                    {
                        module.factory(keyFactory,App.Factory[keyFactory]);
                    }


                    /**
                     * Регистрируем Фильтры
                     * @since 1.0.0.0
                     */

                    for( var keyFilter in App.Filter )
                    {
                        module.filter(keyFilter,App.Filter[keyFilter]);
                    }

                    /**
                     * Выполняем запрос после загрузки модуля
                     * @since 1.0.0.0
                     */
                    module.run(function( $rootScope,$location, $state,$stateParams )
                    {
                        // конфигурация
                        $rootScope.app = window.requireNode ? true : false;
                        $rootScope.config = config;

                        // доступ из выражений
                        $rootScope.$state       = $state;
                        $rootScope.$stateParams = $stateParams;

                        var changeData  =   {
                            event: false,
                            toState: false,
                            toParams: false,
                            fromState: false,
                            fromParams: false
                        }
                        //Выполняем после некоторой задержки, Чтобы все блоки подгрузились
                        var loadAllContent = _.debounce
                        (
                            function(e)
                            {
                                //предаём сигнал о том что всё загрузилось
                                $rootScope.$broadcast('$viewAllContentLoaded',changeData);

                                if( typeof( viewAllContentLoaded ) == 'function' )
                                {
                                    viewAllContentLoaded( changeData.event, changeData.toState, changeData.toParams, changeData.fromState, changeData.fromParams,$rootScope );
                                }

                                //Если подключен гугл аналитик тут выполняем код
                                if ( typeof _gaq == 'object' )
                                {
                                    _gaq.push(['_trackPageview']);
                                }
                            },
                            config.debounce || 1000
                        );

                        //Выполняем скрипты из конфигурации,при изменении любой части (выполняется много раз)
                        $rootScope.$on('$viewContentLoaded',
                        function( event, viewConfig )
                        {
                            //Запускаем на выполнение скрипт после загрузки всего контента
                            loadAllContent();

                            if( typeof( ContentLoaded ) == 'function' )
                            {
                                ContentLoaded( event, viewConfig, $state, $rootScope );
                            }
                        });

                        //При смене страницы получаем данные о странице
                        $rootScope.$on('$stateChangeSuccess',
                        function( event, toState, toParams, fromState, fromParams )
                        {
                            //Сохраняем данные о новой странице
                            changeData = {
                                event: event,
                                toState: toState,
                                toParams: toParams,
                                fromState: fromState,
                                fromParams: fromParams
                            }

                            if( typeof( ChangeSuccess ) == 'function' )
                            {
                                ChangeSuccess(event, toState, toParams, fromState, fromParams,$rootScope );
                            }
                        });
                    });
                }
            }
        }

        return module;
    });

    /**
     * Выполняем загрузочный код
     * @type {string}
     */
    window.name = "NG_DEFER_BOOTSTRAP!";
    require(['PhenomJS'],function( module )
    {
        'use strict';

        angular.element().ready(function()
        {
            /*Запускаем систему*/
            App.Global.Main.Initialize();
            angular.resumeBootstrap([module['name']]);
        });
    });
});
