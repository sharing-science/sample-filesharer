import React, { useState, useEffect } from 'react'
import UploadService from '../services/upload-files.service'
import { Link } from 'react-router-dom'

import {
  Button,
  Row,
  Col,
  Input,
  Label,
  Form,
  FormGroup,
} from 'reactstrap'

import { createHash } from 'crypto';

const UploadFiles = () => {
  const [selectedFiles, setSelectedFiles] = useState()
  const [currentFile, setCurrentFile] = useState()
  const [progress, setProgress] = useState(0)
  const [message, setMessage] = useState('')
  const [fileInfos, setFileInfos] = useState([])
  const [inputs, setInputs] = useState({
    downloadFile: '',
    fileName: '',
    fileDescription: '',
    authorName: '',
  })
  const [loggedIn, setLoggedIn] = useState(false)
  const [hash, setHash] = useState('')

  useEffect(() => {
    localStorage.getItem('public_key') ? setLoggedIn(true) : setLoggedIn(false)
    UploadService.getFiles().then((response) => {
      const info = []
      for (let i = 0; i < response.data.files.length; ++i)
        info.push(response.data.files[i])
      setFileInfos(info)
    })
  }, [])

  const selectFile = (event) => {
    // Initializing the file reader
    const fr = new FileReader()

    // Listening to when the file has been read.
    fr.onload = async () => {

        let hash = ''

        //result = await sha256(fr.result);
        hash = createHash('sha256').update(JSON.stringify(fr.result)).digest('hex')


        // Setting the hashed text as the output
        setHash(hash)
    }

    // Reading the file.
    fr.readAsText(event.target.files[0])
    setSelectedFiles(event.target.files)
  }

  const uploadFile = () => {
    let currentFile = selectedFiles[0]

    setProgress(0)
    setCurrentFile(currentFile)

    UploadService.upload(currentFile, inputs, (event) => {
      setProgress(Math.round((100 * event.loaded) / event.total))
    })
      .then((response) => {
        setMessage(response.data.message)
        return UploadService.getFiles()
      })
      .then((files) => {
        setFileInfos(files.data.files)
      })
      .catch(() => {
        setProgress(0)
        setMessage('Could not upload the file!')
        setCurrentFile(undefined)
      })

    setSelectedFiles(undefined)
  }

  const changeInput = (e) => {
    let inputName = e.target.name
    let value = e.target.value
    setInputs((i) => ({
      ...i,
      [inputName]: value,
    }))
  }

  const download = async (e) => {
    e.preventDefault()
    await UploadService.download(inputs.downloadFile)
  }

  return (
    <div>
      <center className="mt-3">
        <h1>Sample File Sharer</h1>
      </center>
      <Row>
        <Col>
          <Button className="ml-4" color="default" tag={Link} to="/login">
            <i className="tim-icons icon-single-02" />{' '}
            {loggedIn ? 'Logout' : 'Login'}
          </Button>
        </Col>
        <Col>
          {currentFile && (
            <div className="progress">
              <div
                className="progress-bar progress-bar-info progress-bar-striped"
                role="progressbar"
                aria-valuenow={progress}
                aria-valuemin="0"
                aria-valuemax="100"
                style={{ width: progress + '%' }}
              >
                {progress}%
              </div>
            </div>
          )}

          <Button>
            <input type="file" className="form-control" onChange={selectFile} />
          </Button>
          <Form>
            <FormGroup>
              <Label>File Name</Label>
              <br />
              <Input
                type="text"
                name="fileName"
                value={inputs.fileName}
                onChange={changeInput}
              />
            </FormGroup>
            <FormGroup>
              <Label>Author</Label>
              <br />
              <Input
                type="text"
                name="authorName"
                value={inputs.authorName}
                onChange={changeInput}
              />
            </FormGroup>
            <FormGroup>
              <Label>Description</Label>
              <br />
              <Input
                type="text"
                name="fileDescription"
                value={inputs.fileDescription}
                onChange={changeInput}
                className="w-100"
              />
            </FormGroup>
            <Button
              className="btn btn-success"
              type="submit"
              disabled={
                !(
                  selectedFiles &&
                  inputs.fileName &&
                  inputs.authorName &&
                  inputs.fileDescription &&
                  loggedIn
                )
              }
              onClick={uploadFile}
            >
              Upload File
            </Button>
          </Form>
          <div className="alert alert-light" role="alert">
            {message}
            {'File hash: ' + hash}
          </div>

          <Form>
            <div className="form-group">
              <Label>File Name</Label>
              <br />
              <Input
                type="text"
                name="downloadFile"
                value={inputs.downloadFile}
                onChange={changeInput}
              />
              <br />
            </div>
            <Button
              className="btn btn-success mb-4"
              disabled={!(inputs.downloadFile && loggedIn)}
              onClick={download}
            >
              Download
            </Button>
          </Form>
        </Col>
        <Col></Col>
      </Row>

      <table className="table ">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Name</th>
            <th scope="col">Author</th>
            <th scope="col">Description</th>
            <th scope="col">Date</th>
          </tr>
        </thead>
        <tbody>
          {fileInfos.length > 0 && fileInfos.map((file, index) => {
            return (
              <tr key={'fileRow' + index}>
                <th scope="row">{index}</th>
                <td>{file.file_name}</td>
                <td>{file.author}</td>
                <td>{file.description}</td>
                <td>{file.date}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default UploadFiles
