const fs = require("fs");

class Path {
	// Проверка на директорию
	static isDir(path) {
		try {
			const stat = fs.lstatSync(path);
			return stat.isDirectory();
		} catch (e) {
			return false;
		}
	}
}

module.exports = Path;