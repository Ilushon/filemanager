/* eslint-disable */
// @ts-ignore
import FileDownload from "js-file-download";
import axios from "axios";
import $ from "jquery";

class DownloadService {
  downloadSingleFile = async function(pickedFile) {
    //вызов выделенных файлов
    var get = pickedFile;
    axios
      .get("http://localhost:5000/download", {
        responseType: "blob", // бинарные данные
      })
      .then((response) => {
        FileDownload(response.data, get);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  downloadMultiple = async function() {
    axios
      .get("http://localhost:5000/zip", {
        responseType: "blob", // бинарные данные
      })
      .then((response) => {
        FileDownload(response.data, new Date().toLocaleString() + ".zip"); //для загрузки папки она архивируется с названием (Дата и время)
        $("#fileTable input:checkbox").prop("checked", false);
      })
      .catch((err) => {
        console.log(err);
      });
  };
}

export default DownloadService;
