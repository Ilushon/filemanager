
const express = require("express");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const { createHttpTerminator } = require("http-terminator");

const Logger = require("../Utilities/Logger");
const { Config } = require("../Utilities/Config");
const routes = require("../Controllers");

const port = Config.PORT;

let terminator;

const Setup = async () => {
	Logger.System("Запуск сервера...");

	const app = express();

	app.use(cors());
	app.use(express.json());
	app.use(express.urlencoded({ extended: false }));
	app.use(fileUpload());

	app.use("/", routes);

	const server = app.listen(port, () => {
		Logger.System(`Сервер запущен на порт: ${port}`);
	});

	terminator = createHttpTerminator({
		server: server
	});
};

const Close = async () => {
	await terminator.terminate();
	Logger.Event("Завершение работы.");
};



module.exports = {
	Setup,
	Close
};