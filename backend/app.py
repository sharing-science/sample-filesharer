from logging import error
from os import getcwd, path, mkdir, walk
from flask import Flask, json, request, session, send_from_directory, jsonify
from werkzeug.utils import secure_filename
from flask_cors import CORS

ALLOWED_EXTENSIONS = {'txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif'}
app = Flask(__name__)
CORS(app)

UPLOAD_DIRECTORY = getcwd()
app.config['UPLOAD_FOLDER'] = UPLOAD_DIRECTORY
app.config['SECRET_KEY'] = "asijfaieufi1jb2i4jbijkdsnjo32ur32r"


def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


@app.route('/upload', methods=['POST'])
def fileUpload():
    target = path.join(UPLOAD_DIRECTORY, 'Files')
    if not path.isdir(target):
        mkdir(target)
    file = request.files['file']
    filename = secure_filename(file.filename)
    if not allowed_file(filename):
        return jsonify({'message': "Incompatible File Type!"})
    destination = "/".join([target, filename])
    file.save(destination)
    session['uploadFilePath'] = destination
    return jsonify({'message': "Successfully Uploaded File!"})


@app.route('/files', methods=['GET'])
def getFiles():
    uploads = path.join(UPLOAD_DIRECTORY, 'Files')
    filename = request.args.get('filename')
    if filename:
        return send_from_directory(uploads, filename)

    filenames = next(walk(uploads), (None, None, []))[2]

    return jsonify({'files': filenames})
@app.route('/api/fileNames')
def getFileNames():
    try:
        files = Files.query.all()
    except:
        return jsonify({"files": []})
    res = []

    for i in files:
        res.append({
            'owner_address': i.owner_address,
            'file_name': i.name
        })
    return jsonify({"files": res})

