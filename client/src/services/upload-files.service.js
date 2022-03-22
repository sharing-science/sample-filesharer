import http from "../http-common";

class UploadFilesService {
  upload(file, fileInfo, onUploadProgress) {
    let formData = new FormData();

    formData.append("file", file);

    return http.post(
      `/upload?fileName=${encodeURI(fileInfo.fileName)}&description=${encodeURI(
        fileInfo.fileDescription
      )}&authorName=${encodeURI(fileInfo.authorName)}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress,
      }
    );
  }

  getFiles() {
    return http.get("/api/fileNames");
  }

  download(fileName, authToken) {
    http({
      url: `/files?filename=${fileName}&authtoken=${authToken}`, //your url
      method: "GET",
      responseType: "blob", // important
    }).then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName); //or any other extension
      document.body.appendChild(link);
      link.click();
    });
  }
}

export default new UploadFilesService();
