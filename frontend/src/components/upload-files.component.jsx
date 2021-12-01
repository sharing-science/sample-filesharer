import React, { useState, useEffect } from "react";
import uploadFilesService from "../services/upload-files.service";
import UploadService from "../services/upload-files.service";

const UploadFiles = () => {
  const [selectedFiles, setSelectedFiles] = useState();
  const [currentFile, setCurrentFile] = useState();
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("");
  const [fileInfos, setFileInfos] = useState(0);
  const [inputs, setInputs] = useState({
    downloadFile: "",
  });

  useEffect(() => {
    UploadService.getFiles().then((response) => {
      setFileInfos(response.data.files);
    });
  }, []);

  const selectFile = (event) => {
    setSelectedFiles(event.target.files);
  };

  const upload = () => {
    let currentFile = selectedFiles[0];

    setProgress(0);
    setCurrentFile(currentFile);

    UploadService.upload(currentFile, (event) => {
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
    await uploadFilesService.download(inputs.downloadFile);
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

      <label className="btn btn-default">
        <input type="file" onChange={selectFile} />
      </label>

      <button
        className="btn btn-success"
        disabled={!selectedFiles}
        onClick={upload}
      >
        Upload
      </button>

      <div className="alert alert-light" role="alert">
        {message}
      </div>

      <label className="btn btn-default">
        <input
          type="text"
          name="downloadFile"
          value={inputs.downloadFile}
          onChange={changeInput}
        />
      </label>
      <button
        className="btn btn-success"
        disabled={!inputs.downloadFile}
        onClick={download}
      >
        Download
      </button>

      <div className="card">
        <div className="card-header">List of Files</div>
        <ul className="list-group list-group-flush">
          {fileInfos &&
            fileInfos.map((file, index) => (
              <li className="list-group-item" key={index}>
                {index}: {file}
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
};

export default UploadFiles;
