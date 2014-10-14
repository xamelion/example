###
  Тестовое приложение. Конфигурация приложения

  @author Vitaliy Kanev <1xamelion1@gmail.com>
  @see https://github.com/xamelion/example/tree/master/README.md>
  @license MIT https://github.com/xamelion/example/tree/master/LICENSE

###

window.config  =
siteLink        :      'http://localhost:63342/test/'                            # адрес сайта
useXDomain      :       false                                             # Подключать или нет useXDomain
debug           :       true                                              # Дебаг
mainPage        :       '/'                                               # Главная загружаемая страница
mainRouting     :       'index.Main'                                      # Главный роутинг
template        :       'test'                                            # Наименование шаблона
debounce        :        1000                                             # Задержка loadAllContent