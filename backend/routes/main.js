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