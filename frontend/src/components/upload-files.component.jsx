import React, { useState, useEffect } from "react";
import UploadService from "../services/upload-files.service";

const UploadFiles = () => {
  const [selectedFiles, setSelectedFiles] = useState();
  const [currentFile, setCurrentFile] = useState();
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("");
  const [fileInfos, setFileInfos] = useState([]);
  const [inputs, setInputs] = useState({
    downloadFile: "",
    fileName: "",
    fileDescription: "",
    authorName: "",
  });

  useEffect(() => {
    UploadService.getFiles().then((response) => {
      const info = [];
      for (let i = 0; i < response.data.files.length; ++i)
        info.push(response.data.files[i]);
      setFileInfos(info);
    });
  }, []);

  const selectFile = (event) => {
    setSelectedFiles(event.target.files);
  };

  const uploadFile = () => {
    let currentFile = selectedFiles[0];

    setProgress(0);
    setCurrentFile(currentFile);

    UploadService.upload(currentFile, inputs, (event) => {
      setProgress(Math.round((100 * event.loaded) / event.total));
    })
      .then((response) => {
        setMessage(response.data.message);
        return UploadService.getFiles();
      })
      .then((files) => {
        setFileInfos(files.data.files);
      })
      .catch(() => {
        setProgress(0);
        setMessage("Could not upload the file!");
        setCurrentFile(undefined);
      });

    setSelectedFiles(undefined);
  };

  const changeInput = (e) => {
    let inputName = e.target.name;
    let value = e.target.value;
    setInputs((i) => ({
      ...i,
      [inputName]: value,
    }));
  };

  const download = async (e) => {
    e.preventDefault();
    await UploadService.download(inputs.downloadFile);
  };

  return (
    <div>
      {currentFile && (
        <div className="progress">
          <div
            className="progress-bar progress-bar-info progress-bar-striped"
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin="0"
            aria-valuemax="100"
            style={{ width: progress + "%" }}
          >
            {progress}%
          </div>
        </div>
      )}

      <form>
        <div className="form-group">
          <input type="file" onChange={selectFile} />
        </div>
        <div className="form-group">
          <label>File Name</label>
          <br />
          <input
            type="text"
            name="fileName"
            value={inputs.fileName}
            onChange={changeInput}
          />
        </div>
        <div className="form-group">
          <label>Author</label>
          <br />
          <input
            type="text"
            name="authorName"
            value={inputs.authorName}
            onChange={changeInput}
          />
        </div>
        <div className="form-group">
          <label>Description</label>
          <br />
          <textarea
            type="text"
            name="fileDescription"
            value={inputs.fileDescription}
            onChange={changeInput}
            className="w-100"
          />
        </div>
        <button
          className="btn btn-success"
          type="submit"
          disabled={
            !(
              selectedFiles &&
              inputs.fileName &&
              inputs.authorName &&
              inputs.fileDescription
            )
          }
          onClick={uploadFile}
        >
          Upload File
        </button>
      </form>

      <div className="alert alert-light" role="alert">
        {message}
      </div>

      <form>
        <div className="form-group">
          <label>File Name</label>
          <br />
          <input
            type="text"
            name="downloadFile"
            value={inputs.downloadFile}
            onChange={changeInput}
          />
        </div>
        <button
          className="btn btn-success mb-4"
          disabled={!inputs.downloadFile}
          onClick={download}
        >
          Download
        </button>
      </form>

      <div className="card w-auto">
        <div className="card-header">List of Files</div>
        <ul className="list-group list-group-flush">
          {fileInfos.length &&
            fileInfos.map((file, index) => {
              console.log(fileInfos);
              return (
                <li className="list-group-item" key={index}>
                  {index}: {file.file_name}, Owner: {file.owner_address}
                </li>
              );
            })}
        </ul>
      </div>
    </div>
  );
};

export default UploadFiles;
