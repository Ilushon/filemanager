Version 0.1

Версия актуальна на 20.04.22

КРАТКО:

- Выводится список того, что есть в директории ./files/------------

- Сайт запускается на "http://localhost:8000/"---------------------

Запуск - "Z:\mysite\backend> node .\server.js".

"server.js"

const express   = require('express');
const app   = express();
const port  = 8000;

require('./routes')(app);

app.listen(port, ()=>{
    console.log('work on '+port);
});

- Роутинг ----------------------------------------------------------

"index.js"

// Путь - routes/index.js

const mainRoutes = require('./main');

module.exports = function (app) {
    mainRoutes(app);

}

- "main.js"

// routing main /

const fs = require("fs")

module.exports = function (app) {

    function isFolder(path){
        return fs.lstatSync(path).isDirectory() && fs.existsSync(path);
    }

    app.get('/', (req, res) => {  
        //обращение к странице методом get - запрос лежит в request - ответ в response /
    const base = './files/';
    let path = '';

        if ( isFolder(base + path)) {
            // если переданный параметр - папка
            let files = fs.readdirSync(base+path);
            res.json(files);
        }

    });
}