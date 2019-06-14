# Waves-Augur
Prediction Markets based on Waves RIDE for dApps DEMO case
 
## Установка
1. Убедитесь что у вас установлен [nodejs](https://nodejs.org) и [yarn](https://yarnpkg.com)

2. Клонируйте репозиторий
    ```sh
    $ git clone ssh://git@github.com:devmartynov/Waves-Augur.git Waves-Augur
    ```

3. Перейдите в директорию с проектом
    ```sh
    $ cd !$ или cd Waves-Augur
    ```

4. Установите зависимости
    ```sh
    $ yarn
    ```

5. Запустите проект.
    ```sh
    $ yarn watch
    ```

> Проект доступен по адресу http://localhost:5010

## Команды

 - сборка в статичном виде
 
 ```
 $ yarn node webpack production
 ```


  ├── public                                # Каталог с содержимым результатов сборки
  ├── src                                   # Каталог исходных файлов
  │   ├── Application.js                    # Корневой компонент приложения
  │   ├── actions                           # Redux actions 
  │   ├── index.js                          # Входная точка приложения
  │   ├── components                        # Каталог вспомогательных компонентов
  │   │   └── index.js                      # Инициалзация компонентов
  │   │                                         1. ClientStorageComponent - работа со стороджем браузера.
  │   │                                         2. HtmlComponent - работа с html. Основное использование - это БЭМ.
  │   │                                         3. HttpComponent - работа с запросами(на будущее).
  │   │                                         4. LocaleComponent - конфигурация локализации.
  │   │                                         5. StoreComponent - работа с глобальным хранилещем(Redux).
  │   │                                         6. UiComponent - работа с UI компонентами.
  │   ├── enums                             # Каталог файлов с описанием перечеслимых данных
  │   ├── reducers                          # Redux reducers
  │   ├── routes                            # Каталог отдельных страниц с их внутренними компонентами
  │   │   └── index.js                      # Дерево страниц
  │   ├── shared                            # Каталог общих компонентов
  │   ├── style                             # Каталог стилей
  │   │   └── index.scss                    # Корневой файл стилей
  │   ├── types                             # Описание часто используемых/громоздких PropTypes схем
  │   └── ui                                # Каталог UI компонентов(будут добавлны по ходу проекта)
  │       ├── form                          # UI форм
  │       ├── list                          # UI списков
  │       ├── modal                         # UI модальных окон
  │       └── nav                           # UI навигации
  └── webpack.js                            # Конфигурация webpack


