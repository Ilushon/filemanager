const fs = require("fs");
const { cwd } = require("process");
const path = require("path");
const mv = require("mv");
const rimraf = require("rimraf");
const archiver = require("archiver");
const extract = require("extract-zip");
const { Router } = require("express");

const DateTime = require("../Utilities/DateTime");
const Path = require("../Utilities/Path");
const Logger = require("../Utilities/Logger");

const router = Router();

let my_path;
let myZip2;
let folder_path;

// Ответ: путь к выбранному каталогу
router.post("/sendPath", (req, res) => {
  my_path = req.body.sent_path;
  const isDir = path.dirname(my_path);
  res.send({ full_path: my_path, the_dir: isDir });
});

// Загружает файлы в каталог
router.post("/upload", (req, res) => {
  if (!req.files) {
    return res.status(500).send({ msg: "file is not found" });
  }
  const myFile = req.files.file;

  myFile.mv(`${folder_path}/${myFile.name}`, (err) => {
    if (err) {
      Logger.Error(err);
      return res.status(500).send({ msg: "Error occured" });
    }
    return res.send({ name: myFile.name, path: `/${myFile.name}` });
  });
});

// Перечисление всех подкаталогов в каталоге "files".
router.post("/getAllMainFolders", (req, res) => {
  const dirPath = "./files/";
  let result = [];
  fs.readdir(dirPath, (err, filesPath) => {
    if (err) throw err;
    result = filesPath.map((filePath) => {
      return `${dirPath}${filePath}`;
    });
    res.send(result);
  });
});

// Чтение всех файлов из выбранной директории
router.post("/getAllFilesFromSelectedFolder", (req, res) => {
  const dirPath = req.body.path_name;
  folder_path = dirPath;
  let result = [];
  let globalDir;

  if (!Path.isDir(dirPath)) globalDir = path.parse(dirPath).dir;
  else globalDir = dirPath;

  fs.readdir(globalDir, (err, filesPath) => {
    if (err) throw err;
    result = filesPath.map((filePath) => {
      return {
        paths: `${globalDir}/${filePath}`,
        names: filePath, //имя файла
        the_time: DateTime.lastUpdatedDate(`${globalDir}/${filePath}`), //время
        is_dir: Path.isDir(`${globalDir}/${filePath}`),
        fileExt: path.extname(`${globalDir}/${filePath}`),
      };
    });
    res.send(
      result.sort((a, b) => { //сортировка по времени
        return new Date(b.the_time) - new Date(a.the_time);
      })
    );
  });
});

// Метод создания новой папки:
router.post("/newFolder", (req, res) => {
  const currDir = req.body.current_path;
  const newDir = `${currDir}/${req.body.folder_name}`;

  if (Path.isDir(currDir)) {
    if (!fs.existsSync(newDir)) {
      fs.mkdirSync(newDir);
    }
  } else {
    const cleanDir = `${path.parse(currDir).dir}/${req.body.folder_name}`;
    if (!fs.existsSync(cleanDir)) {
      fs.mkdirSync(cleanDir);
    }
  }
  Logger.Event(
    `A new folder '${req.body.folder_name}' was created on ${DateTime.Now()}`
  );
  return res.sendStatus(200);
});

// Передача пользователю выбранных директорий для архивации
router.post("/sendZips", (req, res) => {
  const myZip = req.body.sentZip;
  myZip2 = req.body.sentZip;
  res.send(myZip);
});

// Загрузка файла
router.get("/download", (req, res) => {
  const selectedPath = my_path;
  Logger.Event(`Download: ${my_path}`);
  const file = path.join(cwd(), selectedPath.substring(1));
  res.sendFile(file);
});

// Просмотр файла (Аудио, видео, фото, документ)
router.get("/view", (req, res) => {
  res.sendFile(my_path, { root: cwd() });
});

// Функция удаления выбранных файлов
router.post("/delete", (req, res) => {
  const thePath = req.body.sent_path;

  thePath.forEach((filepath) => {
    rimraf(filepath, (err) => {
      if (err) return Logger.Error(err);

      Logger.Event("Успешное удаление");
    });
  });
  res.sendStatus(200);
});

// Функция перемещения файлов
router.post("/movefile", (req, res) => {
  const org = req.body.org_path;
  const dest = req.body.dest_path;

  for (let i = org.length - 1; i >= 0; i--) {
    const file = org[i];
    mv(
      file,
      `${dest}/${path.basename(file)}`,
      { mkdrip: true, clobber: false },
      (err) => {
        if (err) throw err;
        Logger.Event("Успешное перемещение.");
      }
    );
  }
  Logger.Event(`${org} ...был перемещен в... ${dest}`);
  res.sendStatus(200);
});

// Архивация выбранных файлов, или папок
router.get("/zip", (req, res) => {
  const files = myZip2;
  const archive = archiver("zip");

  archive.on("error", (err) => {
    res.status(500).send({ error: err.message });
  });

  archive.on("end", () => {
    Logger.Event("Zipped %d bytes", archive.pointer());
  });

  res.attachment("archive-name.zip");
  archive.pipe(res);

  for (const i in files) {
    archive.file(files[i], { name: path.basename(files[i]) });

    if (Path.isDir(files[i])) {
      archive.directory(files[i], path.basename(files[i]));
    }
  }
  archive.finalize();
});

// Извлечение выбранного zip-файл - поддерживаются только zip-файлы .
router.post("/extract", async (req, res) => {
  const src = req.body.path_name;
  const dest = path.dirname(src);

  try {
    const dir = path.join(cwd(), dest);
    await extract(src, { dir }).then(res.sendStatus(200));
    Logger.Event("Завершение экстракта");
  } catch (err) {
    Logger.Error(err);
  }
});

module.exports = router;
