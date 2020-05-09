var syncData = {
    "libs": {
        "src": [
            "../static/libs/jquery-2.1.3.js",
            "../static/libs/bootstrap-v3.1.1.css"
        ],
        "destinationDir": [
            "../java/yard/src/main/resources/assets/static/libs/",
            "../java/pdf/src/main/resources/assets/static/libs/",
            "../java/WebApp/src/main/resources/assets/static/libs/"
        ]
    },
    "bootstrap-v4.4.1": {
        "src": [
            "../static/libs/bootstrap-v4.4.1.css"
        ],
        "destinationDir": [
        ]
    },
    "react": {
        "src": "../static/libs/bootstrap-react-v3.1.1.css",
        "destinationDir": "../reactjs/reactapp/src/libs/"
    },
    "yardCss": {
        "src": "../app/yard1/static/css/style.css",
        "destinationDir": [
                "../java/yard/src/main/resources/assets/s17/css/"
        ]
    },
    "stack": {
        "src": [
            "../static/js/stack.js",
        ],
        "destinationDir": [
            "../java/yard/src/main/resources/assets/static/js/",
            "../java/pdf/src/main/resources/assets/static/js/",
            "../java/WebApp/src/main/resources/assets/static/js/",
            "../reactjs/reactapp/src/libs/"
        ]
    },
    "model": {
        "src": [
            "../static/js/model.js"
        ],
        "destinationDir": [
            "../java/yard/src/main/resources/assets/static/js/",
            "../reactjs/reactapp/src/libs/"
        ]
    },
    "yardApiModel": {
        "src": "../static/js/yard/yardApiModel.js",
        "destinationDir": [
            "../java/yard/src/main/resources/assets/static/js/",
            "../reactjs/reactapp/src/libs/"
        ]
    },
    "s17Script_js": {
        "src": [
            "../app/yard-s17/static/js/s17Script.js",
            "../app/yard-s17/static/js/s17View.js"
        ],
        "destinationDir": "../java/yard/src/main/resources/assets/s17/js/"
    },
    "yard1_js": {
        "src": [
            "../app/yard1/static/js/yard1Script.js",
            "../app/yard1/static/js/yard1PointModel.js",
            "../app/yard1/static/js/yard1Controller.js",
            "../app/yard1/static/js/yard1ComponentModel.js",
        ],
        "destinationDir": "../java/yard/src/main/resources/assets/yard1/js/"
    },
    "s17Script_json": {
        "src": [
            "../app/yard-s17/static/json/async-data.json",
            "../app/yard-s17/static/json/partial-exp.json",
            "../app/yard-s17/static/json/possible-values.json",
            "../app/yard-s17/static/json/possible-values-sequence.json",
            "../app/yard-s17/static/json/possible-values-group.json",
            "../app/yard-s17/static/json/initial-value.json",
            "../app/yard-s17/static/json/expressions-evt.json",
            "../app/yard-s17/static/json/expressions-common.json",
            "../app/yard-s17/static/json/expressions-sequence-1.json",
            "../app/yard-s17/static/json/expressions-sequence-2.json",
            "../app/yard-s17/static/json/expressions-ov.json",
            "../app/yard-s17/static/json/expressions-sub-routes.json",
            "../app/yard-s17/static/json/expressions-points-common.json",
            "../app/yard-s17/static/json/expressions-point-4.json",
            "../app/yard-s17/static/json/expressions-point-5.json",
            "../app/yard-s17/static/json/expressions-point-6.json",
            "../app/yard-s17/static/json/expressions-timer.json",
            "../app/yard-s17/static/json/expressions-glow.json"
        ],
        "destinationDir": "../java/yard/src/main/resources/assets/s17/json/"
    },
    "yard1_json": {
        "src": "../app/yard1/static/json/yard.json",
        "destinationDir": "../java/yard/src/main/resources/assets/yard1/json/"
    }
};
module.exports = syncData;
