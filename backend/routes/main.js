// routing main /

const fs = require("fs")

module.exports = function (app) {

//проверка на папку.
    function isFolder(path){
        return fs.lstatSync(path).isDirectory() && fs.existsSync(path);
    }

    app.get('/', (req, res) => {  
        //обращение к странице методом get - запрос лежит в request - ответ в response /
    const base = './files/';
    let path = ''; // Папка, которая нужна пользователю.

        if ('path' in req.query){
            path = req.query.path;
        }

        if ( isFolder(base + path)) {
            // если переданный параметр - папка
            let files = fs.readdirSync(base+path).map(item => {
                const isDir = fs.statSync(base+path+ '/'+item).isDirectory(); // Является ли текущий адрес Директорией?
                let size = 0;

                if (!isDir) { 
                    size = fs.statSync(base+path+'/'+item);
                    console.log(size.size);
                }

                return { // получаем массив данных о файле
                    name: item,
                    dir: isDir,
                    size: size.size ?? 0
                }
            })
            res.json({
                path: path, // где мы находимся
                result: true, // проверка на ошибку
                files: files // обработанные файлы
            });
        }

    });
}